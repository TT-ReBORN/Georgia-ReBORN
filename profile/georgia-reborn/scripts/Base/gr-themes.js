/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Themes                               * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-03                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////
// * WHITE THEME COLORS * //
////////////////////////////
const whiteTheme = {
	name: 'white',
	colors: {
		primary: RGB(25, 160, 240),
		darkAccent: RGB(12, 144, 245),
		accent: RGB(12, 137, 232),
		lightAccent: RGB(10, 130, 220)
	}
};


function playlistColorsWhiteTheme() {
	// * MAIN COLORS * //
	g_pl_colors.bg = RGB(255, 255, 255);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(140, 140, 140);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(120, 120, 120) : RGB(80, 80, 80);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(80, 80, 80) : RGB(140, 140, 140);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = col.primary;
	g_pl_colors.header_sideMarker = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.header_artist_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_artist_playing = pref.layout !== 'default' ? RGB(255, 255, 255) : pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_album_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_album_playing = pref.layout !== 'default' ? RGB(245, 245, 245) : pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_info_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_info_playing = pref.layout !== 'default' ? RGB(245, 245, 245) : g_pl_colors.header_info_normal;
	g_pl_colors.header_date_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_date_playing = pref.layout !== 'default' ? RGB(245, 245, 245) : g_pl_colors.header_date_normal;
	g_pl_colors.header_line_normal = RGB(200, 200, 200);
	g_pl_colors.header_line_playing = RGB(200, 200, 200);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = col.primary;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(245, 245, 245, 130) : RGB(245, 245, 245);
	g_pl_colors.row_selection_bg = RGB(200, 200, 200);
	g_pl_colors.row_selection_frame = g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = col.primary;
	g_pl_colors.row_title_normal = pref.layout !== 'compact' ? pref.styleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) : pref.layout === 'compact' ? pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) : '';
	g_pl_colors.row_title_playing = RGB(245, 245, 245);
	g_pl_colors.row_title_selected = RGB(0, 0, 0);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(200, 200, 200);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = RGB(120, 120, 120);
	g_pl_colors.sbar_btn_hovered = RGB(0, 0, 0);
	g_pl_colors.sbar_thumb_normal = RGB(200, 200, 200);
	g_pl_colors.sbar_thumb_hovered = RGB(120, 120, 120);
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsWhiteTheme() {
	// * MAIN COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;
	ui.col.imgOverlaySel = pref.styleBlackAndWhite ? RGBA(230, 230, 230, 175) : RGBtoRGBA(ui.col.bg, 175);

	// * ROW COLORS * //
	ui.col.nowPlayingBg = pref.styleBlackAndWhite ? RGB(230, 230, 230) : g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker =
		pref.styleBlackAndWhite ? isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255) :
		pref.styleBlackAndWhite2 ? isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40) :
		ui.col.nowPlayingBg;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = pref.styleBlackAndWhite ? RGB(220, 220, 220) : pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	ui.col.iconPlus_h = pref.styleBlackAndWhite ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.iconPlus_sel = pref.styleBlackAndWhite ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.iconPlusBg = RGB(240, 240, 240);
	ui.col.iconMinus_e = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(0, 0, 0);

	// * TEXT COLORS * //
	ui.col.text =
		ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) :
		pref.styleBlackAndWhite ? RGB(200, 200, 200) :
		pref.styleBlend ? RGB(60, 60, 60) :
		RGB(100, 100, 100);

	ui.col.text_h =
		ppt.albumArtShow && img.labels.overlayDark ||
		pref.styleBlackAndWhite && (!ppt.albumArtShow || ppt.albumArtShow && ppt.highLightRow !== 2) ? RGB(255, 255, 255) :
		RGB(0, 0, 0);

	ui.col.text_nowp =
		pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || ppt.albumArtShow && img.labels.overlayDark ||
		lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

	ui.col.textSel =
		pref.styleBlackAndWhite ?
			ppt.albumArtShow && ([1, 3].includes(ppt.albumArtLabelType) || ['coversLabelsBottom', 'coversLabelsBlend'].includes(pref.libraryDesign)) ||
			pref.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(255, 255, 255) :
		ppt.albumArtShow && !img.labels.overlayDark && ppt.albumArtLabelType !== 2 && !pref.styleBlackAndWhite2 ? lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255) :
		RGB(0, 0, 0);

	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = pref.styleBlackAndWhite ? RGB(200, 200, 200) : pref.styleBlend ? RGB(40, 40, 40) : RGB(80, 80, 80);
	ui.col.count = ui.col.text;

	// * BUTTON COLORS * //
	ui.col.search = pref.styleBlackAndWhite ? RGB(200, 200, 200) : pref.styleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100);
	ui.col.searchBtn = pref.styleBlackAndWhite ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.crossBtn = pref.styleBlackAndWhite ? RGB(255, 255, 255) : pref.styleBlend ? RGB(40, 40, 40) : RGB(80, 80, 80);
	ui.col.filterBtn = pref.styleBlackAndWhite ? RGB(220, 220, 220) : pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	ui.col.settingsBtn = pref.styleBlackAndWhite ? RGB(220, 220, 220) : pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	ui.col.line = pref.styleBlackAndWhite ? RGB(45, 45, 45) : RGB(200, 200, 200);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = RGB(120, 120, 120);
	ui.col.sbarNormal = RGB(114, 114, 114);
	ui.col.sbarHovered = RGB(120, 120, 120);
	ui.col.sbarDrag = RGB(120, 120, 120);
}


function biographyColorsWhiteTheme() {
	// * MAIN COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText =
		pref.layout === 'artwork' ? pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.styleBlackAndWhite ? RGB(220, 220, 220) :
		pref.styleBlackAndWhite2 ? RGB(80, 80, 80) :
		g_pl_colors.header_artist_playing;

	uiBio.col.bottomLine = (uiBio.blur.blend || uiBio.blur.light) ? RGB(120, 120, 120) : g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text =
		pref.styleBlackAndWhite ? RGB(200, 200, 200) :
		pref.styleBlackAndWhite2 ? RGB(80, 80, 80) :
		g_pl_colors.row_title_normal;

	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = RGB(220, 160, 40);
	uiBio.col.noPhotoStubBg =  RGB(245, 245, 245);
	uiBio.col.noPhotoStubText = RGB(120, 120, 120);

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = RGB(120, 120, 120);
	uiBio.col.sbarNormal = RGB(114, 114, 114);
	uiBio.col.sbarHovered = RGB(120, 120, 120);
	uiBio.col.sbarDrag = RGB(120, 120, 120);
}


function mainColorsWhiteTheme() {
	// * MAIN COLORS * //
	col.bg = pref.styleBevel ? RGB(255, 255, 255) : RGB(245, 245, 245);
	col.loadingThemeBg = pref.styleBlackAndWhite ? RGB(230, 230, 230) : pref.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245);
	col.uiHacksFrame =
		pref.styleBlackAndWhite ? pref.styleBevel ? RGB(255, 255, 255) : RGB(230, 230, 230) :
		pref.styleBlackAndWhite2 ? pref.styleBevel ? RGB(50, 50, 50) : RGB(25, 25, 25) :
		RGB(245, 245, 245);
	col.shadow = pref.styleBlackAndWhite2 ? RGBA(0, 0, 0, 240) : RGBA(0, 0, 0, 25);
	col.discArtShadow = pref.styleBlackAndWhite2 ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 10);
	col.noAlbumArtStub = pref.styleBlend || pref.styleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.lowerBarArtist = pref.styleBlend || pref.styleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = pref.lyricsAlbumArt ? RGB(255, 240, 150) : RGB(220, 160, 40);
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = col.primary !== RGB(25, 160, 240) && albumArt && !isStreaming ? col.primary : RGB(255, 255, 255);
	col.detailsText = isStreaming || isPlayingCD || !albumArt ? RGB(120, 120, 120) : lightBg ? RGB(55, 55, 55) : RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 50 : 40) : col.lightAccent_50;
	col.timelinePlayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 35 : 25) : col.lightAccent_35;
	col.timelineUnplayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 20 : 10) : col.lightAccent;
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = pref.styleBlackAndWhite ? RGB(230, 230, 230) : pref.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = pref.styleBlackAndWhite ? RGB(0, 0, 0) : pref.styleBlackAndWhite2 ? RGB(255, 255, 255) : lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(255, 255, 255) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
		RGB(255, 255, 255);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
		pref.styleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220);

	col.menuRectStyleEmbossTop = RGB(255, 255, 255);
	col.menuRectStyleEmbossBottom = pref.styleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleAlternative2 ? RGB(190, 190, 190) :
		RGB(200, 200, 200);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleAlternative2 ? RGB(190, 190, 190) :
		RGB(200, 200, 200);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.menuTextHovered = RGB(80, 80, 80);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = (pref.styleBlend || pref.styleBlend2) && fb.IsPlaying ? RGB(230, 230, 230) : RGB(255, 255, 255);
	col.transportEllipseNormal =  pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) : RGB(220, 220, 220);
	col.transportEllipseHovered = pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(160, 160, 160) : RGB(170, 170, 170) : RGB(180, 180, 180);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'emboss' ? RGB(225, 225, 225) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(255, 255, 255) :
		pref.styleTransportButtons === 'emboss' ? RGB(255, 255, 255) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(190, 190, 190) : RGB(215, 215, 215) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

	col.transportIconNormal =  pref.styleBlend || pref.styleBlend2 || pref.styleTransportButtons === 'minimal' ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.transportIconHovered = pref.styleBlend || pref.styleBlend2 || pref.styleTransportButtons === 'minimal' ? RGB(0, 0, 0) : RGB(60, 60, 60);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGB(245, 245, 245) : RGB(220, 220, 220) :
		pref.styleBevel ? pref.styleBlend || pref.styleBlend2 ? RGB(235, 235, 235) : RGB(200, 200, 200) :
		(pref.styleBlend || pref.styleBlend2) && fb.IsPlaying && !noAlbumArtStub ? RGB(240, 240, 240) :
		RGB(220, 220, 220);

	col.progressBarStreaming = RGB(207, 0, 5);
	col.progressBarFrame = pref.styleBevel ? RGB(180, 180, 180) : col.bg;
	col.progressBarFill = pref.styleBevel ? shadeColor(col.primary, 5) : col.primary;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness < 75 ? tintColor(col.primary, 40) : shadeColor(col.primary, 40);
	col.peakmeterBarFillTop       = tintColor(col.primary,  10);
	col.peakmeterBarFillMiddle    = tintColor(col.primary,  30);
	col.peakmeterBarFillBack      = tintColor(col.primary,  50);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = shadeColor(col.primary, 10);
	col.peakmeterBarVertFillPeaks = tintColor(col.primary,  20);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = col.primary;
	col.waveformBarFillBack     = shadeColor(col.primary, 20);
	col.waveformBarFillPreFront = pref.styleBevel || pref.styleBlend ? RGB(140, 140, 140) : RGB(180, 180, 180);
	col.waveformBarFillPreBack  = pref.styleBevel || pref.styleBlend ? RGB(120, 120, 120) : RGB(160, 160, 160);
	col.waveformBarIndicator    = colBrightness > 200 ? RGB(0, 0, 0) : tintColor(col.primary, 30);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(255, 255, 255);
	col.volumeBarFrame = RGB(220, 220, 220);
	col.volumeBarFill = col.primary;

	// * STYLE COLORS * //
	col.styleBevel = pref.styleBevel && pref.styleBlackAndWhite2 ? RGB(0, 0, 0) : RGB(40, 40, 40);
	col.styleGradient = '';
	col.styleGradient2 = '';

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(0, 0, 0, 40) :
											pref.styleBevel ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, pref.styleAlternative || pref.styleAlternative2 ? 30 : 50) : RGBA(0, 0, 0, 50) :
											pref.styleBevel ? RGBA(0, 0, 0, pref.styleAlternative || pref.styleAlternative2 ? 15 : 20) : RGBA(0, 0, 0, pref.styleAlternative || pref.styleAlternative2 ? 10 : 20) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 160) : pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
																						pref.styleBevel ? pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 80)  : RGBA(255, 255, 255, 100) : pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 220) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 100) : RGBA(255, 255, 255, 140) : pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
																						pref.styleBevel ? pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 80)  : RGBA(255, 255, 255, 140) : pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? RGBA(0, 0, 0, 30) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';
}


////////////////////////////
// * BLACK THEME COLORS * //
////////////////////////////
const blackTheme = {
	name: 'black',
	colors: {
		primary: RGB(175, 205, 225),
		darkAccent: RGB(160, 160, 160),
		accent: RGB(180, 180, 180),
		lightAccent: RGB(220, 220, 220)
	}
};


function playlistColorsBlackTheme() {
	// * MAIN COLORS * //
	g_pl_colors.bg = RGB(20, 20, 20);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(180, 180, 180);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(200, 200, 200) : RGB(240, 240, 240);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(240, 240, 240) : RGB(180, 180, 180);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = colBrightness < 25 ? col.lightAccent : col.primary;
	g_pl_colors.header_sideMarker = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.header_artist_normal = RGB(220, 220, 220);
	g_pl_colors.header_artist_playing = RGB(255, 255, 255);
	g_pl_colors.header_album_normal = RGB(200, 200, 200);
	g_pl_colors.header_album_playing = RGB(245, 245, 245);
	g_pl_colors.header_info_normal = RGB(200, 200, 200);
	g_pl_colors.header_info_playing = RGB(245, 245, 245);
	g_pl_colors.header_date_normal = RGB(220, 220, 220);
	g_pl_colors.header_date_playing = RGB(245, 245, 245);
	g_pl_colors.header_line_normal = pref.styleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);
	g_pl_colors.header_line_playing =  RGB(25, 25, 25);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
	g_pl_colors.row_selection_bg = pref.styleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);
	g_pl_colors.row_selection_frame = g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = colBrightness < 25 ? col.lightAccent_35 : col.primary;
	g_pl_colors.row_title_normal = RGB(200, 200, 200);
	g_pl_colors.row_title_playing = RGB(245, 245, 245);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = pref.styleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = RGB(100, 100, 100);
	g_pl_colors.sbar_btn_hovered = RGB(160, 160, 160);
	g_pl_colors.sbar_thumb_normal = RGB(100, 100, 100);
	g_pl_colors.sbar_thumb_hovered = RGB(160, 160, 160);
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsBlackTheme() {
	// * MAIN COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = RGB(220, 220, 220);
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(45, 45, 45);
	ui.col.iconMinus_e = RGB(220, 220, 220);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = RGB(200, 200, 200);
	ui.col.text_h =
		pref.styleBlackReborn && ppt.albumArtShow && lightBg ?
		ppt.highLightRow === 2 ? RGB(0, 0, 0) : RGB(255, 255, 255) :
		RGB(255, 255, 255);

	ui.col.text_nowp =
		lightBg ? ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0) :
		RGB(255, 255, 255);

	ui.col.textSel =
		ppt.albumArtShow ?
			lightBg ? img.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0) : RGB(255, 255, 255) :
		RGB(255, 255, 255);

	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(200, 200, 200);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(200, 200, 200);

	// * BUTTON COLORS * //
	ui.col.searchBtn = RGB(255, 255, 255);
	ui.col.crossBtn = RGB(255, 255, 255);
	ui.col.filterBtn = RGB(220, 220, 220);
	ui.col.settingsBtn = RGB(220, 220, 220);
	ui.col.line = pref.styleBlend ? RGB(60, 60, 60) : RGB(45, 45, 45);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = RGB(100, 100, 100);
	ui.col.sbarNormal = RGB(226, 226, 226);
	ui.col.sbarHovered = RGB(160, 160, 160);
	ui.col.sbarDrag = RGB(160, 160, 160);
}


function biographyColorsBlackTheme() {
	// * MAIN COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText =
		uiBio.blur.blend ? g_pl_colors.header_artist_playing :
		uiBio.blur.light ? RGB(65, 65, 65) :
		g_pl_colors.header_artist_playing;

	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = RGB(220, 160, 40);
	uiBio.col.noPhotoStubBg = RGB(25, 25, 25);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = RGB(100, 100, 100);
	uiBio.col.sbarNormal = RGB(226, 226, 226);
	uiBio.col.sbarHovered = RGB(160, 160, 160);
	uiBio.col.sbarDrag = RGB(160, 160, 160);
}


function mainColorsBlackTheme() {
	// * MAIN COLORS * //
	col.bg = pref.styleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25);
	col.loadingThemeBg = RGB(25, 25, 25);
	col.uiHacksFrame = pref.styleBlackReborn && fb.IsPlaying && !isStreaming && !isPlayingCD ? col.primary : RGB(35, 35, 35);
	col.shadow =
		pref.styleBevel && (pref.theme !== 'black' && !pref.styleBlackReborn) ? RGBA(0, 0, 0, 240) :
		pref.styleAlternative ? RGBA(0, 0, 0, 100) :
		pref.styleAlternative2 ? RGBA(0, 0, 0, 240) :
		RGBA(0, 0, 0, 120);
	col.discArtShadow = pref.styleBlackReborn ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 40);
	col.noAlbumArtStub = isStreaming ? RGB(240, 240, 240) : RGB(175, 205, 225);
	col.lowerBarArtist = RGB(240, 240, 240);
	col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? RGB(220, 220, 220) : RGB(200, 200, 200);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = pref.lyricsAlbumArt ? RGB(255, 240, 150) : RGB(220, 160, 40);
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = col.primary !== RGB(25, 160, 240) && albumArt && !isStreaming ? col.primary : RGB(20, 20, 20);
	col.detailsText = isStreaming || isPlayingCD || !albumArt ? RGB(255, 255, 255) : lightBg ? col.darkAccent_75 : !albumArt ? RGB(120, 120, 120) : col.lightAccent_100;
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 50 : 40) : col.lightAccent_50;
	col.timelinePlayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 35 : 25) : col.lightAccent_35;
	col.timelineUnplayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 20 : 10) : col.lightAccent;
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'inner'  ? pref.styleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'emboss' ? RGB(45, 45, 45) :
		RGB(35, 35, 35);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'inner'  ? RGB(20, 20, 20) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
		pref.styleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);

	col.menuRectStyleEmbossTop = pref.styleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70);
	col.menuRectStyleEmbossBottom = RGB(0, 0, 0);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) :
		pref.styleTopMenuButtons === 'bevel'  ? RGB(0, 0, 0) :
		RGB(60, 60, 60);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
		RGB(120, 120, 120);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(200, 200, 200) : RGB(180, 180, 180);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg =
		(pref.styleBlend || pref.styleBlend2) && fb.IsPlaying ?
		pref.styleProgressBar === 'bevel' ? RGB(36, 36, 36) :
		pref.styleProgressBar === 'inner' ? RGB(37, 37, 37) :
		RGB(35, 35, 35) : RGB(35, 35, 35);
	col.transportEllipseNormal = RGB(60, 60, 60);
	col.transportEllipseHovered = RGB(120, 120, 120);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(20, 20, 20) :
		pref.styleTransportButtons === 'emboss' ? RGB(50, 50, 50) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(50, 50, 50) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(10, 10, 10) :
		pref.styleTransportButtons === 'emboss' ? RGB(20, 20, 20) : '';

	col.transportIconNormal = RGB(160, 160, 160);
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar =
		pref.styleProgressBar === 'bevel' ? RGB(36, 36, 36) :
		pref.styleProgressBar === 'inner' ? RGB(37, 37, 37) :
		RGB(35, 35, 35);

	col.progressBarStreaming = RGB(207, 0, 5);
	col.progressBarFrame = pref.styleBevel ? RGB(0, 0, 0) : col.bg;
	col.progressBarFill = colBrightness < 25 ? tintColor(col.primary, 25) : colBrightness < 50 ? col.lightAccent_7 : col.primary;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness > 200 ? shadeColor(col.primary, 40) : colBrightness < 50 ? tintColor(col.primary, 50) : tintColor(col.primary, 40);
	col.peakmeterBarFillTop       = colBrightness <  50 ? tintColor(col.primary,  20) : tintColor(col.primary,  10);
	col.peakmeterBarFillMiddle    = colBrightness <  50 ? tintColor(col.primary,  40) : tintColor(col.primary,  30);
	col.peakmeterBarFillBack      = colBrightness <  50 ? tintColor(col.primary,  30) : shadeColor(col.primary, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = colBrightness <  50 ? tintColor(col.primary,  20) : shadeColor(col.primary, 10);
	col.peakmeterBarVertFillPeaks = colBrightness <  50 ? tintColor(col.primary,  30) : tintColor(col.primary,  20);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness < 50 ? tintColor(col.primary, 40) : colBrightness < 100 ? tintColor(col.primary, 20) : col.primary;
	col.waveformBarFillBack     = colBrightness < 50 ? tintColor(col.primary, 20) : colBrightness < 100 ? col.primary : shadeColor(col.primary, 20);
	col.waveformBarFillPreFront = RGB(100, 100, 100);
	col.waveformBarFillPreBack  = RGB(80, 80, 80);
	col.waveformBarIndicator    = colBrightness > 200 ? RGB(255, 255, 255) : RGB(220, 220, 220);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(35, 35, 35);
	col.volumeBarFrame = RGB(60, 60, 60);
	col.volumeBarFill = col.progressBarFill;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = '';
	col.styleGradient2 = '';
	col.styleAlternative = pref.styleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25);

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
		pref.styleProgressBar === 'inner' ? RGBA(0, 0, 0, 100) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? RGBA(0, 0, 0, 255) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
											pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 50) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(255, 255, 255, 25) :
											pref.styleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 10) :
											pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 15) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';
}


////////////////////////////////////
// * REBORN/RANDOM THEME COLORS * //
////////////////////////////////////
const rebornTheme = {
	name: 'reborn',
	colors: {
		primary: RGB(90, 90, 90),
		primary_alt: RGB(90, 90, 90),
		darkAccent: RGB(60, 60, 60),
		accent: RGB(80, 80, 80),
		lightAccent: RGB(100, 100, 100)
	}
};

const randomTheme = {
	name: 'random',
	colors: {
		primary: RGB(65, 65, 65),
		darkAccent: RGB(60, 60, 60),
		accent: RGB(80, 80, 80),
		lightAccent: RGB(100, 100, 100)
	}
};


function playlistColorsRebornRandomTheme() {
	// * MAIN COLORS * //
	g_pl_colors.bg =
		// * Need this extra condition to overwrite col.primary when switching themes, no album art loaded i.e on startup and going back to Reborn/Random theme.
		// * Reborn/Random theme should stay default white and not the defined col.primary dark gray
		!fb.IsPlaying || !albumArt || col.primary === RGB(90, 90, 90) && !fb.IsPlaying || col.primary === RGB(25, 160, 240) && !fb.IsPlaying ? RGB(255, 255, 255) :
		pref.layout !== 'default' ? col.lightAccent_2 : col.primary;
	// * Assigned after background has been initialized
	isColored = g_pl_colors.bg !== RGB(255, 255, 255);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(140, 140, 140);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(120, 120, 120) : RGB(80, 80, 80);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(80, 80, 80) : RGB(140, 140, 140);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg =
		pref.theme === 'reborn' ? isColored ? pref.styleBlend ? RGBtoRGBA(col.lightAccent_7, 130) : col.lightAccent_7 :
			col.primary :
		pref.theme === 'random' ? isColored ? pref.styleBlend ? RGBtoRGBA(col.lightAccent_10, 130) : lightBg ? shadeColor(col.primary, 5) : col.lightAccent_10 :
			col.primary : '';

	g_pl_colors.header_sideMarker = isColored ? col.lightAccent_50 : col.primary;
	g_pl_colors.header_artist_normal = RGB(120, 120, 120);
	g_pl_colors.header_artist_playing = RGB(120, 120, 120);
	g_pl_colors.header_album_normal = RGB(120, 120, 120);
	g_pl_colors.header_album_playing = RGB(120, 120, 120);
	g_pl_colors.header_info_normal = RGB(120, 120, 120);
	g_pl_colors.header_info_playing = g_pl_colors.header_info_normal;
	g_pl_colors.header_date_normal = RGB(120, 120, 120);
	g_pl_colors.header_date_playing = g_pl_colors.header_date_normal;
	g_pl_colors.header_line_normal = isColored ? pref.styleBlend ? shadeColor(col.primary, 24) : col.accent : RGB(200, 200, 200);
	g_pl_colors.header_line_playing = isColored ? pref.styleBlend ? shadeColor(col.primary, 24) : col.accent : RGB(200, 200, 200);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = isColored ? pref.styleBlend ? RGBtoRGBA(col.lightAccent_7, 130) : col.lightAccent_2 : RGB(245, 245, 245);
	g_pl_colors.row_selection_bg = isColored ? pref.styleBlend ? shadeColor(col.primary, 24) : col.accent : RGB(200, 200, 200);
	g_pl_colors.row_selection_frame = g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(100, 100, 100);
	g_pl_colors.row_title_playing = noAlbumArtStub && pref.styleAlternative2 ? RGB(20, 20, 20) : RGB(245, 245, 245);
	g_pl_colors.row_title_selected = RGB(0, 0, 0);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = isColored ? pref.styleBlend ? shadeColor(col.primary, 24) : col.accent : RGB(200, 200, 200);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = RGB(120, 120, 120);
	g_pl_colors.sbar_btn_hovered = RGB(0, 0, 0);
	g_pl_colors.sbar_thumb_normal = RGB(200, 200, 200);
	g_pl_colors.sbar_thumb_hovered = RGB(120, 120, 120);
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;

	// * WHEN PLAYING * //
	if (fb.IsPlaying && isColored) {
		if (pref.styleRebornFusion || pref.styleRebornFusion2 ? lightBgPlaylist : lightBg) {
			// * PLAYLIST MANAGER COLORS * //
			g_pl_colors.plman_text_normal = pref.autoHidePlman ? col.primary : col.darkAccent_75;
			g_pl_colors.plman_text_hovered = col.darkAccent_100;
			g_pl_colors.plman_text_pressed = col.darkAccent_100;

			// * HEADER COLORS * //
			g_pl_colors.header_artist_normal = col.darkAccent_75;
			g_pl_colors.header_artist_playing = col.darkAccent_75;
			g_pl_colors.header_album_normal = col.darkAccent_75;
			g_pl_colors.header_album_playing = col.darkAccent_75;
			g_pl_colors.header_info_normal = col.darkAccent_75;
			g_pl_colors.header_info_playing = col.darkAccent_75;
			g_pl_colors.header_date_normal = col.darkAccent_75;
			g_pl_colors.header_date_playing = col.darkAccent_75;

			// * ROW COLORS * //
			g_pl_colors.row_title_normal = col.darkAccent_65;
			g_pl_colors.row_title_playing = col.darkAccent_100;
			g_pl_colors.row_title_selected = col.darkAccent_100;
			g_pl_colors.row_title_hovered = col.darkAccent_100;

			// * SCROLLBAR COLORS * //
			g_pl_colors.sbar_btn_normal = col.darkAccent_75;
			g_pl_colors.sbar_btn_hovered = col.darkAccent_100;
			g_pl_colors.sbar_thumb_normal = col.darkAccent;
			g_pl_colors.sbar_thumb_hovered = pref.styleBlend ? col.lightAccent_80 : col.lightAccent_50;
			g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
		}
		else {
			// * PLAYLIST MANAGER COLORS * //
			g_pl_colors.plman_text_normal = pref.autoHidePlman ? col.primary : col.lightAccent_80;
			g_pl_colors.plman_text_hovered = col.lightAccent_100;
			g_pl_colors.plman_text_pressed = col.lightAccent_100;

			// * HEADER COLORS * //
			g_pl_colors.header_artist_normal = col.lightAccent_80;
			g_pl_colors.header_artist_playing = col.lightAccent_100;
			g_pl_colors.header_album_normal = col.lightAccent_80;
			g_pl_colors.header_album_playing = col.lightAccent_100;
			g_pl_colors.header_info_normal = col.lightAccent_80;
			g_pl_colors.header_info_playing = col.lightAccent_100;
			g_pl_colors.header_date_normal = col.lightAccent_80;
			g_pl_colors.header_date_playing = col.lightAccent_100;

			// * ROW COLORS * //
			g_pl_colors.row_title_normal = col.lightAccent_80;
			g_pl_colors.row_title_playing = col.lightAccent_100;
			g_pl_colors.row_title_selected = col.lightAccent_100;
			g_pl_colors.row_title_hovered = col.lightAccent_100;

			// * SCROLLBAR COLORS * //
			g_pl_colors.sbar_btn_normal = col.lightAccent_80;
			g_pl_colors.sbar_btn_hovered = col.lightAccent_100;
			g_pl_colors.sbar_thumb_normal = col.lightAccent_35;
			g_pl_colors.sbar_thumb_hovered =  pref.styleBlend ? col.lightAccent_80 : col.lightAccent_50;
			g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
		}
	}
}


function libraryColorsRebornRandomTheme() {
	// * MAIN COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = ppt.albumArtShow ? tintColor(g_pl_colors.row_nowplaying_bg, 7) : g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = RGB(120, 120, 120);
	ui.col.iconPlus_h = RGB(0, 0, 0);
	ui.col.iconPlus_sel = !fb.IsPlaying && !ppt.albumArtShow && !pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.iconPlusBg = RGB(240, 240, 240);
	ui.col.iconMinus_e = RGB(120, 120, 120);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(0, 0, 0);

	// * TEXT COLORS * //
	ui.col.text = noAlbumArtStub && ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) : RGB(100, 100, 100);
	ui.col.text_h = noAlbumArtStub && ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.text_nowp = noAlbumArtStub && ppt.albumArtShow && img.labels.overlayDark || noAlbumArtStub && pref.styleAlternative2 ? RGB(0, 0, 0) : RGB(255, 255, 255);

	ui.col.textSel =
		!['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(pref.libraryDesign) || ![2, 1].includes(ppt.albumArtLabelType) ||
		(['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(pref.libraryDesign) ||  [2, 1].includes(ppt.albumArtLabelType)) && !pop.highlight.nowPlaying ?
			!isColored && !noAlbumArtStub && !ppt.albumArtShow && pop.highlight.nowPlaying || noAlbumArtStub && !ppt.albumArtShow || noAlbumArtStub && ppt.albumArtShow && img.labels.overlayDark || noAlbumArtStub && pref.styleAlternative2 ?
			RGB(0, 0, 0) : RGB(255, 255, 255) :
		ui.col.text_h;

	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(80, 80, 80);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(100, 100, 100);

	// * BUTTON COLORS * //
	ui.col.searchBtn = RGB(0, 0, 0);
	ui.col.crossBtn = RGB(80, 80, 80);
	ui.col.filterBtn = RGB(120, 120, 120);
	ui.col.settingsBtn = RGB(120, 120, 120);
	ui.col.line = isColored ? pref.styleBlend ? shadeColor(col.primary, 24) : col.accent : RGB(200, 200, 200);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = isColored ? ui.col.text : RGB(120, 120, 120);
	ui.col.sbarNormal = RGB(200, 200, 200);
	ui.col.sbarHovered = RGB(120, 120, 120);
	ui.col.sbarDrag = RGB(120, 120, 120);

	// * WHEN PLAYING * //
	if (fb.IsPlaying && isColored) {
		if (pref.styleRebornFusion || pref.styleRebornFusion2 ? lightBgLibrary : lightBg) {
			// * NODE COLORS * //
			ui.col.iconPlus = col.darkAccent_75;
			ui.col.iconPlus_h = col.darkAccent_100;
			ui.col.iconPlus_sel = col.darkAccent_100;
			ui.col.iconPlusBg = col.lightAccent_7;
			ui.col.iconMinus_e = col.darkAccent_75;
			ui.col.iconMinus_h = col.darkAccent_100;

			// * TEXT COLORS * //
			ui.col.text = ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) : ppt.albumArtShow ? col.darkAccent_75 : col.darkAccent_65;
			ui.col.text_h = ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) : col.darkAccent_100;
			ui.col.text_nowp = col.darkAccent_100;
			ui.col.textSel = col.darkAccent_100;
			ui.col.txt_box = col.darkAccent_75;
			ui.col.search = col.darkAccent_75;

			// * BUTTON COLORS * //
			ui.col.searchBtn = col.darkAccent_75;
			ui.col.crossBtn = col.darkAccent_75;
			ui.col.filterBtn = col.darkAccent_75;
			ui.col.settingsBtn = col.darkAccent_75;
			ui.col.line = col.accent;

			// * SCROLLBAR COLORS * //
			ui.col.sbarBtns = ui.col.text;
			ui.col.sbarNormal = col.darkAccent;
			ui.col.sbarHovered = col.lightAccent_50;
			ui.col.sbarDrag = col.lightAccent_50;
		}
		else {
			// * NODE COLORS * //
			ui.col.iconPlus = col.lightAccent_80;
			ui.col.iconPlus_h = col.lightAccent_100;
			ui.col.iconPlus_sel = col.lightAccent_100;
			ui.col.iconPlusBg = col.lightAccent_7;
			ui.col.iconMinus_e = col.lightAccent_80;
			ui.col.iconMinus_h = col.lightAccent_100;

			// * TEXT COLORS * //
			ui.col.text = ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) : col.lightAccent_80;
			ui.col.text_h = ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) : col.lightAccent_100;
			ui.col.text_nowp = col.lightAccent_100;
			ui.col.textSel = col.lightAccent_100;
			ui.col.txt_box = col.lightAccent_80;
			ui.col.search = col.lightAccent_80;

			// * BUTTON COLORS * //
			ui.col.searchBtn = col.lightAccent_80;
			ui.col.crossBtn = col.lightAccent_80;
			ui.col.filterBtn = col.lightAccent_80;
			ui.col.settingsBtn = col.lightAccent_80;
			ui.col.line = col.accent;

			// * SCROLLBAR COLORS * //
			ui.col.sbarBtns = ui.col.text;
			ui.col.sbarNormal = col.lightAccent;
			ui.col.sbarHovered = col.lightAccent_50;
			ui.col.sbarDrag = col.lightAccent_50;
		}
	}
}


function biographyColorsRebornRandomTheme() {
	// * MAIN COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = g_pl_colors.header_artist_playing;
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = RGB(220, 160, 40);
	uiBio.col.noPhotoStubBg = isColored ? col.lightAccent_7 : RGB(245, 245, 245);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = isColored ? uiBio.col.text : RGB(120, 120, 120);
	uiBio.col.sbarNormal = RGB(200, 200, 200);
	uiBio.col.sbarHovered = RGB(120, 120, 120);
	uiBio.col.sbarDrag = RGB(120, 120, 120);

	// * WHEN PLAYING * //
	if (fb.IsPlaying && isColored) {
		if (pref.styleRebornFusion || pref.styleRebornFusion2 ? lightBgBiography : lightBg) {
			// * HEADER COLORS * //
			uiBio.col.headingText = col.darkAccent_75;
			uiBio.col.source = col.darkAccent_75;
			uiBio.col.bottomLine = col.darkAccent;
			uiBio.col.centerLine = col.darkAccent;

			// * TEXT COLORS * //
			uiBio.col.text = col.darkAccent_75;

			// * SCROLLBAR COLORS * //
			uiBio.col.sbarBtns =
				isColored && !uiBio.blur.dark && !uiBio.blur.blend && !uiBio.blur.light ? col.darkAccent_100 :
				uiBio.blur.light ? col.darkAccent_100 :
				uiBio.blur.dark ? col.lightAccent_100 :
				RGB(20, 20, 20);

			uiBio.col.sbarBtns = uiBio.col.text;
			uiBio.col.sbarNormal = col.darkAccent;
			uiBio.col.sbarHovered = col.lightAccent_50;
			uiBio.col.sbarDrag = col.lightAccent_50;
		}
		else {
			// * HEADER COLORS * //
			uiBio.col.headingText = uiBio.blur.light ? col.darkAccent_75 : col.lightAccent_80;
			uiBio.col.source = uiBio.blur.light ? col.darkAccent_75 : col.lightAccent_80;
			uiBio.col.bottomLine = col.darkAccent;
			uiBio.col.centerLine = col.darkAccent;

			// * TEXT COLORS * //
			uiBio.col.text = uiBio.blur.light ? col.darkAccent_75 : col.lightAccent_80;

			// * SCROLLBAR COLORS * //
			uiBio.col.sbarBtns =
				isColored && !uiBio.blur.dark && !uiBio.blur.blend && !uiBio.blur.light ? col.lightAccent_100 :
				uiBio.blur.dark ? col.lightAccent_100 :
				uiBio.blur.light ? col.darkAccent_100 :
				RGB(220, 220, 220);

			uiBio.col.sbarBtns = uiBio.col.text;
			uiBio.col.sbarNormal = col.lightAccent;
			uiBio.col.sbarHovered = col.lightAccent_50;
			uiBio.col.sbarDrag = col.lightAccent_50;
		}
	}
}


function mainColorsRebornRandomTheme() {
	// * MAIN COLORS * //
	col.bg = isColored ? col.primary : RGB(245, 245, 245);
	col.loadingThemeBg = RGB(245, 245, 245);
	col.uiHacksFrame =
		pref.styleRebornWhite ? RGB(245, 245, 245) :
		pref.styleRebornBlack ? RGB(25, 25, 25) :
		isColored ? col.primary : RGB(245, 245, 245);
	col.shadow =
		pref.styleRebornBlack ? RGBA(0, 0, 0, 255) :
		isStreaming || isPlayingCD || noAlbumArtStub || !albumArt ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 35);
	col.discArtShadow = RGBA(0, 0, 0, 30);
	col.noAlbumArtStub = RGB(120, 120, 120);
	col.lowerBarArtist = RGB(120, 120, 120);
	col.lowerBarTitle = RGB(120, 120, 120);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = pref.lyricsAlbumArt ? RGB(255, 240, 150) : RGB(220, 160, 40);
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = col.primary !== RGB(25, 160, 240) && albumArt && !isStreaming ? pref.styleRebornFusion2 ? col.primary_alt : col.primary : RGB(255, 255, 255);
	col.detailsText =
		isStreaming || isPlayingCD || !albumArt ? RGB(120, 120, 120) :
		lightBg || lightBgDetails ? RGB(55, 55, 55) :
		RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 50 : 40) : col.lightAccent_50;
	col.timelinePlayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 35 : 25) : col.lightAccent_35;
	col.timelineUnplayed = isStreaming ? RGB(207, 0, 5) : lightBg ? shadeColor(col.primary, pref.styleBlend ? 20 : 10) : col.lightAccent;
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = lightBg && !noAlbumArtStub ? col.darkAccent_75 : col.lightAccent_100;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		isColored ?
			pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(255, 255, 255) :
			pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			col.lightAccent :
		RGB(255, 255, 255);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220) :
				pref.styleRebornBlack ? RGB(20, 20, 20) :
			isColored ?
				pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 70) : RGBtoRGBA(col.darkAccent_75, 80) :
			pref.styleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220) :
		pref.styleTopMenuButtons === 'emboss' ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
				pref.styleRebornBlack ? pref.styleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			isColored ?
				pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 30) : RGBtoRGBA(col.darkAccent_75, 40) :
			pref.styleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
		RGB(255, 255, 255);

	col.menuRectStyleEmbossTop =
		isColored ?
			pref.styleRebornWhite ? RGB(255, 255, 255) :
			pref.styleRebornBlack ? pref.styleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70) :
			col.lightAccent :
		RGB(255, 255, 255);

	col.menuRectStyleEmbossBottom =
		isColored ?
			pref.styleRebornWhite ? pref.styleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) :
			pref.styleRebornBlack ? RGB(0, 0, 0) :
			col.darkAccent :
		pref.styleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210);

	col.menuRectNormal = RGB(140, 140, 140);
	col.menuRectHovered = RGB(200, 200, 200);
	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = RGB(120, 120, 120);
	col.menuTextHovered = RGB(80, 80, 80);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = isColored ? col.lightAccent_50 : RGB(255, 255, 255);
	col.transportEllipseNormal = isColored ? col.lightAccent_7 : RGB(220, 220, 220);
	col.transportEllipseHovered = RGB(200, 200, 200);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' ?
			isColored ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
				pref.styleRebornBlack ? RGB(20, 20, 20) :
				RGBtoRGBA(col.darkAccent_75, 100) :
			pref.styleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'inner' ?
			isColored ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
				pref.styleRebornBlack ? RGB(20, 20, 20) :
				RGBtoRGBA(col.darkAccent_75, 120) :
			RGB(225, 225, 225) :
		pref.styleTransportButtons === 'emboss' ?
			isColored ?
				pref.styleRebornWhite ? RGB(225, 225, 225) :
				pref.styleRebornBlack ? RGB(50, 50, 50) :
				RGBtoRGBA(col.darkAccent_75, 40) :
			RGB(225, 225, 225) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ?
			isColored ?
				pref.styleRebornWhite ? RGB(255, 255, 255) :
				pref.styleRebornBlack ? RGB(50, 50, 50) :
				pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 220) : RGBtoRGBA(col.lightAccent_80, 230) :
			RGB(255, 255, 255) :
		pref.styleTransportButtons === 'emboss' ?
			isColored ?
				pref.styleRebornWhite ? RGB(255, 255, 255) :
				pref.styleRebornBlack ? pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) :
				RGBtoRGBA(col.lightAccent_80, 100) : '' :
			RGB(255, 255, 255);

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' ?
			isColored ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
				pref.styleRebornBlack ? RGB(10, 10, 10) :
				pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 30) : RGBtoRGBA(col.darkAccent_75, 20) :
			pref.styleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'inner' ?
			isColored ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
				pref.styleRebornBlack ? RGB(10, 10, 10) :
				pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 30) : RGBtoRGBA(col.darkAccent_75, 40) :
			pref.styleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'emboss' ?
			isColored ?
				pref.styleRebornWhite ? pref.styleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) :
				pref.styleRebornBlack ? RGB(20, 20, 20) :
				RGBtoRGBA(col.darkAccent_75, 60) :
			pref.styleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

	col.transportIconNormal = RGB(120, 120, 120);
	col.transportIconHovered = RGB(80, 80, 80);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = isColored ? pref.styleBevel ? shadeColor(col.primary, 28) : col.accent : RGB(220, 220, 220);
	col.progressBarStreaming = RGB(207, 0, 5);
	col.progressBarFrame = col.bg;
	col.progressBarFill = isColored ? col.lightAccent_50 : col.primary;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness > 200 || colBrightness < 75 ? tintColor(col.primary,  100) : shadeColor(col.primary, 100);
	col.peakmeterBarFillTop       = colBrightness > 200 ? shadeColor(col.primary, 10) : tintColor(col.primary, 40);
	col.peakmeterBarFillMiddle    = colBrightness > 200 ? shadeColor(col.primary, 20) : tintColor(col.primary, 60);
	col.peakmeterBarFillBack      = colBrightness > 200 ? shadeColor(col.primary, 40) : tintColor(col.primary, 80);
	col.peakmeterBarVertProgFill  = colBrightness > 200 ? shadeColor(col.primary, 50) : col.progressBarFill;
	col.peakmeterBarVertFill      = colBrightness > 200 ? shadeColor(col.primary, 50) : tintColor(col.primary, 40);
	col.peakmeterBarVertFillPeaks = colBrightness > 200 ? shadeColor(col.primary, 20) : tintColor(col.primary, 60);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness > 200 || noAlbumArtStub ? shadeColor(col.primary, 80) : tintColor(col.primary, 90);
	col.waveformBarFillBack     = colBrightness > 200 || noAlbumArtStub ? shadeColor(col.primary, 40) : tintColor(col.primary, 45);
	col.waveformBarFillPreFront = colBrightness > 150 ? shadeColor(col.primary, pref.styleBevel || pref.styleBlend ? 60 : 40) : tintColor(col.primary, 50);
	col.waveformBarFillPreBack  = colBrightness > 150 ? shadeColor(col.primary, pref.styleBevel || pref.styleBlend ? 10 : 20) : tintColor(col.primary, 25);
	col.waveformBarIndicator    = colBrightness > 200 || noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = isColored ? col.lightAccent_50 : RGB(255, 255, 255);
	col.volumeBarFrame = isColored ? col.accent : RGB(220, 220, 220);
	col.volumeBarFill = isColored ? col.accent : col.primary;

	// * STYLE COLORS * //
	col.styleBevel = pref.styleRebornWhite ? RGB(40, 40, 40) : pref.styleRebornBlack ? RGB(0, 0, 0) : col.darkAccent_100;
	col.styleGradient = isColored ? col.darkAccent : '';
	col.styleGradient2 = isColored ? col.darkAccent : '';

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ?
			pref.styleRebornWhite ? pref.styleBevel ? RGBA(0, 0, 0, 40)  : RGBA(0, 0, 0, 30) :
			pref.styleRebornBlack ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 50) : RGBtoRGBA(col.darkAccent_75, 40) :
		pref.styleProgressBar === 'inner' ?
			pref.styleRebornWhite ? pref.styleBevel ? RGBA(0, 0, 0, 25)  : RGBA(0, 0, 0, 40) :
			pref.styleRebornBlack ? RGBA(0, 0, 0, 100) :
			pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 50) : RGBtoRGBA(col.darkAccent_75, 60) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? shadeColor(col.bg,  5) : tintColor(col.bg,  100) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? shadeColor(col.bg, 10) : shadeColor(col.bg,  25) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? shadeColor(col.bg, 10) : shadeColor(col.bg,  25) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? tintColor(col.bg,  10) : tintColor(col.bg,  100) : '';

	col.styleProgressBarFill = isColored ? pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 80) : '' : col.primary;

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 50) : RGBtoRGBA(col.darkAccent_75, 40) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 50) : RGBtoRGBA(col.darkAccent_75, 60) : '';

	col.styleVolumeBarFill = isColored ? pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 80) : '' : col.primary;

	// * WHEN PLAYING * //
	if (fb.IsPlaying && isColored) {
		if (pref.styleRebornFusion || pref.styleRebornFusion2 ? lightBgMain : lightBg) {
			// * MAIN COLORS * //
			col.noAlbumArtStub = RGB(90, 90, 90);
			col.lowerBarArtist = col.darkAccent_75;
			col.lowerBarTitle = col.darkAccent_75;
			col.lowerBarTime = col.lowerBarTitle;
			col.lowerBarLength = col.lowerBarTitle;

			// * TOP MENU BUTTONS COLORS * //
			col.menuBgColor =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 50) :
				pref.styleTopMenuButtons !== 'default' ? col.lightAccent_10 : col.lightAccent_50;

			col.menuRectNormal =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 30) :
				col.darkAccent;

			col.menuRectHovered =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 40) : RGBtoRGBA(col.darkAccent_75, 30) :
				col.darkAccent;

			col.menuRectDown = col.menuRectHovered;
			col.menuTextNormal = col.darkAccent_75;
			col.menuTextHovered = col.darkAccent_100;
			col.menuTextDown = col.menuTextHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			col.transportIconNormal = pref.styleTransportButtons === 'emboss' || pref.styleTransportButtons === 'minimal' ? col.darkAccent_75 : col.darkAccent_65;
			col.transportIconHovered = col.darkAccent_100;
			col.transportIconDown = col.transportIconHovered;
			col.transportEllipseNormal = col.accent;
			col.transportEllipseHovered = col.darkAccent;
			col.transportEllipseDown = col.transportEllipseHovered;
		}
		else {
			// * MAIN * //
			col.noAlbumArtStub = RGB(90, 90, 90);
			col.lowerBarArtist = col.lightAccent_100;
			col.lowerBarTitle = col.lightAccent_100;
			col.lowerBarTime = col.lowerBarTitle;
			col.lowerBarLength = col.lowerBarTitle;

			// * TOP MENU BUTTON COLORS * //
			col.menuBgColor =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 50) :
				pref.styleTopMenuButtons !== 'default' ? col.lightAccent_10 : col.darkAccent_50;

			col.menuRectNormal =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 60) : RGBtoRGBA(col.darkAccent_75, 50) :
				col.lightAccent_50;

			col.menuRectHovered =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 60) : RGBtoRGBA(col.darkAccent_75, 50) :
				col.lightAccent_50;

			col.menuRectDown = col.menuRectHovered;
			col.menuTextNormal = col.lightAccent_80;
			col.menuTextHovered = col.lightAccent_100;
			col.menuTextDown = col.menuTextHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			col.transportIconNormal = pref.styleTransportButtons === 'emboss' ? col.darkAccent_75 : pref.styleTransportButtons === 'minimal' ? col.lightAccent_80 : col.darkAccent_75;
			col.transportIconHovered = col.darkAccent_100;
			col.transportIconDown = col.transportIconHovered;
			col.transportEllipseNormal = col.accent;
			col.transportEllipseHovered = col.darkAccent;
			col.transportEllipseDown = col.transportEllipseHovered;
		}
	}
}


///////////////////////////
// * BLUE THEME COLORS * //
///////////////////////////
const blueTheme = {
	name: 'blue',
	colors: {
		primary: RGB(10, 115, 200),
		darkAccent: RGB(12, 144, 245),
		accent: RGB(12, 137, 232),
		lightAccent: RGB(10, 130, 220)
	}
};


function playlistColorsBlueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(242, 230, 170);
	g_pl_colors.bg = RGB(10, 115, 200);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(220, 220, 220);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(230, 230, 230) : RGB(255, 255, 255);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = RGB(10, 130, 220);
	g_pl_colors.header_sideMarker = accentColor;
	g_pl_colors.header_artist_normal = RGB(240, 240, 240);
	g_pl_colors.header_artist_playing = accentColor;
	g_pl_colors.header_album_normal = RGB(230, 230, 230);
	g_pl_colors.header_album_playing = RGB(245, 245, 245);
	g_pl_colors.header_info_normal = RGB(230, 230, 230);
	g_pl_colors.header_info_playing = RGB(245, 245, 245);
	g_pl_colors.header_date_normal = RGB(240, 240, 240);
	g_pl_colors.header_date_playing = RGB(245, 245, 245);
	g_pl_colors.header_line_normal = RGB(17, 100, 182);
	g_pl_colors.header_line_playing = RGB(17, 100, 182);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(5, 110, 195, 130) : RGB(5, 110, 195);
	g_pl_colors.row_selection_bg = RGB(10, 115, 200);
	g_pl_colors.row_selection_frame = RGB(10, 135, 230);
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(230, 230, 230);
	g_pl_colors.row_title_playing = RGB(255, 255, 255);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(17, 100, 182);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = RGB(220, 220, 220);
	g_pl_colors.sbar_btn_hovered = RGB(255, 255, 255);
	g_pl_colors.sbar_thumb_normal = RGB(10, 135, 225);
	g_pl_colors.sbar_thumb_hovered = accentColor;
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsBlueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(242, 230, 170);
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = accentColor;
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(10, 130, 220);
	ui.col.iconMinus_e = accentColor;
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = RGB(230, 230, 230);
	ui.col.text_h = RGB(255, 255, 255);
	ui.col.text_nowp = accentColor;
	ui.col.textSel = RGB(255, 255, 255);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(230, 230, 230);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(230, 230, 230);

	// * BUTTON COLORS * //
	ui.col.searchBtn = accentColor;
	ui.col.crossBtn = accentColor;
	ui.col.filterBtn = RGB(230, 230, 230);
	ui.col.settingsBtn = RGB(230, 230, 230);
	ui.col.line = RGB(17, 100, 182);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = RGB(220, 220, 220);
	ui.col.sbarNormal = RGB(10, 150, 255);
	ui.col.sbarHovered = accentColor;
	ui.col.sbarDrag = accentColor;
}


function biographyColorsBlueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(242, 230, 170);
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = g_pl_colors.header_artist_playing;
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = accentColor;
	uiBio.col.noPhotoStubBg = RGB(10, 130, 220);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = RGB(220, 220, 220);
	uiBio.col.sbarNormal = RGB(10, 150, 255);
	uiBio.col.sbarHovered = accentColor;
	uiBio.col.sbarDrag = accentColor;
}


function mainColorsBlueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(242, 230, 170);
	col.bg = RGB(5, 110, 195);
	col.loadingThemeBg = RGB(5, 110, 195);
	col.uiHacksFrame = RGB(63, 155, 202);
	col.shadow = RGBA(0, 0, 0, 25);
	col.discArtShadow = RGBA(0, 0, 0, 30);
	col.noAlbumArtStub = accentColor;
	col.lowerBarArtist = accentColor;
	col.lowerBarTitle = RGB(245, 245, 245);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = accentColor;
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = RGB(10, 115, 200);
	col.detailsText = RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = accentColor;
	col.timelinePlayed = RGB(195, 190, 130);
	col.timelineUnplayed = RGB(155, 150, 130);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = accentColor;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel && !pref.styleGradient2 ? RGB(10, 123, 209) : RGB(10, 130, 220) :
		pref.styleTopMenuButtons === 'inner'  ? pref.styleBevel && !pref.styleGradient2 ? RGB(10, 130, 220) : pref.styleGradient2 ? RGB(10, 130, 220) : RGB(10, 135, 230) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel && !pref.styleGradient2 ? RGB(10, 123, 209) : RGB(10, 130, 220) :
		RGB(10, 130, 220);

	col.menuStyleBg = pref.styleTopMenuButtons === 'emboss' ? RGB(5, 110, 195) : pref.styleBevel ? RGB(5, 90, 160) : RGB(5, 100, 175);
	col.menuRectStyleEmbossTop = RGB(10, 138, 228);
	col.menuRectStyleEmbossBottom = RGB(6, 95, 160);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGBA(76, 175, 255, 130) :
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel ? RGB(5, 85, 150) : RGB(5, 100, 180) :
		RGB(76, 175, 255);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(76, 175, 255, 130) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
			pref.styleBevel && !pref.styleGradient2 ? RGB(5, 85, 150) : pref.styleGradient2 ? RGB(4, 68, 120) : RGB(5, 100, 180) :
		RGB(76, 175, 255);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = RGB(230, 230, 230);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = RGB(10, 130, 220);
	col.transportEllipseNormal = RGB(22, 107, 186);
	col.transportEllipseHovered = RGB(76, 175, 255);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel'  ? pref.styleGradient2 ? RGB(5, 90, 160) : RGB(5, 100, 180) :
		pref.styleTransportButtons === 'inner'  ? pref.styleGradient2 ? RGB(10, 110, 190) : pref.styleBevel && !pref.styleGradient2 ? RGB(5, 100, 180) : RGB(17, 100, 180) :
		pref.styleTransportButtons === 'emboss' ? pref.styleGradient2 ? RGB(8, 110, 190) : RGB(11, 132, 224) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(7, 135, 240) : RGB(7, 130, 230) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel && !pref.styleGradient2 ? RGB(12, 138, 235) : pref.styleGradient2 ? RGB(10, 115, 200) : RGB(12, 138, 235) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(5, 85, 150) : RGB(5, 100, 180) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel && !pref.styleGradient2 ? RGB(6, 95, 160) : pref.styleGradient2 ? RGB(4, 68, 120) : RGB(5, 100, 175) : '';

	col.transportIconNormal = accentColor;
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(10, 130, 220);
	col.progressBarStreaming = accentColor;
	col.progressBarFrame = RGB(22, 107, 186);
	col.progressBarFill = accentColor;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = tintColor(accentColor,  40);
	col.peakmeterBarFillTop       = tintColor(accentColor,  10);
	col.peakmeterBarFillMiddle    = tintColor(accentColor,  20);
	col.peakmeterBarFillBack      = shadeColor(accentColor, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = accentColor;
	col.peakmeterBarVertFillPeaks = tintColor(accentColor,  80);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = accentColor;
	col.waveformBarFillBack     = shadeColor(accentColor, 20);
	col.waveformBarFillPreFront = RGB(75, 175, 255);
	col.waveformBarFillPreBack  = RGB(10, 145, 255);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(10, 130, 220);
	col.volumeBarFrame = RGB(22, 107, 186);
	col.volumeBarFill = accentColor;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = RGBA(0, 0, 0, 90);
	col.styleGradient2 = RGB(3, 72, 128);

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(0, 0, 0, 40) :
											pref.styleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 20) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
											pref.styleBevel ? RGBA(0, 0, 0, 45) : RGBA(0, 0, 0, 15) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGB(10, 125, 210) : RGB(10, 130, 220) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGB(10, 130, 220) : RGB(12, 138, 235) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';
}


///////////////////////////////
// * DARKBLUE THEME COLORS * //
///////////////////////////////
const darkblueTheme = {
	name: 'darkBlue',
	colors: {
		primary: RGB(21, 37, 56),
		darkAccent: RGB(31, 65, 107),
		accent: RGB(27, 58, 94),
		lightAccent: RGB(24, 50, 82)
	}
};


function playlistColorsDarkblueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(255, 202, 128);
	g_pl_colors.bg = RGB(21, 37, 56);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(220, 220, 220);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = RGB(24, 50, 82);
	g_pl_colors.header_sideMarker = accentColor;
	g_pl_colors.header_artist_normal = RGB(240, 240, 240);
	g_pl_colors.header_artist_playing = accentColor;
	g_pl_colors.header_album_normal = RGB(220, 220, 220);
	g_pl_colors.header_album_playing = RGB(245, 245, 245);
	g_pl_colors.header_info_normal = RGB(220, 220, 220);
	g_pl_colors.header_info_playing = RGB(245, 245, 245);
	g_pl_colors.header_date_normal = RGB(220, 220, 220);
	g_pl_colors.header_date_playing = RGB(245, 245, 245);
	g_pl_colors.header_line_normal = RGB(12, 21, 31);
	g_pl_colors.header_line_playing = RGB(12, 21, 31);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(22, 40, 63, 130) : RGB(22, 40, 63);
	g_pl_colors.row_selection_bg = RGB(21, 37, 56);
	g_pl_colors.row_selection_frame = RGB(27, 55, 90);
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(230, 230, 230);
	g_pl_colors.row_title_playing = RGB(255, 255, 255);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(12, 21, 31);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal =  RGB(220, 220, 220);
	g_pl_colors.sbar_btn_hovered = RGB(255, 255, 255);
	g_pl_colors.sbar_thumb_normal = RGB(27, 55, 90);
	g_pl_colors.sbar_thumb_hovered = accentColor;
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsDarkblueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(255, 202, 128);
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = accentColor;
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(24, 50, 82);
	ui.col.iconMinus_e = accentColor;
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = RGB(230, 230, 230);
	ui.col.text_h = RGB(255, 255, 255);
	ui.col.text_nowp = accentColor;
	ui.col.textSel = RGB(255, 255, 255);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(230, 230, 230);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(230, 230, 230);

	// * BUTTON COLORS * //
	ui.col.searchBtn = accentColor;
	ui.col.crossBtn = accentColor;
	ui.col.filterBtn = RGB(230, 230, 230);
	ui.col.settingsBtn = RGB(230, 230, 230);
	ui.col.line = RGB(12, 21, 31);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = RGB(220, 220, 220);
	ui.col.sbarNormal = RGB(36, 84, 143);
	ui.col.sbarHovered = accentColor;
	ui.col.sbarDrag = accentColor;
}


function biographyColorsDarkblueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(255, 202, 128);
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = g_pl_colors.header_artist_playing;
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = accentColor;
	uiBio.col.noPhotoStubBg = RGB(24, 50, 82);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = RGB(220, 220, 220);
	uiBio.col.sbarNormal = RGB(36, 84, 143);
	uiBio.col.sbarHovered = accentColor;
	uiBio.col.sbarDrag = accentColor;
}


function mainColorsDarkblueTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(255, 202, 128);
	col.bg = RGB(22, 40, 63);
	col.loadingThemeBg = RGB(22, 40, 63);
	col.uiHacksFrame = RGB(27, 55, 90);
	col.shadow = RGBA(0, 0, 0, 75);
	col.discArtShadow = RGBA(0, 0, 0, 80);
	col.noAlbumArtStub = accentColor;
	col.lowerBarArtist = accentColor;
	col.lowerBarTitle = RGB(230, 230, 230);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = accentColor;
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = RGB(21, 37, 56);
	col.detailsText = RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = accentColor;
	col.timelinePlayed = RGB(204, 161, 102);
	col.timelineUnplayed = RGB(155, 110, 70);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = accentColor;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel' ? RGB(27, 55, 90) :
		pref.styleTopMenuButtons === 'inner' ? RGB(38, 70, 110) :
		RGB(27, 55, 90);

	col.menuStyleBg = pref.styleTopMenuButtons === 'emboss' ? RGB(27, 48, 77) :	pref.styleBevel ? RGB(22, 40, 60) : RGB(25, 45, 70);
	col.menuRectStyleEmbossTop = RGB(35, 70, 115);
	col.menuRectStyleEmbossBottom = RGB(6, 10, 15);
	col.menuRectNormal = pref.styleTopMenuButtons === 'filled' ? RGBA(200, 200, 200, 140) :	RGB(200, 200, 200);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(50, 90, 150, 140) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(15, 25, 40) : RGB(18, 30, 50) :
		RGB(50, 90, 150);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = RGB(230, 230, 230);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = RGB(27, 55, 90);
	col.transportEllipseNormal = RGB(20, 33, 48);
	col.transportEllipseHovered = RGB(50, 90, 150);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel'  ? pref.styleBevel ? RGB(22, 40, 60) : RGB(25, 45, 70) :
		pref.styleTransportButtons === 'inner'  ? pref.styleGradient2 ? RGB(22, 40, 60) : RGB(25, 45, 70) :
		pref.styleTransportButtons === 'emboss' ? RGB(27, 55, 90) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(38, 70, 110) :
		pref.styleTransportButtons === 'emboss' ? RGB(35, 70, 115) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(15, 25, 40) : RGB(18, 30, 50) :
		pref.styleTransportButtons === 'emboss' ? RGB(20, 36, 50) : '';

	col.transportIconNormal = accentColor;
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(27, 55, 90);
	col.progressBarStreaming = accentColor;
	col.progressBarFrame = RGB(22, 37, 54);
	col.progressBarFill = accentColor;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = tintColor(accentColor,  40);
	col.peakmeterBarFillTop       = tintColor(accentColor,  10);
	col.peakmeterBarFillMiddle    = tintColor(accentColor,  20);
	col.peakmeterBarFillBack      = shadeColor(accentColor, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = accentColor;
	col.peakmeterBarVertFillPeaks = tintColor(accentColor,  80);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = accentColor;
	col.waveformBarFillBack     = shadeColor(accentColor, 20);
	col.waveformBarFillPreFront = RGB(65, 110, 180);
	col.waveformBarFillPreBack  = RGB(45, 80, 130);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(27, 55, 90);
	col.volumeBarFrame = RGB(20, 33, 48);
	col.volumeBarFill = accentColor;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = RGBA(0, 0, 0, 140);
	col.styleGradient2 = RGB(10, 20, 35);

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 160) : RGBA(0, 0, 0, 80) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) :
											pref.styleBevel ? RGBA(0, 0, 0, 40)  : RGBA(0, 0, 0, 30) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? RGB(30, 62, 102) :
		pref.styleProgressBar === 'inner' ? RGB(30, 62, 102) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';
}


//////////////////////////
// * RED THEME COLORS * //
//////////////////////////
const redTheme = {
	name: 'red',
	colors: {
		primary: RGB(110, 20, 20),
		darkAccent: RGB(156, 30, 30),
		accent: RGB(143, 27, 27),
		lightAccent: RGB(130, 25, 25)
	}
};


function playlistColorsRedTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(245, 212, 165);
	g_pl_colors.bg = RGB(110, 20, 20);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(220, 220, 220);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(255, 255, 255) : RGB(220, 220, 220);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = RGB(130, 25, 25);
	g_pl_colors.header_sideMarker = accentColor;
	g_pl_colors.header_artist_normal = RGB(240, 240, 240);
	g_pl_colors.header_artist_playing = accentColor;
	g_pl_colors.header_album_normal = RGB(220, 220, 220);
	g_pl_colors.header_album_playing = RGB(245, 245, 245);
	g_pl_colors.header_info_normal = RGB(220, 220, 220);
	g_pl_colors.header_info_playing = RGB(245, 245, 245);
	g_pl_colors.header_date_normal = RGB(220, 220, 220);
	g_pl_colors.header_date_playing = RGB(245, 245, 245);
	g_pl_colors.header_line_normal = RGB(75, 18, 18);
	g_pl_colors.header_line_playing = RGB(75, 18, 18);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(100, 20, 20, 130) : RGB(100, 20, 20);
	g_pl_colors.row_selection_bg = RGB(110, 20, 20);
	g_pl_colors.row_selection_frame = RGB(145, 25, 25);
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(220, 220, 220);
	g_pl_colors.row_title_playing = RGB(255, 255, 255);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(75, 18, 18);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = RGB(220, 220, 220);
	g_pl_colors.sbar_btn_hovered = RGB(255, 255, 255);
	g_pl_colors.sbar_thumb_normal = RGB(145, 25, 25);
	g_pl_colors.sbar_thumb_hovered = accentColor;
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsRedTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(245, 212, 165);
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = accentColor;
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(140, 25, 25);
	ui.col.iconMinus_e = accentColor;
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = RGB(230, 230, 230);
	ui.col.text_h = RGB(255, 255, 255);
	ui.col.text_nowp = accentColor;
	ui.col.textSel = RGB(255, 255, 255);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(230, 230, 230);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(230, 230, 230);

	// * BUTTON COLORS * //
	ui.col.searchBtn = accentColor;
	ui.col.crossBtn = accentColor;
	ui.col.filterBtn = RGB(230, 230, 230);
	ui.col.settingsBtn = RGB(230, 230, 230);
	ui.col.line = RGB(75, 18, 18);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = RGB(220, 220, 220);
	ui.col.sbarNormal = RGB(198, 32, 32);
	ui.col.sbarHovered = accentColor;
	ui.col.sbarDrag = accentColor;
}


function biographyColorsRedTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(245, 212, 165);
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = g_pl_colors.header_artist_playing;
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = accentColor;
	uiBio.col.noPhotoStubBg = RGB(130, 25, 25);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = RGB(220, 220, 220);
	uiBio.col.sbarNormal = RGB(198, 32, 32);
	uiBio.col.sbarHovered = accentColor;
	uiBio.col.sbarDrag = accentColor;
}


function mainColorsRedTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(245, 212, 165);
	col.bg = RGB(100, 20, 20);
	col.loadingThemeBg = RGB(100, 20, 20);
	col.uiHacksFrame = RGB(125, 0, 0);
	col.shadow = RGBA(0, 0, 0, 75);
	col.discArtShadow = RGBA(0, 0, 0, 80);
	col.noAlbumArtStub = accentColor;
	col.lowerBarArtist = accentColor;
	col.lowerBarTitle = RGB(220, 220, 220);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = accentColor;
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = RGB(110, 20, 20);
	col.detailsText = RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = accentColor;
	col.timelinePlayed = RGB(207, 170, 118);
	col.timelineUnplayed = RGB(170, 120, 95);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = accentColor;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? RGB(140, 25, 25) :
		pref.styleTopMenuButtons === 'inner'  ? RGB(160, 32, 32) :
		RGB(140, 25, 25);

	col.menuStyleBg = pref.styleTopMenuButtons === 'emboss' ? RGB(125, 25, 25) : RGB(100, 20, 20);
	col.menuRectStyleEmbossTop = RGB(158, 30, 30);
	col.menuRectStyleEmbossBottom = RGB(54, 10, 10);
	col.menuRectNormal = pref.styleTopMenuButtons === 'filled' ? RGBA(200, 200, 200, 140) :	RGB(200, 200, 200);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(204, 45, 45, 140) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(66, 13, 13) : RGB(77, 15, 15) :
		RGB(204, 45, 45);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = RGB(220, 220, 220);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = RGB(140, 25, 25);
	col.transportEllipseNormal = RGB(82, 19, 19);
	col.transportEllipseHovered = RGB(204, 45, 45);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(100, 20, 20) :
		pref.styleTransportButtons === 'emboss' ? RGB(140, 25, 25) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(160, 32, 32) :
		pref.styleTransportButtons === 'emboss' ? RGB(166, 30, 30) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(66, 13, 13) : RGB(77, 15, 15) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel && !pref.styleGradient2 ? RGB(80, 15, 15) : pref.styleGradient2 ? RGB(54, 10, 10) : RGB(80, 15, 15) : '';

	col.transportIconNormal = accentColor;
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(140, 25, 25);
	col.progressBarStreaming = accentColor;
	col.progressBarFrame = RGB(92, 21, 21);
	col.progressBarFill = accentColor;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = tintColor(accentColor,  40);
	col.peakmeterBarFillTop       = tintColor(accentColor,  10);
	col.peakmeterBarFillMiddle    = tintColor(accentColor,  20);
	col.peakmeterBarFillBack      = shadeColor(accentColor, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = accentColor;
	col.peakmeterBarVertFillPeaks = tintColor(accentColor,  80);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = accentColor;
	col.waveformBarFillBack     = shadeColor(accentColor, 20);
	col.waveformBarFillPreFront = RGB(230, 45, 45);
	col.waveformBarFillPreBack  = RGB(180, 35, 35);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(140, 25, 25);
	col.volumeBarFrame = RGB(82, 19, 19);
	col.volumeBarFill = accentColor;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = RGBA(0, 0, 0, 90);
	col.styleGradient2 = RGB(65, 13, 13);

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 80) : RGBA(0, 0, 0, 60) :
											pref.styleBevel ? RGBA(0, 0, 0, 40)  : RGBA(0, 0, 0, 30) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? RGB(145, 28, 28) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGB(158, 30, 30) : RGB(145, 28, 28) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 100) : '';
}


////////////////////////////
// * CREAM THEME COLORS * //
////////////////////////////
const creamTheme = {
	name: 'cream',
	colors: {
		primary: RGB(255, 247, 240),
		darkAccent: RGB(120, 170, 130),
		accent: RGB(130, 184, 141),
		lightAccent: RGB(139, 196, 151)
	}
};


function playlistColorsCreamTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(120, 170, 130);
	g_pl_colors.bg = RGB(255, 247, 245);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(220, 220, 220);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(110, 110, 110) : RGB(80, 80, 80);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(80, 80, 80) : RGB(130, 130, 130);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	g_pl_colors.header_artist_normal = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	g_pl_colors.header_artist_playing = RGB(255, 255, 255);
	g_pl_colors.header_album_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(110, 110, 110);
	g_pl_colors.header_album_playing = RGB(245, 245, 245);
	g_pl_colors.header_info_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(110, 110, 110);
	g_pl_colors.header_info_playing = RGB(245, 245, 245);
	g_pl_colors.header_date_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	g_pl_colors.header_date_playing = RGB(245, 245, 245);
	g_pl_colors.header_line_normal = RGB(200, 200, 200);
	g_pl_colors.header_line_playing = RGB(220, 220, 220);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
	g_pl_colors.row_selection_bg = RGB(200, 200, 200);
	g_pl_colors.row_selection_frame = g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	g_pl_colors.row_title_normal = pref.styleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90);
	g_pl_colors.row_title_playing = RGB(245, 245, 245);
	g_pl_colors.row_title_selected = RGB(0, 0, 0);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(200, 200, 200);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = accentColor;
	g_pl_colors.sbar_btn_hovered = RGB(100, 100, 100);
	g_pl_colors.sbar_thumb_normal = RGB(200, 200, 200);
	g_pl_colors.sbar_thumb_hovered = accentColor;
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsCreamTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(120, 170, 130);
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	ui.col.iconPlus_h = RGB(0, 0, 0);
	ui.col.iconPlus_sel = ['modern', 'facet'].includes(pref.libraryDesign) || !pop.highlight.nowPlaying ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.iconPlusBg = RGB(255, 255, 255);
	ui.col.iconMinus_e = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(0, 0, 0);

	// * TEXT COLORS * //
	ui.col.text =
		ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) :
		pref.styleBlend ? RGB(65, 65, 65) :
		RGB(90, 90, 90);

	ui.col.text_h =
		ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) :
		['modern', 'facet'].includes(pref.libraryDesign) && panel.imgView ? RGB(255, 255, 255) :
		RGB(0, 0, 0);

	ui.col.text_nowp = ppt.albumArtShow && img.labels.overlayDark ? RGB(0, 0, 0) : RGB(255, 255, 255);

	ui.col.textSel =
		!['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(pref.libraryDesign) || ![2, 1].includes(ppt.albumArtLabelType) ||
		(['facet', 'coversLabelsRight', 'coversLabelsBottom'].includes(pref.libraryDesign) ||  [2, 1].includes(ppt.albumArtLabelType)) && !pop.highlight.nowPlaying ?
			ppt.albumArtShow && img.labels.overlayDark ? RGB(0, 0, 0) : RGB(255, 255, 255) :
		ui.col.text_h;

	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = pref.styleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90);
	ui.col.count = ui.col.text;
	ui.col.search = pref.styleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90);

	// * BUTTON COLORS * //
	ui.col.searchBtn = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	ui.col.crossBtn = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	ui.col.filterBtn = pref.styleBlend ? RGB(60, 60, 60) : RGB(120, 120, 120);
	ui.col.settingsBtn = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	ui.col.line = RGB(200, 200, 200);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = accentColor;
	ui.col.sbarNormal = RGB(116, 127, 129);
	ui.col.sbarHovered = accentColor;
	ui.col.sbarDrag = accentColor;
}


function biographyColorsCreamTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(120, 170, 130);
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = pref.styleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100);
	uiBio.col.bottomLine = (uiBio.blur.blend || uiBio.blur.light) ? RGB(120, 120, 120) : g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	uiBio.col.noPhotoStubBg = RGB(255, 247, 240);
	uiBio.col.noPhotoStubText = accentColor;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = accentColor;
	uiBio.col.sbarNormal = RGB(116, 127, 129);
	uiBio.col.sbarHovered = accentColor;
	uiBio.col.sbarDrag = accentColor;
}


function mainColorsCreamTheme() {
	// * MAIN COLORS * //
	const accentColor = RGB(120, 170, 130);
	col.bg = RGB(255, 247, 240);
	col.loadingThemeBg = RGB(255, 247, 240);
	col.uiHacksFrame = RGB(255, 247, 240);
	col.shadow = RGBA(0, 0, 0, 25);
	col.discArtShadow = RGBA(0, 0, 0, 10);
	col.noAlbumArtStub = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	col.lowerBarArtist = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? RGB(90, 90, 90) : RGB(100, 100, 100);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = RGB(255, 247, 245);
	col.detailsText = pref.styleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = accentColor;
	col.timelinePlayed = RGB(139, 196, 151);
	col.timelineUnplayed = RGB(158, 222, 171);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = RGB(255, 255, 255);

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? RGB(255, 255, 255) :
		pref.styleTopMenuButtons === 'inner'  ? RGB(255, 255, 255) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
		RGB(247, 239, 233);

	col.menuStyleBg = pref.styleTopMenuButtons === 'emboss' ? RGB(240, 230, 220) : pref.styleBevel ? RGB(212, 205, 200) : RGB(229, 222, 216);
	col.menuRectStyleEmbossTop = pref.styleBevel ? RGB(235, 235, 235) : RGB(255, 255, 255);
	col.menuRectStyleEmbossBottom = pref.styleBevel ? RGB(205, 205, 205) : RGB(215, 215, 215);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGB(100, 150, 110, 100) :
		pref.styleBlend || pref.styleBlend2 ? RGB(150, 150, 150) :
		RGB(100, 150, 110);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(190, 190, 190, 100) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
		pref.styleBlend || pref.styleBlend2 ? RGB(150, 150, 150) :
		RGB(190, 190, 190);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110);
	col.menuTextHovered = pref.styleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = RGB(255, 255, 255);
	col.transportEllipseNormal = RGB(220, 220, 220);
	col.transportEllipseHovered = RGB(200, 200, 200);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(212, 205, 200) : RGB(229, 222, 216) :
		pref.styleTransportButtons === 'emboss' ? RGB(240, 225, 210) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(255, 255, 255) :
		pref.styleTransportButtons === 'emboss' ? RGB(255, 255, 255) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? pref.styleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '';

	col.transportIconNormal = pref.styleBlend || pref.styleBlend2 || pref.styleTransportButtons === 'minimal' ? RGB(65, 135, 80) : RGB(100, 150, 110);
	col.transportIconHovered = RGB(100, 100, 100);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar =
		pref.styleProgressBar === 'bevel' ? RGB(240, 240, 240) :
		pref.styleBevel ? RGB(225, 225, 225) : RGB(255, 255, 255);

	col.progressBarStreaming = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;
	col.progressBarFrame = RGB(230, 230, 230);
	col.progressBarFill = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = tintColor(accentColor,  40);
	col.peakmeterBarFillTop       = tintColor(accentColor,  10);
	col.peakmeterBarFillMiddle    = tintColor(accentColor,  20);
	col.peakmeterBarFillBack      = shadeColor(accentColor, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = accentColor;
	col.peakmeterBarVertFillPeaks = shadeColor(accentColor, 20);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = pref.styleBevel || pref.styleBlend ? tintColor(accentColor, 10) : accentColor;
	col.waveformBarFillBack     = pref.styleBevel || pref.styleBlend ? shadeColor(accentColor, 30) : shadeColor(accentColor, 20);
	col.waveformBarFillPreFront = pref.styleBevel || pref.styleBlend ? RGB(205, 200, 190) : RGB(180, 175, 165);
	col.waveformBarFillPreBack  = pref.styleBevel || pref.styleBlend ? RGB(115, 110, 105) : RGB(140, 135, 130);
	col.waveformBarIndicator    = RGB(60, 60, 60);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(255, 255, 255);
	col.volumeBarFrame = RGB(220, 220, 220);
	col.volumeBarFill = pref.styleBlend || pref.styleBlend2 ? RGB(65, 135, 80) : accentColor;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = '';
	col.styleGradient2 = '';

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 25) :
											pref.styleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 10) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 30) :
											pref.styleBevel ? RGBA(0, 0, 0, 15) : RGBA(0, 0, 0, 10) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) :
											pref.styleBevel ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) :
											pref.styleBevel ? RGBA(255, 255, 255, 120) : RGBA(0, 0, 0, 10) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';
}


///////////////////////////
// * NEON THEME COLORS * //
///////////////////////////
const nblueTheme = {
	name: 'neon blue',
	colors: {
		primary: RGB(10, 10, 10),
		darkAccent: RGB(30, 30, 30),
		accent: RGB(40, 40, 40),
		lightAccent: RGB(50, 50, 50)
	}
};

const ngreenTheme = {
	name: 'neon green',
	colors: {
		primary: RGB(10, 10, 10),
		darkAccent: RGB(30, 30, 30),
		accent: RGB(40, 40, 40),
		lightAccent: RGB(50, 50, 50)
	}
};

const nredTheme = {
	name: 'neon red',
	colors: {
		primary: RGB(10, 10, 10),
		darkAccent: RGB(30, 30, 30),
		accent: RGB(40, 40, 40),
		lightAccent: RGB(50, 50, 50)
	}
};

const ngoldTheme = {
	name: 'neon gold',
	colors: {
		primary: RGB(10, 10, 10),
		darkAccent: RGB(30, 30, 30),
		accent: RGB(40, 40, 40),
		lightAccent: RGB(50, 50, 50)
	}
};


function playlistColorsNeonThemes() {
	// * MAIN COLORS * //
	const accentColor =
		pref.theme === 'nblue'  ? RGB(0, 200, 255) :
		pref.theme === 'ngreen' ? RGB(0, 200, 0) :
		pref.theme === 'nred'   ? RGB(229, 7, 44) :
		pref.theme === 'ngold'  ? RGB(254, 204, 3) : '';

	const accentColorLight =
		pref.theme === 'nblue'  ? RGB(0, 238, 255) :
		pref.theme === 'ngreen' ? RGB(0, 255, 0) :
		pref.theme === 'nred'   ? RGB(255, 8, 8)  :
		pref.theme === 'ngold'  ? RGB(255, 242, 3) : '';

	g_pl_colors.bg = RGB(10, 10, 10);

	// * PLAYLIST MANAGER COLORS * //
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(200, 200, 200);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(220, 220, 220) : RGB(255, 255, 255);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(255, 255, 255) : RGB(200, 200, 200);

	// * HEADER COLORS * //
	g_pl_colors.header_nowplaying_bg = pref.styleBlend || pref.styleBlend2 ? RGBA(25, 25, 25, 100) : RGB(25, 25, 25);
	g_pl_colors.header_sideMarker = accentColor;
	g_pl_colors.header_artist_normal = RGB(240, 240, 240);
	g_pl_colors.header_artist_playing = accentColor;
	g_pl_colors.header_album_normal = RGB(220, 220, 220);
	g_pl_colors.header_album_playing = RGB(240, 240, 240);
	g_pl_colors.header_info_normal = RGB(220, 220, 220);
	g_pl_colors.header_info_playing = RGB(240, 240, 240);
	g_pl_colors.header_date_normal = RGB(220, 220, 220);
	g_pl_colors.header_date_playing = accentColor;
	g_pl_colors.header_line_normal = RGB(45, 45, 45);
	g_pl_colors.header_line_playing = RGB(50, 50, 50);

	// * ROW COLORS * //
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(20, 20, 20, 130) : RGB(20, 20, 20);
	g_pl_colors.row_selection_bg = RGB(10, 10, 10);
	g_pl_colors.row_selection_frame = RGB(40, 40, 40);
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(200, 200, 200);
	g_pl_colors.row_title_playing = RGB(255, 255, 255);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = RGB(45, 45, 45);

	// * SCROLLBAR COLORS * //
	g_pl_colors.sbar_btn_normal = accentColor;
	g_pl_colors.sbar_btn_hovered = accentColorLight;
	g_pl_colors.sbar_thumb_normal = accentColor;
	g_pl_colors.sbar_thumb_hovered = accentColorLight;
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;
}


function libraryColorsNeonThemes() {
	// * MAIN COLORS * //
	const accentColor =
		pref.theme === 'nblue'  ? RGB(0, 200, 255) :
		pref.theme === 'ngreen' ? RGB(0, 200, 0) :
		pref.theme === 'nred'   ? RGB(229, 7, 44) :
		pref.theme === 'ngold'  ? RGB(254, 204, 3) : '';

	const accentColorLight =
		pref.theme === 'nblue'  ? RGB(0, 238, 255) :
		pref.theme === 'ngreen' ? RGB(0, 255, 0) :
		pref.theme === 'nred'   ? RGB(255, 8, 8)  :
		pref.theme === 'ngold'  ? RGB(255, 242, 3) : '';

	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * ROW COLORS * //
	ui.col.nowPlayingBg = ppt.albumArtShow ? tintColor(g_pl_colors.row_nowplaying_bg, 7) : g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * NODE COLORS * //
	ui.col.iconPlus = g_pl_colors.header_artist_playing;
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(45, 45, 45);
	ui.col.iconMinus_e = g_pl_colors.header_artist_playing;
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = RGB(200, 200, 200);
	ui.col.text_h = RGB(255, 255, 255);
	ui.col.text_nowp = g_pl_colors.header_artist_playing;
	ui.col.textSel = RGB(255, 255, 255);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(200, 200, 200);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(200, 200, 200);

	// * BUTTON COLORS * //
	ui.col.searchBtn = g_pl_colors.header_artist_playing;
	ui.col.crossBtn = g_pl_colors.header_artist_playing;
	ui.col.filterBtn = RGB(200, 200, 200);
	ui.col.settingsBtn = g_pl_colors.header_artist_playing;
	ui.col.line = RGB(45, 45, 45);
	ui.col.s_line = ui.col.line;

	// * SCROLLBAR COLORS * //
	ui.col.sbarBtns = accentColor;
	ui.col.sbarNormal = accentColor;
	ui.col.sbarHovered = accentColorLight;
	ui.col.sbarDrag = accentColorLight;
}


function biographyColorsNeonThemes() {
	// * MAIN COLORS * //
	const accentColor =
		pref.theme === 'nblue'  ? RGB(0, 200, 255) :
		pref.theme === 'ngreen' ? RGB(0, 200, 0) :
		pref.theme === 'nred'   ? RGB(229, 7, 44) :
		pref.theme === 'ngold'  ? RGB(254, 204, 3) : '';

	const accentColorLight =
		pref.theme === 'nblue'  ? RGB(0, 238, 255) :
		pref.theme === 'ngreen' ? RGB(0, 255, 0) :
		pref.theme === 'nred'   ? RGB(255, 8, 8)  :
		pref.theme === 'ngold'  ? RGB(255, 242, 3) : '';

	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * HEADER COLORS * //
	uiBio.col.headingText = g_pl_colors.header_artist_playing;
	uiBio.col.bottomLine = RGB(55, 55, 55);
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;

	// * MISC COLORS * //
	uiBio.col.lyricsNormal = uiBio.col.text;
	uiBio.col.lyricsHighlight = accentColor;
	uiBio.col.noPhotoStubBg = RGB(25, 25, 25);
	uiBio.col.noPhotoStubText = g_pl_colors.header_artist_playing;

	// * SCROLLBAR COLORS * //
	uiBio.col.sbarBtns = accentColor;
	uiBio.col.sbarNormal = accentColor;
	uiBio.col.sbarHovered = accentColorLight;
	uiBio.col.sbarDrag = accentColorLight;
}


function mainColorsNeonThemes() {
	// * MAIN COLORS * //
	const accentColor =
		pref.theme === 'nblue'  ? RGB(0, 200, 255) :
		pref.theme === 'ngreen' ? RGB(0, 200, 0) :
		pref.theme === 'nred'   ? RGB(229, 7, 44) :
		pref.theme === 'ngold'  ? RGB(254, 204, 3) : '';

	const accentColorLight =
		pref.theme === 'nblue'  ? RGB(0, 238, 255) :
		pref.theme === 'ngreen' ? RGB(0, 255, 0) :
		pref.theme === 'nred'   ? RGB(255, 8, 8)  :
		pref.theme === 'ngold'  ? RGB(255, 242, 3) : '';

	const accentColorDark =
		pref.theme === 'nblue'  ? RGB(0, 160, 205) :
		pref.theme === 'ngreen' ? RGB(0, 150, 0) :
		pref.theme === 'nred'   ? RGB(180, 5, 35) :
		pref.theme === 'ngold'  ? RGB(200, 160, 0) : '';

	const accentColorDarker =
		pref.theme === 'nblue'  ? RGB(0, 120, 155) :
		pref.theme === 'ngreen' ? RGB(0, 100, 0) :
		pref.theme === 'nred'   ? RGB(130, 5, 25) :
		pref.theme === 'ngold'  ? RGB(150, 120, 0) : '';

	col.bg = pref.styleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);
	col.loadingThemeBg = RGB(20, 20, 20);
	col.uiHacksFrame = RGB(30, 30, 30);
	col.shadow = RGBA(0, 0, 0, 255);
	col.discArtShadow = RGBA(0, 0, 0, 40);
	col.noAlbumArtStub = accentColor;
	col.lowerBarArtist = accentColor;
	col.lowerBarTitle = RGB(220, 220, 220);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;
	col.lyricsNormal = RGB(255, 255, 255);
	col.lyricsHighlight = accentColor;
	col.lyricsShadow = RGB(0, 0, 0);

	// * DETAILS COLORS * //
	col.detailsBg = pref.styleBlend || pref.styleBlend2 ? RGBA(10, 10, 10, 100) : RGB(10, 10, 10);
	col.detailsText = RGB(255, 255, 255);
	col.detailsRating = RGB(255, 170, 32);
	col.detailsHotness = col.detailsRating;
	col.timelineAdded = accentColor;
	col.timelinePlayed = accentColorDark;
	col.timelineUnplayed = accentColorDarker;
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * POPUP COLORS * //
	col.popupBg = RGBAtoRGB(g_pl_colors.header_nowplaying_bg, 255);
	col.popupText = accentColor;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'inner'  ? pref.styleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
		RGB(50, 50, 50);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(35, 35, 35) : RGB(40, 40, 40) :
		pref.styleBevel ? RGB(25, 25, 25) : RGB(20, 20, 20);

	col.menuRectStyleEmbossTop = RGB(60, 60, 60);
	col.menuRectStyleEmbossBottom = RGB(0, 0, 0);
	col.menuRectNormal = pref.styleTopMenuButtons === 'filled' ? RGBtoRGBA(accentColor, 80) : accentColor;

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBtoRGBA(accentColorLight, 80) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
		accentColorLight;

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal  = accentColor;
	col.menuTextHovered = accentColorLight;
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = RGB(35, 35, 35);
	col.transportEllipseNormal = RGB(50, 50, 50);
	col.transportEllipseHovered = accentColorLight;
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(0, 0, 0) :
		pref.styleTransportButtons === 'emboss' ? RGB(50, 50, 50) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(50, 50, 50) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(0, 0, 0) :
		pref.styleTransportButtons === 'emboss' ? RGB(10, 10, 10) : '';

	col.transportIconNormal  = accentColor;
	col.transportIconHovered = accentColorLight;
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(35, 35, 35);
	col.progressBarStreaming = accentColorLight;
	col.progressBarFrame = col.bg;
	col.progressBarFill = accentColor;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = tintColor(accentColor,  40);
	col.peakmeterBarFillTop       = tintColor(accentColor,  10);
	col.peakmeterBarFillMiddle    = tintColor(accentColor,  20);
	col.peakmeterBarFillBack      = shadeColor(accentColor, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = accentColor;
	col.peakmeterBarVertFillPeaks = tintColor(accentColor,  60);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = accentColor;
	col.waveformBarFillBack     = shadeColor(accentColor, 20);
	col.waveformBarFillPreFront = RGB(100, 100, 100);
	col.waveformBarFillPreBack  = RGB(80, 80, 80);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(30, 30, 30);
	col.volumeBarFrame = RGB(50, 50, 50);
	col.volumeBarFill = accentColor;

	// * STYLE COLORS * //
	col.styleBevel = RGB(0, 0, 0);
	col.styleGradient = '';
	col.styleGradient2 = '';
	col.styleAlternative = pref.styleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);

	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '';

	col.styleProgressBarLineTop = RGBA(0, 0, 0, 255);

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(255, 255, 255, 20) :
											pref.styleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(255, 255, 255, 20) :
											pref.styleBevel ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 25) :
		RGBA(0, 0, 0, 100);

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 80) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 80) : '';
}


/////////////////////////////
// * CUSTOM THEME COLORS * //
/////////////////////////////
const customTheme = {
	name: 'custom',
	colors: {
		primary: RGB(50, 25, 70),
		darkAccent: RGB(30, 15, 45),
		accent: RGB(65, 35, 95),
		lightAccent: RGB(75, 40, 110)
	}
};


function playlistColorsCustomTheme() {
	try {
		// * MAIN COLORS * //
		g_pl_colors.bg = HEXtoRGB(customColor.g_pl_colors_bg);

		// * PLAYLIST MANAGER COLORS * //
		g_pl_colors.plman_bg = g_pl_colors.bg;
		g_pl_colors.plman_text_normal = pref.autoHidePlman ? HEXtoRGB(customColor.g_pl_colors_bg) : HEXtoRGB(customColor.g_pl_colors_plman_text_normal);
		g_pl_colors.plman_text_hovered = HEXtoRGB(customColor.g_pl_colors_plman_text_hovered);
		g_pl_colors.plman_text_pressed = HEXtoRGB(customColor.g_pl_colors_plman_text_pressed);

		// * HEADER COLORS * //
		g_pl_colors.header_nowplaying_bg = pref.styleBlend ? HEXtoRGBA(customColor.g_pl_colors_header_nowplaying_bg, 130) : HEXtoRGB(customColor.g_pl_colors_header_nowplaying_bg);
		g_pl_colors.header_sideMarker = HEXtoRGB(customColor.g_pl_colors_header_sideMarker);
		g_pl_colors.header_artist_normal = HEXtoRGB(customColor.g_pl_colors_header_artist_normal);
		g_pl_colors.header_artist_playing = HEXtoRGB(customColor.g_pl_colors_header_artist_playing);
		g_pl_colors.header_album_normal = HEXtoRGB(customColor.g_pl_colors_header_album_normal);
		g_pl_colors.header_album_playing = HEXtoRGB(customColor.g_pl_colors_header_album_playing);
		g_pl_colors.header_info_normal = HEXtoRGB(customColor.g_pl_colors_header_info_normal);
		g_pl_colors.header_info_playing = HEXtoRGB(customColor.g_pl_colors_header_info_playing);
		g_pl_colors.header_date_normal = HEXtoRGB(customColor.g_pl_colors_header_date_normal);
		g_pl_colors.header_date_playing = HEXtoRGB(customColor.g_pl_colors_header_date_playing);
		g_pl_colors.header_line_normal = HEXtoRGB(customColor.g_pl_colors_header_line_normal);
		g_pl_colors.header_line_playing = HEXtoRGB(customColor.g_pl_colors_header_line_playing);

		// * ROW COLORS * //
		g_pl_colors.row_nowplaying_bg = pref.styleBlend ? HEXtoRGBA(customColor.g_pl_colors_row_nowplaying_bg, 130) : HEXtoRGB(customColor.g_pl_colors_row_nowplaying_bg);
		g_pl_colors.row_stripes_bg = pref.styleBlend ? HEXtoRGBA(customColor.g_pl_colors_row_stripes_bg, 130) : HEXtoRGB(customColor.g_pl_colors_row_stripes_bg);
		g_pl_colors.row_selection_frame = HEXtoRGB(customColor.g_pl_colors_row_selection_frame);
		g_pl_colors.row_sideMarker = HEXtoRGB(customColor.g_pl_colors_row_sideMarker);
		g_pl_colors.row_title_normal = pref.styleBlend ? shadeColor(HEXtoRGB(customColor.g_pl_colors_row_title_normal), 10) : HEXtoRGB(customColor.g_pl_colors_row_title_normal);
		g_pl_colors.row_title_playing = HEXtoRGB(customColor.g_pl_colors_row_title_playing);
		g_pl_colors.row_title_selected = HEXtoRGB(customColor.g_pl_colors_row_title_selected);
		g_pl_colors.row_title_hovered = HEXtoRGB(customColor.g_pl_colors_row_title_hovered);
		g_pl_colors.row_rating_color = HEXtoRGB(customColor.g_pl_colors_row_rating_color);
		g_pl_colors.row_disc_subheader_line = HEXtoRGB(customColor.g_pl_colors_row_disc_subheader_line);

		// * SCROLLBAR COLORS * //
		g_pl_colors.sbar_btn_normal = HEXtoRGB(customColor.g_pl_colors_sbar_btn_normal);
		g_pl_colors.sbar_btn_hovered = HEXtoRGB(customColor.g_pl_colors_sbar_btn_hovered);
		g_pl_colors.sbar_thumb_normal = HEXtoRGB(customColor.g_pl_colors_sbar_thumb_normal);
		g_pl_colors.sbar_thumb_hovered = HEXtoRGB(customColor.g_pl_colors_sbar_thumb_hovered);
		g_pl_colors.sbar_thumb_drag = HEXtoRGB(customColor.g_pl_colors_sbar_thumb_drag);
	}
	catch (e) {
		const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		fb.ShowPopupMessage(`Error when initializing playlist custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${configPathCustom}\n`, 'Playlist custom theme color error');
	}
}


function libraryColorsCustomTheme() {
	try {
		// * MAIN COLORS * //
		ui.col.bg = HEXtoRGB(customColor.ui_col_bg);
		ui.col.rowStripes = pref.styleBlend ? HEXtoRGBA(customColor.ui_col_rowStripes, 130) : HEXtoRGB(customColor.ui_col_rowStripes);

		// * ROW COLORS * //
		ui.col.nowPlayingBg = pref.styleBlend ? HEXtoRGBA(customColor.ui_col_nowPlayingBg, 130) : HEXtoRGB(customColor.ui_col_nowPlayingBg);
		ui.col.sideMarker = HEXtoRGB(customColor.ui_col_sideMarker);
		ui.col.selectionFrame = HEXtoRGB(customColor.ui_col_selectionFrame);
		ui.col.selectionFrame2 = HEXtoRGB(customColor.ui_col_selectionFrame2);
		ui.col.hoverFrame = HEXtoRGB(customColor.ui_col_hoverFrame);

		// * NODE COLORS * //
		ui.col.iconPlus = pref.styleBlend ? shadeColor(HEXtoRGB(customColor.ui_col_iconPlus), 10) : HEXtoRGB(customColor.ui_col_iconPlus);
		ui.col.iconPlus_h = HEXtoRGB(customColor.ui_col_iconPlus_h);
		ui.col.iconPlus_sel = HEXtoRGB(customColor.ui_col_iconPlus_sel);
		ui.col.iconPlusBg = HEXtoRGB(customColor.ui_col_iconPlusBg);
		ui.col.iconMinus_e = pref.styleBlend ? shadeColor(HEXtoRGB(customColor.ui_col_iconMinus_e), 10) : HEXtoRGB(customColor.ui_col_iconMinus_e);
		ui.col.iconMinus_c = HEXtoRGB(customColor.ui_col_iconMinus_c);
		ui.col.iconMinus_h = HEXtoRGB(customColor.ui_col_iconMinus_h);

		// * TEXT COLORS * //
		ui.col.text = ppt.albumArtShow && img.labels.overlayDark ? tintColor(HEXtoRGB(customColor.ui_col_text), 40) : pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_text), 10) : HEXtoRGB(customColor.ui_col_text);
		ui.col.text_h = ppt.albumArtShow && img.labels.overlayDark ? tintColor(HEXtoRGB(customColor.ui_col_text), 40) : HEXtoRGB(customColor.ui_col_text_h);
		ui.col.text_nowp = HEXtoRGB(customColor.ui_col_text_nowp);
		ui.col.textSel = ppt.albumArtShow ? ui.col.text_nowp : HEXtoRGB(customColor.ui_col_textSel);
		ui.col.txt = HEXtoRGB(customColor.ui_col_txt);
		ui.col.txt_h = HEXtoRGB(customColor.ui_col_txt_h);
		ui.col.txt_box = pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_txt_box), 10) : HEXtoRGB(customColor.ui_col_txt_box);
		ui.col.search = pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_search), 10) : HEXtoRGB(customColor.ui_col_search);

		// * BUTTON COLORS * //
		ui.col.searchBtn = HEXtoRGB(customColor.ui_col_searchBtn);
		ui.col.crossBtn = pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_crossBtn), 10) : HEXtoRGB(customColor.ui_col_crossBtn);
		ui.col.filterBtn = pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_filterBtn), 10) : HEXtoRGB(customColor.ui_col_filterBtn);
		ui.col.settingsBtn = pref.styleBlend ? tintColor(HEXtoRGB(customColor.ui_col_settingsBtn), 10) : HEXtoRGB(customColor.ui_col_settingsBtn);
		ui.col.line = HEXtoRGB(customColor.ui_col_line);
		ui.col.s_line = HEXtoRGB(customColor.ui_col_s_line);

		// * SCROLLBAR COLORS * //
		ui.col.sbarBtns = HEXtoRGB(customColor.ui_col_sbarBtns);
		ui.col.sbarNormal = HEXtoRGB(customColor.ui_col_sbarNormal);
		ui.col.sbarHovered = HEXtoRGB(customColor.ui_col_sbarHovered);
		ui.col.sbarDrag = HEXtoRGB(customColor.ui_col_sbarDrag);
	}
	catch (e) {
		const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		fb.ShowPopupMessage(`Error when initializing library custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${configPathCustom}\n`, 'Library custom theme color error');
	}
}


function biographyColorsCustomTheme() {
	try {
		// * MAIN COLORS * //
		uiBio.col.bg = HEXtoRGB(customColor.uiBio_col_bg);
		uiBio.col.rowStripes = pref.styleBlend ? HEXtoRGBA(customColor.uiBio_col_rowStripes, 130) : HEXtoRGB(customColor.uiBio_col_rowStripes);

		// * HEADER COLORS * //
		uiBio.col.headingText = pref.styleBlend ? tintColor(HEXtoRGB(customColor.uiBio_col_headingText), 10) : HEXtoRGB(customColor.uiBio_col_headingText);
		uiBio.col.bottomLine = (uiBio.blur.blend || uiBio.blur.light) ? shadeColor(HEXtoRGB(customColor.uiBio_col_bottomLine), 25) : HEXtoRGB(customColor.uiBio_col_bottomLine);
		uiBio.col.centerLine = HEXtoRGB(customColor.uiBio_col_centerLine);
		uiBio.col.sectionLine = HEXtoRGB(customColor.uiBio_col_sectionLine);

		// * TEXT COLORS * //
		uiBio.col.text = pref.styleBlend ? tintColor(HEXtoRGB(customColor.uiBio_col_text), 10) : HEXtoRGB(customColor.uiBio_col_text);
		uiBio.col.source = pref.styleBlend ? tintColor(HEXtoRGB(customColor.uiBio_col_source), 10) : HEXtoRGB(customColor.uiBio_col_source);
		uiBio.col.accent = pref.styleBlend ? tintColor(HEXtoRGB(customColor.uiBio_col_accent), 10) : HEXtoRGB(customColor.uiBio_col_accent);
		uiBio.col.summary = pref.styleBlend ? tintColor(HEXtoRGB(customColor.uiBio_col_summary), 10) : HEXtoRGB(customColor.uiBio_col_summary);

		// * MISC COLORS * //
		uiBio.col.lyricsNormal = HEXtoRGB(customColor.uiBio_col_lyricsNormal);
		uiBio.col.lyricsHighlight = HEXtoRGB(customColor.uiBio_col_lyricsHighlight);
		uiBio.col.noPhotoStubBg = HEXtoRGB(customColor.uiBio_col_noPhotoStubBg);
		uiBio.col.noPhotoStubText = HEXtoRGB(customColor.uiBio_col_noPhotoStubText);

		// * SCROLLBAR COLORS * //
		uiBio.col.sbarBtns = HEXtoRGB(customColor.uiBio_col_sbarBtns);
		uiBio.col.sbarNormal = HEXtoRGB(customColor.uiBio_col_sbarNormal);
		uiBio.col.sbarHovered = HEXtoRGB(customColor.uiBio_col_sbarHovered);
		uiBio.col.sbarDrag = HEXtoRGB(customColor.uiBio_col_sbarDrag);
	}
	catch (e) {
		const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		fb.ShowPopupMessage(`Error when initializing biography custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${configPathCustom}\n`, 'Biography custom theme color error');
	}
}


function mainColorsCustomTheme() {
	try {
		const lightImg = imgBrightness > 180;
		const lightBg = new Color(HEXtoRGB(customColor.col_bg)).brightness > 200;
		const darkBg = new Color(HEXtoRGB(customColor.col_bg)).brightness < 50;

		// * MAIN COLORS * //
		col.bg = pref.styleBevel ? tintColor(HEXtoRGB(customColor.col_bg), lightBgMain ? 80 : 0) : HEXtoRGB(customColor.col_bg);
		col.loadingThemeBg = RGB(255, 255, 255);
		col.uiHacksFrame = col.bg;
		col.shadow = HEXtoRGBA(customColor.col_shadow, lightBgMain ? 50 : 75);
		col.discArtShadow = HEXtoRGBA(customColor.col_discArtShadow, lightBgMain ? 50 : 75);
		col.noAlbumArtStub = HEXtoRGB(customColor.col_noAlbumArtStub);
		col.lowerBarArtist = pref.styleBlend || pref.styleBlend2 ? tintColor(HEXtoRGB(customColor.col_lowerBarArtist), 10) : HEXtoRGB(customColor.col_lowerBarArtist);
		col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? tintColor(HEXtoRGB(customColor.col_lowerBarTitle), 10) : HEXtoRGB(customColor.col_lowerBarTitle);
		col.lowerBarTime = HEXtoRGB(customColor.col_lowerBarTime);
		col.lowerBarLength = HEXtoRGB(customColor.col_lowerBarLength);
		col.lyricsNormal = HEXtoRGB(customColor.col_lyricsNormal);
		col.lyricsHighlight = HEXtoRGB(customColor.col_lyricsHighlight);
		col.lyricsShadow = HEXtoRGB(customColor.col_lyricsShadow);

		// * DETAILS COLORS * //
		col.detailsBg = HEXtoRGB(customColor.col_detailsBg);
		col.detailsText = HEXtoRGB(customColor.col_detailsText);
		col.detailsRating = HEXtoRGB(customColor.col_detailsRating);
		col.detailsHotness = col.detailsRating;

		col.timelineAdded =
			isStreaming ? RGB(207, 0, 5) :
			lightBgDetails ? shadeColor(HEXtoRGB(customColor.col_timelinePlayed), pref.styleBlend ? 35 : 0) :
			HEXtoRGB(customColor.col_timelineAdded);

		col.timelinePlayed =
			isStreaming ? RGB(207, 0, 5) :
			lightBgDetails ? shadeColor(HEXtoRGB(customColor.col_timelinePlayed), pref.styleBlend ? 35 : 0) :
			HEXtoRGB(customColor.col_timelinePlayed);

		col.timelineUnplayed =
			isStreaming ? RGB(207, 0, 5) :
			lightBgDetails ? shadeColor(HEXtoRGB(customColor.col_timelineUnplayed), pref.styleBlend ? 20 : 0) :
			HEXtoRGB(customColor.col_timelineUnplayed);

		col.timelineFrame = HEXtoRGB(customColor.col_timelineFrame);
		if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

		// * POPUP COLORS * //
		col.popupBg = HEXtoRGB(customColor.col_popupBg);
		col.popupText = HEXtoRGB(customColor.col_popupText);

		// * TOP MENU BUTTON COLORS * //
		col.menuBgColor =
			pref.styleBlend || pref.styleBlend2 ?
				lightBgMain ? shadeColor(HEXtoRGB(customColor.col_menuBgColor), 10) : tintColor(HEXtoRGB(customColor.col_menuBgColor), 10) :
			HEXtoRGB(customColor.col_menuBgColor);

		col.menuStyleBg =
			pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
				pref.styleBevel ? lightBgMain ? shadeColor(HEXtoRGB(customColor.col_menuStyleBg), 10) : tintColor(HEXtoRGB(customColor.col_menuStyleBg), 10) : HEXtoRGB(customColor.col_menuStyleBg) :
			pref.styleTopMenuButtons === 'emboss' ?
				lightBgMain ? shadeColor(HEXtoRGB(customColor.col_menuStyleBg), 10) : tintColor(HEXtoRGB(customColor.col_menuStyleBg), 10) : '';

		col.menuRectStyleEmbossTop = HEXtoRGB(customColor.col_menuRectStyleEmbossTop);
		col.menuRectStyleEmbossBottom = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_menuRectStyleEmbossBottom), 10) : HEXtoRGB(customColor.col_menuRectStyleEmbossBottom);

		col.menuRectNormal =
			pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? tintColor(HEXtoRGB(customColor.col_menuRectNormal), 10) : HEXtoRGB(customColor.col_menuRectNormal) :
			pref.styleAlternative2 ? tintColor(HEXtoRGB(customColor.col_menuRectNormal), 10) :
			HEXtoRGB(customColor.col_menuRectNormal);

		col.menuRectHovered =
			pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
				pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_menuRectHovered), 15) : shadeColor(HEXtoRGB(customColor.col_menuRectHovered), 5) :
			pref.styleBlend || pref.styleBlend2 ?
				pref.styleBevel ? tintColor(HEXtoRGB(customColor.col_menuRectHovered), 10) : tintColor(HEXtoRGB(customColor.col_menuRectHovered), 5) :
			pref.styleAlternative2 ? tintColor(HEXtoRGB(customColor.col_menuRectHovered), 10) :
			HEXtoRGB(customColor.col_menuRectHovered);

		col.menuRectDown = HEXtoRGB(customColor.col_menuRectDown);
		col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? tintColor(HEXtoRGB(customColor.col_menuTextNormal), 10) : HEXtoRGB(customColor.col_menuTextNormal);
		col.menuTextHovered = HEXtoRGB(customColor.col_menuTextHovered);
		col.menuTextDown = HEXtoRGB(customColor.col_menuTextDown);

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		col.transportEllipseBg =
			pref.styleBlend || pref.styleBlend2 ?
				lightImg || lightBgMain ? shadeColor(HEXtoRGB(customColor.col_transportEllipseBg), 5) : tintColor(HEXtoRGB(customColor.col_transportEllipseBg), 10) :
			darkBg && pref.styleTransportButtons === 'emboss' ? tintColor(HEXtoRGB(customColor.col_transportEllipseBg), 15) : HEXtoRGB(customColor.col_transportEllipseBg);

		col.transportEllipseNormal =
			pref.styleBlend || pref.styleBlend2 ?
				pref.styleBevel ? tintColor(HEXtoRGB(customColor.col_transportEllipseNormal), 5) : tintColor(HEXtoRGB(customColor.col_transportEllipseNormal), 10) :
			HEXtoRGB(customColor.col_transportEllipseNormal);

		col.transportEllipseHovered =
			pref.styleBlend || pref.styleBlend2 ?
				pref.styleBevel ? tintColor(HEXtoRGB(customColor.col_transportEllipseHovered), 5) : tintColor(HEXtoRGB(customColor.col_transportEllipseHovered), 10) :
			HEXtoRGB(customColor.col_transportEllipseHovered);

		col.transportEllipseDown = HEXtoRGB(customColor.col_transportEllipseDown);

		col.transportStyleBg =
			pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ?
				shadeColor(HEXtoRGB(customColor.col_transportStyleBg), 0) :
			pref.styleTransportButtons === 'emboss' ?
			pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_transportStyleBottom), 5) : tintColor(HEXtoRGB(customColor.col_transportStyleBg), 0) : '';

		col.transportStyleTop =
			pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ?
				tintColor(HEXtoRGB(customColor.col_transportStyleTop), 0) :
			pref.styleTransportButtons === 'emboss' ?
				lightImg || lightBgMain ? tintColor(HEXtoRGB(customColor.col_transportStyleTop), 0) :
				tintColor(HEXtoRGB(customColor.col_transportStyleTop), 15) : '';

		col.transportStyleBottom =
			pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ?
				shadeColor(HEXtoRGB(customColor.col_transportStyleBottom), 0) :
			pref.styleTransportButtons === 'emboss' ?
				darkBg ? shadeColor(HEXtoRGB(customColor.col_transportStyleBottom), 20) :
				tintColor(HEXtoRGB(customColor.col_transportStyleBottom), 10) : '';

		col.transportIconNormal =
			pref.styleBlend || pref.styleBlend2 ? tintColor(HEXtoRGB(customColor.col_transportIconNormal), 10) : HEXtoRGB(customColor.col_transportIconNormal);

		col.transportIconHovered =
			pref.styleBlend || pref.styleBlend2 ? tintColor(HEXtoRGB(customColor.col_transportIconHovered), 10) : HEXtoRGB(customColor.col_transportIconHovered);

		col.transportIconDown = HEXtoRGB(customColor.col_transportIconDown);

		// * PROGRESS BAR COLORS * //
		col.progressBar =
			pref.styleProgressBar === 'bevel' ?
				pref.styleBlend || pref.styleBlend2 ? lightImg || lightBgMain ? shadeColor(HEXtoRGB(customColor.col_progressBar), 5) : tintColor(HEXtoRGB(customColor.col_progressBar), 10) :
				pref.styleBevel ? HEXtoRGB(customColor.col_progressBar) : tintColor(HEXtoRGB(customColor.col_progressBar), 10) :
			pref.styleProgressBar === 'inner' ?
				pref.styleBlend || pref.styleBlend2 ? lightImg || lightBgMain ? tintColor(HEXtoRGB(customColor.col_progressBar), 10) : tintColor(HEXtoRGB(customColor.col_progressBar), 5) :
				pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_progressBar), 5) : HEXtoRGB(customColor.col_progressBar) :
			pref.styleBlend || pref.styleBlend2 ? lightBgMain ? tintColor(HEXtoRGB(customColor.col_progressBar), 10) : tintColor(HEXtoRGB(customColor.col_progressBar), 5) :
			pref.styleBevel ? lightBgMain ? shadeColor(HEXtoRGB(customColor.col_progressBar), 5) : tintColor(HEXtoRGB(customColor.col_progressBar), 5) :
			HEXtoRGB(customColor.col_progressBar);

		col.progressBarStreaming = HEXtoRGB(customColor.col_progressBarStreaming);
		col.progressBarFrame = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_progressBarFrame), 5) : HEXtoRGB(customColor.col_progressBarFrame);
		col.progressBarFill = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_progressBarFill), 5) : HEXtoRGB(customColor.col_progressBarFill);

		// * PEAKMETER BAR COLORS * //
		col.peakmeterBarProg          = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarProg), 5) : HEXtoRGB(customColor.col_peakmeterBarProg);
		col.peakmeterBarProgFill      = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarProgFill), 5) : HEXtoRGB(customColor.col_peakmeterBarProgFill);
		col.peakmeterBarFillTop       = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarFillTop), 5) : HEXtoRGB(customColor.col_peakmeterBarFillTop);
		col.peakmeterBarFillMiddle    = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarFillMiddle), 5) : HEXtoRGB(customColor.col_peakmeterBarFillMiddle);
		col.peakmeterBarFillBack      = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarFillBack), 5) : HEXtoRGB(customColor.col_peakmeterBarFillBack);
		col.peakmeterBarVertProgFill  = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarVertProgFill), 5) : HEXtoRGB(customColor.col_peakmeterBarVertProgFill);
		col.peakmeterBarVertFill      = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarVertFill), 5) : HEXtoRGB(customColor.col_peakmeterBarVertFill);
		col.peakmeterBarVertFillPeaks = pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_peakmeterBarVertFillPeaks), 5) : HEXtoRGB(customColor.col_peakmeterBarVertFillPeaks);
		if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

		// * WAVEFORM BAR COLORS * //
		col.waveformBarFillFront    = lightBg && (pref.styleBevel || pref.styleBlend) ? shadeColor(HEXtoRGB(customColor.col_waveformBarFillFront), 5) : HEXtoRGB(customColor.col_waveformBarFillFront);
		col.waveformBarFillBack     = lightBg && (pref.styleBevel || pref.styleBlend) ? shadeColor(HEXtoRGB(customColor.col_waveformBarFillBack), 5) : HEXtoRGB(customColor.col_waveformBarFillBack);
		col.waveformBarFillPreFront = lightBg && (pref.styleBevel || pref.styleBlend) ? shadeColor(HEXtoRGB(customColor.col_waveformBarFillPreFront), 10) : HEXtoRGB(customColor.col_waveformBarFillPreFront);
		col.waveformBarFillPreBack  = lightBg && (pref.styleBevel || pref.styleBlend) ? shadeColor(HEXtoRGB(customColor.col_waveformBarFillPreBack), 5) : HEXtoRGB(customColor.col_waveformBarFillPreBack);
		col.waveformBarIndicator    = HEXtoRGB(customColor.col_waveformBarIndicator);

		// * VOLUME BAR COLORS * //
		col.volumeBar = HEXtoRGB(customColor.col_volumeBar);

		col.volumeBarFrame =
			pref.styleVolumeBar === 'bevel' || pref.styleVolumeBar === 'inner' ? tintColor(HEXtoRGB(customColor.col_volumeBarFrame), 5) :
			HEXtoRGB(customColor.col_volumeBarFrame);

		col.volumeBarFill = HEXtoRGB(customColor.col_volumeBarFill);

		// * STYLE COLORS * //
		col.styleBevel = HEXtoRGB(customColor.col_styleBevel);
		col.styleGradient = HEXtoRGB(customColor.col_styleGradient);
		col.styleGradient2 = HEXtoRGB(customColor.col_styleGradient2);

		col.styleProgressBar =
			pref.styleProgressBar === 'bevel' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBar), lightBg ? 5 : 10) : HEXtoRGB(customColor.col_styleProgressBar) :
			pref.styleProgressBar === 'inner' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBar), lightBg ? 5 : 10) : HEXtoRGB(customColor.col_styleProgressBar) : '';

		col.styleProgressBarLineTop =
			pref.styleProgressBar === 'bevel' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBarLineTop), darkBg ? 40 : lightBg ? 0 : 10) : HEXtoRGB(customColor.col_styleProgressBarLineTop) :
			pref.styleProgressBar === 'inner' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBarLineTop), darkBg ? 20 : lightBg ? 5 : 10) : HEXtoRGB(customColor.col_styleProgressBarLineTop) : '';

		col.styleProgressBarLineBottom =
			pref.styleProgressBar === 'bevel' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBarLineBottom), darkBg ? 30 : lightBg ? 30 : 20) : HEXtoRGB(customColor.col_styleProgressBarLineBottom) :
			pref.styleProgressBar === 'inner' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleProgressBarLineBottom), darkBg ? 25 : lightBg ? 15 : 20) : HEXtoRGB(customColor.col_styleProgressBarLineBottom) : '';

		col.styleProgressBarFill =
			pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? shadeColor(HEXtoRGB(customColor.col_styleProgressBarFill), 15) :
			HEXtoRGB(customColor.col_styleProgressBarFill);

		col.styleVolumeBar =
			pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleVolumeBar), 10) : HEXtoRGB(customColor.col_styleVolumeBar) :
			pref.styleVolumeBar === 'inner' ? pref.styleBevel ? shadeColor(HEXtoRGB(customColor.col_styleVolumeBar), 10) : HEXtoRGB(customColor.col_styleVolumeBar) : '';

		col.styleVolumeBarFill =
			pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? shadeColor(HEXtoRGB(customColor.col_styleVolumeBarFill), 15) :
			HEXtoRGB(customColor.col_styleVolumeBarFill);
	}
	catch (e) {
		const configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		fb.ShowPopupMessage(`Error when initializing main custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${configPathCustom}\n`, 'Main custom theme color error');
	}
}


//////////////////////////////
// * LIBRARY THEME COLORS * //
//////////////////////////////
function libraryThemeColors() {
	// * SETUP COLORS * //
	const colBrightness = new Color(ui.col.bg).brightness;
	lightBgLib =
		ppt.theme === 1 && imgBrightness > 200
		||
		ppt.theme === 2 && (colBrightness > 150 || colBrightness > 75 && imgBrightness > 200)
		||
		ppt.theme === 3
		||
		ppt.theme === 5 && (colBrightness > 150);

	// * GET BLENDED BG IMAGE * //
	ui.get = true;

	// * ROW COLORS * //
	ui.col.selectionFrame = lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);

	// * NODE COLORS * //
	ui.col.iconPlus = lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
	ui.col.iconPlus_h = lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
	ui.col.iconPlus_sel = lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * TEXT COLORS * //
	ui.col.text = lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
	ui.col.text_h = lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
	ui.col.textSel = ppt.albumArtShow ? ui.col.text_nowp : ui.col.text;
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = lightBgLib ? RGB(40, 40, 40) : RGB(220, 220, 220);
	ui.col.count = ui.col.text;

	// * BUTTON COLORS * //
	ui.col.search = lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
	ui.col.searchBtn = lightBgLib ? RGB(0, 0, 0) : RGB(255, 255, 255);
	ui.col.crossBtn = lightBgLib ? RGB(40, 40, 40) : RGB(255, 255, 255);
	ui.col.filterBtn = lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
	ui.col.settingsBtn = lightBgLib ? RGB(60, 60, 60) : RGB(220, 220, 220);
	ui.col.line = lightBgLib ? RGBA(0, 0, 0, 100) : RGBA(255, 255, 255, 100);
	ui.col.s_line = ui.col.line;
}


////////////////////////////////
// * BIOGRAPHY THEME COLORS * //
////////////////////////////////
function biographyThemeColors() {
	// * SETUP COLORS * //
	const colBrightness = new Color(uiBio.col.bg).brightness;
	lightBgBio =
		pptBio.theme === 1 && imgBrightness > 200
		||
		pptBio.theme === 2 && (colBrightness > 150 || imgBrightness > 200)
		||
		pptBio.theme === 3
		||
		pptBio.theme === 4 && imgBrightness > 150;

	// * MAIN COLORS * //
	uiBio.col.rowStripes = RGBtoRGBA(g_pl_colors.row_stripes_bg, 100);

	// * HEADER COLORS * //
	uiBio.col.headingText = lightBgBio ? RGB(65, 65, 65) : RGB(230, 230, 230);
	uiBio.col.bottomLine = lightBgBio ? RGB(120, 120, 120) : g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sectionLine = uiBio.col.bottomLine;

	// * TEXT COLORS * //
	uiBio.col.text = lightBgBio ? RGB(60, 60, 60) : RGB(220, 220, 220);
	uiBio.col.source = uiBio.col.headingText;
	uiBio.col.accent = uiBio.col.headingText;
	uiBio.col.summary = uiBio.col.text;
}


/////////////////////////////////
// * THEME COLOR ADJUSTMENTS * //
/////////////////////////////////
function themeColorAdjustments() {
	const cBRT = colBrightness;
	const iBRT = imgBrightness;
	const bevel = pref.styleBevel;
	const blend = pref.styleBlend;
	const blend2 = pref.styleBlend2;
	const alt = pref.styleAlternative;
	const transpBtns = pref.styleTransportButtons;
	const progBar = pref.styleProgressBar;
	const progBarFillBevelInner = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner';

	// * WHITE THEME/REBORN WHITE WITH STYLE BLEND - dynamically adjust transport buttons styles
	if (((pref.theme === 'white' && !pref.styleBlackAndWhite2 || pref.styleRebornWhite) && (blend || blend2)) && fb.IsPlaying && !isStreaming && !isPlayingCD) {
		switch (true) {
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) > 500: col.transportStyleBottom = RGB(175, 175, 175); break;
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) > 300: col.transportStyleBottom = RGB(180, 180, 180); break;
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) > 150: col.transportStyleBottom = RGB(185, 185, 185); break;
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) >  75: col.transportStyleBottom = RGB(190, 190, 190); break;
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) >  50: col.transportStyleBottom = RGB(195, 195, 195); break;
			case colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) >   0: col.transportStyleBottom = RGB(200, 200, 200); break;
		}
	}

	// * WHITE THEME/REBORN WHITE WITH STYLE BLEND - dynamically adjust progress bar background color
	if ((pref.theme === 'white' || pref.styleRebornWhite) && (blend || blend2) && fb.IsPlaying) {
		if (colorDistance(RGB(iBRT, iBRT, iBRT), col.bg, true) < 180) {
			if (settings.showThemeLog) console.log('>>> Blended album art image is too close to col.bg. Adjusting progress bar');
			col.progressBar = bevel ? tintColor(col.progressBar, 10) : shadeColor(col.progressBar, 10);
		}
		if (!pref.styleBlackAndWhiteReborn && colorDistance(col.progressBarFill, col.progressBar, true) < 150) {
			if (settings.showThemeLog) console.log('>>> Progress bar fill color is too close to progress bar background. Adjusting progress bar fill');
			col.progressBarFill = bevel ? shadeColor(col.progressBarFill, 20) : shadeColor(col.progressBarFill, 10);
		}
	}

	////////////////////////////
	// * STYLE BLACK REBORN * //
	////////////////////////////
	if (pref.styleBlackReborn && fb.IsPlaying && !isStreaming && !isPlayingCD && !noAlbumArtStub) {
		// * PLAYLIST COLORS * //
		g_pl_colors.header_nowplaying_bg =
			cBRT > 200 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT > 175 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT > 150 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT > 125 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT > 100 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT >  75 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT >  50 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT >  25 ? blend ? RGBtoRGBA(col.primary, bevel ? 180 : 200) : col.primary :
			cBRT >   0 ? cBRT < 10 ? tintColor(col.primary, blend || blend2 ? 15 : 10) :
									 tintColor(col.primary, blend || blend2 ? 15 :  5) : '';

		g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;

		// * MAIN COLORS * //
		col.transportEllipseBg =
			cBRT > 150 ? transpBtns === 'emboss' ? tintColor(col.transportEllipseBg, 10) : col.transportEllipseBg :
			col.transportEllipseBg;

		col.transportStyleTop =
			cBRT > 200 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  30) : tintColor(col.transportStyleTop,  10) :
			cBRT > 175 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  30) : tintColor(col.transportStyleTop,  10) :
			cBRT > 150 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  30) : tintColor(col.transportStyleTop,  10) :
			cBRT > 125 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  30) : tintColor(col.transportStyleTop,  15) :
			cBRT > 100 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  40) : shadeColor(col.transportStyleTop, 10) :
			cBRT >  75 ? transpBtns === 'emboss' ? tintColor(col.transportStyleTop,  40) : shadeColor(col.transportStyleTop,  8) :
			cBRT >  50 ? transpBtns === 'emboss' ? shadeColor(col.transportStyleTop, 10) : tintColor(col.transportStyleTop,   6) :
			cBRT >  25 ? transpBtns === 'emboss' ? shadeColor(col.transportStyleTop, 20) : tintColor(col.transportStyleTop,   4) :
			cBRT >   0 ? transpBtns === 'emboss' ? shadeColor(col.transportStyleTop, 20) : tintColor(col.transportStyleTop,   4) : '';

		col.transportStyleBottom =
			cBRT > 200 ? tintColor(col.transportStyleBottom,   6) :
			cBRT > 175 ? tintColor(col.transportStyleBottom,   6) :
			cBRT > 150 ? tintColor(col.transportStyleBottom,   6) :
			cBRT > 125 ? tintColor(col.transportStyleBottom,   6) :
			cBRT > 100 ? shadeColor(col.transportStyleBottom,  6) :
			cBRT >  75 ? shadeColor(col.transportStyleBottom, 12) :
			cBRT >  50 ? tintColor(col.transportStyleBottom,   6) :
			cBRT >  25 ? tintColor(col.transportStyleBottom,   4) :
			cBRT >   0 ? tintColor(col.transportStyleBottom,   4) : '';

		col.progressBar =
			cBRT < 25 ? bevel ? tintColor(col.primary, cBRT < 10 ? blend2 ? 15 : 10 : 5) : shadeColor(col.primary, 30) :
			cBRT < 50 ? RGB(0, 0, 0) : g_pl_colors.bg;

		col.styleProgressBar =
			cBRT > 200 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
			cBRT > 175 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
			cBRT > 150 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 45 : 65) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 40 : 60) : '' :
			cBRT > 125 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 35 : 55) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 30 : 50) : '' :
			cBRT > 100 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 25 : 40) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 20 : 40) : '' :
			cBRT >  75 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 15 : 25) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 15 : 20) : '' :
			cBRT >  50 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 10 : 15) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 10 : 15) : '' :
			cBRT <  50 ? progBar === 'bevel' ? RGBA(255, 255, 255, bevel ? 10 : 10) : progBar === 'inner' ? RGBA(255, 255, 255, bevel ? 10 : 10) : '' :
			col.styleProgressBar;

		col.progressBarFill =
			cBRT > 200 ? bevel ? tintColor(col.progressBarFill, 10) : shadeColor(col.progressBarFill, 15) :
			cBRT > 175 ? bevel ? tintColor(col.progressBarFill,  5) : shadeColor(col.progressBarFill, blend ? 5 : 15) :
			cBRT > 150 ? bevel ? tintColor(col.progressBarFill, 10) : shadeColor(col.progressBarFill, 20) :
			cBRT > 125 ? bevel ? tintColor(col.progressBarFill, 10) : shadeColor(col.progressBarFill, 20) :
			cBRT > 100 ? bevel ? tintColor(col.progressBarFill, 15) : shadeColor(col.progressBarFill, 30) :
			cBRT >  75 ? tintColor(col.progressBarFill, 30) :
			cBRT >  50 ? tintColor(col.progressBarFill, 30) :
			cBRT >  25 ? tintColor(col.primary, 25) :
			cBRT >   0 ? tintColor(col.primary, 25) : '';

		col.styleProgressBarFill =
			cBRT > 200 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
			cBRT > 175 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
			cBRT > 150 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  80 :  60) : '' :
			cBRT > 125 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ?  90 :  70) : '' :
			cBRT > 100 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 100 :  85) : '' :
			cBRT >  75 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 100 :  90) : '' :
			cBRT >  50 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 110 : 100) : '' :
			cBRT >  25 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 130 : 120) : '' :
			cBRT >   0 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 130 : 120) : '' : '';

		col.shadow =
			cBRT > 200 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 175 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 150 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 125 ? RGBA(0, 0, 0, alt ?  50 : 40) :
			cBRT > 100 ? RGBA(0, 0, 0, alt ?  60 : 45) :
			cBRT >  75 ? RGBA(0, 0, 0, alt ?  75 : 50) :
			cBRT >  50 ? RGBA(0, 0, 0, alt ? 100 : 55) :
			cBRT >  25 ? RGBA(0, 0, 0, alt ? 120 : 70) :
			cBRT >   0 ? RGBA(0, 0, 0, alt ? 140 : 90) : '';
	}

	///////////////////////////////////////////////////////
	// * REBORN/RANDOM/STYLE REBORN WHITE/BLACK/FUSION * //
	///////////////////////////////////////////////////////
	// * Dynamically adjust background colors, lines, transport buttons, progress/volume bar, gradient and shadow
	if ((pref.theme === 'reborn' || pref.theme === 'random') && fb.IsPlaying && !isStreaming && !isPlayingCD && !noAlbumArtStub) {
		const primary = pref.styleRebornFusion2 ? col.primary_alt : col.primary;
		const primary_alt = pref.styleRebornFusion ? col.primary_alt : col.primary;

		// * PLAYLIST COLORS * //
		g_pl_colors.header_nowplaying_bg =
			cBRT > 200 ? blend ? RGBtoRGBA(tintColor(primary, 20), 130) : tintColor(primary, 20) :
			cBRT > 175 ? blend ? RGBtoRGBA(tintColor(primary, 12), 130) : tintColor(primary, 12) :
			cBRT > 150 ? blend ? RGBtoRGBA(tintColor(primary, 12), 130) : tintColor(primary, 12) :
			cBRT > 125 ? blend ? RGBtoRGBA(tintColor(primary, 10), 130) : tintColor(primary, 10) :
			cBRT > 100 ? blend ? RGBtoRGBA(tintColor(primary, 10), 130) : tintColor(primary, 10) :
			cBRT >  75 ? blend ? RGBtoRGBA(tintColor(primary,  8), 130) : tintColor(primary,  8) :
			cBRT >  50 ? blend ? RGBtoRGBA(tintColor(primary,  6), 130) : tintColor(primary,  6) :
			cBRT >  25 ? blend ? RGBtoRGBA(tintColor(primary,  6), 130) : tintColor(primary,  6) :
			cBRT >   0 ? cBRT < 10 ? tintColor(primary, blend || blend2 ? 15 : 10) :
									 tintColor(primary, blend || blend2 ? 15 :  5) : '';

		g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;

		g_pl_colors.header_line_normal =
			cBRT > 200 ? shadeColor(primary, 16) :
			cBRT > 175 ? shadeColor(primary, 18) :
			cBRT > 150 ? shadeColor(primary, 20) :
			cBRT > 125 ? shadeColor(primary, 22) :
			cBRT > 100 ? shadeColor(primary, 24) :
			cBRT >  75 ? shadeColor(primary, 26) :
			cBRT >  50 ? shadeColor(primary, 28) :
			cBRT >  25 ? shadeColor(primary, 30) :
			cBRT >   0 ? shadeColor(primary, 20) : '';

		g_pl_colors.header_line_playing =
			cBRT > 200 ? shadeColor(primary, 26) :
			cBRT > 175 ? shadeColor(primary, 28) :
			cBRT > 150 ? shadeColor(primary, 30) :
			cBRT > 125 ? shadeColor(primary, 32) :
			cBRT > 100 ? shadeColor(primary, 34) :
			cBRT >  75 ? shadeColor(primary, 36) :
			cBRT >  50 ? shadeColor(primary, 38) :
			cBRT >  25 ? shadeColor(primary, 40) :
			cBRT >   0 ? shadeColor(primary, 30) : '';

		g_pl_colors.row_selection_frame = g_pl_colors.header_line_normal;
		g_pl_colors.row_disc_subheader_line = g_pl_colors.header_line_normal;

		// * LIBRARY COLORS * //
		ui.col.selectionFrame = g_pl_colors.header_line_normal;
		ui.col.line           = g_pl_colors.header_line_playing;

		// * MAIN COLORS * //
		col.styleGradient =
			cBRT > 200 ? shadeColor(primary, pref.styleRebornBlack ? 65 : 25) :
			cBRT > 175 ? shadeColor(primary, pref.styleRebornBlack ? 60 : 30) :
			cBRT > 150 ? shadeColor(primary, pref.styleRebornBlack ? 55 : 35) :
			cBRT > 125 ? shadeColor(primary, pref.styleRebornBlack ? 50 : 40) :
			cBRT > 100 ? shadeColor(primary, pref.styleRebornBlack ? 45 : 45) :
			cBRT >  75 ? shadeColor(primary, pref.styleRebornBlack ? 40 : 50) :
			cBRT >  50 ? shadeColor(primary, pref.styleRebornBlack ? 35 : 55) :
			cBRT >  25 ? shadeColor(primary, pref.styleRebornBlack ? 30 : 60) :
			cBRT >   0 ? pref.styleRebornBlack ? tintColor(primary, 10) : shadeColor(primary, 25) : '';

		col.styleGradient2 = col.styleGradient;

		if (!pref.styleRebornWhite && !pref.styleRebornBlack && !pref.styleRebornFusion) {
			col.bg =
				cBRT < 10 ? tintColor(primary_alt, blend || blend2 ? 15 : 10) :
				cBRT < 25 ? tintColor(primary_alt, blend || blend2 ? 15 :  5) :
				col.bg;

			col.progressBar =
				cBRT > 200 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 20 : 10) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT > 175 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 25 : 10) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT > 150 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 25 : 10) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT > 125 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 30 : 15) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT > 100 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 30 : 15) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT >  75 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 35 : 20) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT >  50 ? blend || blend2 ? shadeColor(primary_alt, bevel ? 45 : 25) : shadeColor(primary_alt, bevel ? 30 : 15) :
				cBRT >  25 ? blend || blend2 ? shadeColor(primary_alt, bevel ?  0 :  0) : shadeColor(primary_alt, bevel ? 40 : 15) :
				cBRT >   0 ? blend || blend2 ? shadeColor(primary_alt, bevel ?  0 :  0) : shadeColor(primary_alt, bevel ? 40 : 10) : '';
		}

		col.progressBarFill =
			cBRT < 175 > 125 ? progBarFillBevelInner ? tintColor(col.progressBarFill, 10) : col.progressBarFill :
			col.progressBarFill;

		col.styleProgressBarFill =
			cBRT > 200 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 25 : 20) : '' :
			cBRT > 175 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 30 : 25) : '' :
			cBRT > 150 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 35 : 30) : '' :
			cBRT > 125 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 45 : 40) : '' :
			cBRT > 100 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 50 : 45) : '' :
			cBRT >  75 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 55 : 50) : '' :
			cBRT >  50 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 65 : 60) : '' :
			cBRT >  25 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 75 : 70) : '' :
			cBRT >   0 ? progBarFillBevelInner ? RGBA(0, 0, 0, bevel ? 85 : 80) : '' :  '';

		if (!pref.styleRebornWhite && !pref.styleRebornBlack) {
			col.styleProgressBarLineTop =
				cBRT > 200 ? RGBA(0, 0, 0, bevel ? 15 : 10) :
				cBRT > 175 ? RGBA(0, 0, 0, bevel ? 20 : 15) :
				cBRT > 150 ? RGBA(0, 0, 0, bevel ? 30 : 25) :
				cBRT > 125 ? RGBA(0, 0, 0, bevel ? 35 : 30) :
				cBRT > 100 ? RGBA(0, 0, 0, bevel ? 40 : 35) :
				cBRT >  75 ? RGBA(0, 0, 0, bevel ? 45 : 40) :
				cBRT >  50 ? RGBA(0, 0, 0, bevel ? 50 : 45) :
				cBRT >  25 ? RGBA(0, 0, 0, bevel ? 55 : 50) :
				cBRT >   0 ? RGBA(0, 0, 0, bevel ? 65 : 60) : '';

			col.styleProgressBarLineBottom =
				cBRT > 200 ? RGBA(255, 255, 255, bevel ? 45 : 50) :
				cBRT > 175 ? RGBA(255, 255, 255, bevel ? 40 : 45) :
				cBRT > 150 ? RGBA(255, 255, 255, bevel ? 35 : 40) :
				cBRT > 125 ? RGBA(255, 255, 255, bevel ? 30 : 35) :
				cBRT > 100 ? RGBA(255, 255, 255, bevel ? 25 : 30) :
				cBRT >  75 ? RGBA(255, 255, 255, bevel ? 20 : 25) :
				cBRT >  50 ? RGBA(255, 255, 255, bevel ? 15 : 20) :
				cBRT >  25 ? RGBA(255, 255, 255, bevel ? 10 : 15) :
				cBRT >   0 ? RGBA(255, 255, 255, bevel ?  5 : 10) : '';
		}

		col.shadow =
			cBRT > 200 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 175 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 150 ? RGBA(0, 0, 0, alt ?  45 : 35) :
			cBRT > 125 ? RGBA(0, 0, 0, alt ?  50 : 40) :
			cBRT > 100 ? RGBA(0, 0, 0, alt ?  60 : 45) :
			cBRT >  75 ? RGBA(0, 0, 0, alt ?  75 : 50) :
			cBRT >  50 ? RGBA(0, 0, 0, alt ? 100 : 55) :
			cBRT >  25 ? RGBA(0, 0, 0, alt ? 120 : 70) :
			cBRT >   0 ? RGBA(0, 0, 0, alt ? 140 : 90) : '';


		// * REBORN/RANDOM THEME/STYLE REBORN WHITE/REBORN BLACK - Adjust colors primary color is almost pure white
		const defaultRebornRandom = cBRT > 210 && (!blend && !blend2) && !pref.styleRebornWhite && !pref.styleRebornBlack && !pref.styleRandomDark;
		const rebornWhiteBlack = cBRT > 210 && (pref.styleRebornWhite || pref.styleRebornBlack);

		if (defaultRebornRandom || rebornWhiteBlack) {
			// * PLAYLIST COLORS * //
			g_pl_colors.bg = RGB(255, 255, 255);
			g_pl_colors.plman_bg = g_pl_colors.bg;
			g_pl_colors.plman_text_normal = g_pl_colors.bg;

			g_pl_colors.header_nowplaying_bg =
				defaultRebornRandom ? blend && iBRT > 240 ? col.lightAccent_7 : blend2 && iBRT > 240 ? col.lightAccent_35 : RGB(245, 245, 245) :
				rebornWhiteBlack ? blend ? RGBtoRGBA(col.lightAccent, 130) : RGB(245, 245, 245) :
				g_pl_colors.header_nowplaying_bg;

			g_pl_colors.header_sideMarker = RGB(90, 90, 90);
			g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
			g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
			g_pl_colors.row_selection_frame = RGB(220, 220, 220);

			// * LIBRARY COLORS * //
			ui.col.bg = g_pl_colors.bg;
			ui.col.bgSel = g_pl_colors.header_nowplaying_bg;
			ui.col.nowPlayingBg = g_pl_colors.header_nowplaying_bg;
			ui.col.sideMarker = g_pl_colors.header_sideMarker;
			ui.col.selectionFrame = g_pl_colors.row_selection_frame;

			// * BIOGRAPHY COLORS * //
			uiBio.col.bg = g_pl_colors.bg;

			// * MAIN COLORS * //
			col.bg = pref.styleRebornBlack ? RGB(0, 0, 0) : bevel ? RGB(255, 255, 255) : RGB(245, 245, 245);
			col.detailsBg = g_pl_colors.bg;

			if (pref.styleBlackReborn || pref.styleRebornWhite || pref.styleRebornBlack) {
				col.transportEllipseBg = col.lightAccent_100;
				col.transportEllipseNormal = shadeColor(col.lightAccent_7, 10);
			}

			if (!pref.styleRebornBlack) {
				// * PROGRESS BAR COLORS * //
				col.progressBar = pref.styleRebornWhite ? col.lightAccent_7 : bevel ? tintColor(col.primary, 15) : col.lightAccent;
				col.progressBarFill = RGB(90, 90, 90);

				// * VOLUME BAR COLORS * //
				col.volumeBar = g_pl_colors.bg;
				col.volumeBarFill = RGB(90, 90, 90);
			}

			if (pref.styleRebornBlack) {
				// * STYLE COLORS * //
				col.styleGradient = col.darkAccent_75;
				col.styleGradient2 = col.darkAccent_75;
			}
		}

		// * REBORN/RANDOM THEME - Adjust colors when using style blend and album art is almost pure white
		if (iBRT > 210 && (blend || blend2) && !pref.styleRebornWhite && !pref.styleRebornBlack && !pref.styleRandomDark) {
			col.primary = tintColor(col.primary, 15);

			// * PLAYLIST COLORS * //
			g_pl_colors.header_nowplaying_bg =
				blend  && iBRT > 240 ? col.lightAccent_7 :
				blend2 && iBRT > 240 ? col.lightAccent_35 :
				RGBtoRGBA(col.lightAccent_50, 130);

			g_pl_colors.header_sideMarker = cBRT < 150 ? col.lightAccent_80 : col.lightAccent_100;
			g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
			g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;

			// * LIBRARY COLORS * //
			ui.col.sideMarker = cBRT < 150 ? col.lightAccent_80 : col.lightAccent_100;

			// * MAIN COLORS * //
			col.transportEllipseNormal = cBRT < 150 ? col.transportEllipseNormal : shadeColor(col.lightAccent_7, 10);
			col.transportEllipseBg     = cBRT < 150 ? col.lightAccent_80 : col.lightAccent_100;
			col.progressBar            = cBRT < 150 ? col.lightAccent_7 : blend2 && iBRT > 240 ? col.lightAccent_35 : shadeColor(col.lightAccent_7, 5);
			col.progressBarFill        = cBRT < 150 ? col.lightAccent_80 : col.lightAccent_100;
		}
	}
}


//////////////////////////
// * THEME BRIGHTNESS * //
//////////////////////////
/** Lightens or darkens the theme based on pref.themeBrightness value */
function adjustThemeBrightness(percent) {
	if (percent < 0) percent = Math.abs(percent); // Negative passed values need to be converted to positives

	if (pref.themeBrightness < 0) { // * Darken
		// * PLAYLIST COLORS * //
		g_pl_colors.bg = shadeColor(g_pl_colors.bg, percent);
		g_pl_colors.plman_bg = shadeColor(g_pl_colors.plman_bg, percent);
		g_pl_colors.plman_text_normal = shadeColor(g_pl_colors.plman_text_normal, percent);
		g_pl_colors.header_nowplaying_bg = shadeColor(g_pl_colors.header_nowplaying_bg, percent);
		g_pl_colors.header_sideMarker = shadeColor(g_pl_colors.header_sideMarker, percent);
		g_pl_colors.header_line_normal = shadeColor(g_pl_colors.header_line_normal, percent);
		g_pl_colors.header_line_playing = shadeColor(g_pl_colors.header_line_playing, percent);
		g_pl_colors.row_nowplaying_bg = shadeColor(g_pl_colors.row_nowplaying_bg, percent);
		g_pl_colors.row_stripes_bg = shadeColor(g_pl_colors.row_stripes_bg, percent);
		g_pl_colors.row_selection_bg = shadeColor(g_pl_colors.row_selection_bg, percent);
		g_pl_colors.row_selection_frame = shadeColor(g_pl_colors.row_selection_frame, percent);
		g_pl_colors.row_sideMarker = shadeColor(g_pl_colors.row_sideMarker, percent);
		g_pl_colors.row_disc_subheader_line = shadeColor(g_pl_colors.row_disc_subheader_line, percent);
		g_pl_colors.sbar_btn_normal = shadeColor(g_pl_colors.sbar_btn_normal, percent);
		g_pl_colors.sbar_btn_hovered = shadeColor(g_pl_colors.sbar_btn_hovered, percent);
		g_pl_colors.sbar_thumb_normal = shadeColor(g_pl_colors.sbar_thumb_normal, percent);
		g_pl_colors.sbar_thumb_hovered = shadeColor(g_pl_colors.sbar_thumb_hovered, percent);
		g_pl_colors.sbar_thumb_drag = shadeColor(g_pl_colors.sbar_thumb_drag, percent);

		// * LIBRARY COLORS * //
		ui.col.bg = g_pl_colors.bg;
		ui.col.line = shadeColor(ui.col.line, percent);
		ui.col.s_line = shadeColor(ui.col.s_line, percent);
		ui.col.nowPlayingBg = shadeColor(ui.col.nowPlayingBg, percent - 5);
		ui.col.sideMarker = shadeColor(ui.col.sideMarker, percent);
		ui.col.sideMarker_nobw = shadeColor(ui.col.sideMarker_nobw, percent);
		ui.col.selectionFrame = shadeColor(ui.col.selectionFrame, percent - 10);
		ui.col.sbarBtns = shadeColor(ui.col.sbarBtns, percent - 10);
		ui.col.sbarNormal = shadeColor(ui.col.sbarNormal, percent - 10);
		ui.col.sbarHovered = shadeColor(ui.col.sbarHovered, percent - 10);
		ui.col.sbarDrag = shadeColor(ui.col.sbarDrag, percent - 10);

		// * BIOGRAPHY COLORS * //
		uiBio.col.bg = g_pl_colors.bg;
		uiBio.col.bottomLine = g_pl_colors.header_line_normal;
		uiBio.col.centerLine = g_pl_colors.header_line_normal;
		uiBio.col.sbarBtns = shadeColor(uiBio.col.sbarBtns, percent - 10);
		uiBio.col.sbarNormal = shadeColor(uiBio.col.sbarNormal, percent - 10);
		uiBio.col.sbarHovered = shadeColor(uiBio.col.sbarHovered, percent - 10);
		uiBio.col.sbarDrag = shadeColor(uiBio.col.sbarDrag, percent - 10);

		// * MAIN COLORS * //
		col.bg = shadeColor(col.bg, percent);
		col.uiHacksFrame = shadeColor(col.uiHacksFrame, percent);
		col.shadow = shadeColor(col.shadow, percent);
		col.detailsBg = shadeColor(col.detailsBg, percent);
		col.timelineAdded = shadeColor(col.timelineAdded, percent);
		col.timelinePlayed = shadeColor(col.timelinePlayed, percent);
		col.timelineUnplayed = shadeColor(col.timelineUnplayed, percent);
		col.timelineFrame = shadeColor(col.timelineFrame, percent);
		col.popupBg = shadeColor(col.popupBg, percent);

		// * TOP MENU BUTTON COLORS * //
		col.menuBgColor = shadeColor(col.menuBgColor, percent);
		col.menuStyleBg = shadeColor(col.menuStyleBg, percent);
		col.menuRectStyleEmbossTop = shadeColor(col.menuRectStyleEmbossTop, percent);
		col.menuRectStyleEmbossBottom = shadeColor(col.menuRectStyleEmbossBottom, percent);
		col.menuRectNormal = shadeColor(col.menuRectNormal, percent);
		col.menuRectHovered = shadeColor(col.menuRectHovered, percent);
		col.menuRectDown = col.menuRectHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		col.transportEllipseBg = shadeColor(col.transportEllipseBg, percent);
		col.transportEllipseNormal = shadeColor(col.transportEllipseNormal, percent);
		col.transportEllipseHovered = shadeColor(col.transportEllipseHovered, percent);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportStyleBg = shadeColor(col.transportStyleBg, percent);
		col.transportStyleTop = shadeColor(col.transportStyleTop, percent);
		col.transportStyleBottom = shadeColor(col.transportStyleBottom, percent);

		// * PROGRESS BAR COLORS * //
		col.progressBar = shadeColor(col.progressBar, percent);
		col.progressBarStreaming = shadeColor(col.progressBarStreaming, percent);
		col.progressBarFrame = shadeColor(col.progressBarFrame, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) col.progressBarFill = shadeColor(col.progressBarFill, percent - 3);

		// * PEAKMETER BAR COLORS * //
		col.peakmeterBarProg = shadeColor(col.peakmeterBarProg, percent);
		col.peakmeterBarProgFill = shadeColor(col.peakmeterBarProgFill, percent);
		col.peakmeterBarFillTop = shadeColor(col.peakmeterBarFillTop, percent);
		col.peakmeterBarFillMiddle = shadeColor(col.peakmeterBarFillMiddle, percent);
		col.peakmeterBarFillBack = shadeColor(col.peakmeterBarFillBack, percent);
		col.peakmeterBarVertProgFill = shadeColor(col.peakmeterBarVertProgFill, percent);
		col.peakmeterBarVertFill = shadeColor(col.peakmeterBarVertFill, percent);
		col.peakmeterBarVertFillPeaks = shadeColor(col.peakmeterBarVertFillPeaks, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
			col.peakmeterBarProg = shadeColor(col.peakmeterBarProg, percent - 3);
			col.peakmeterBarProgFill = shadeColor(col.peakmeterBarProgFill, percent - 3);
			col.peakmeterBarFillTop = shadeColor(col.peakmeterBarFillTop, percent - 3);
			col.peakmeterBarFillMiddle = shadeColor(col.peakmeterBarFillMiddle, percent - 3);
			col.peakmeterBarFillBack = shadeColor(col.peakmeterBarFillBack, percent - 3);
			col.peakmeterBarVertProgFill = shadeColor(col.peakmeterBarVertProgFill, percent - 3);
			col.peakmeterBarVertFill = shadeColor(col.peakmeterBarVertFill, percent - 3);
			col.peakmeterBarVertFillPeaks = shadeColor(col.peakmeterBarVertFillPeaks, percent - 3);
		}

		// * WAVEFORM BAR COLORS * //
		col.waveformBarFillFront = shadeColor(col.waveformBarFillFront, percent);
		col.waveformBarFillBack  = shadeColor(col.waveformBarFillBack, percent);
		col.waveformBarFillPreFront = shadeColor(col.waveformBarFillPreFront, percent);
		col.waveformBarFillPreBack = shadeColor(col.waveformBarFillPreBack, percent);
		col.waveformBarIndicator = shadeColor(col.waveformBarIndicator, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
			col.waveformBarFillFront = shadeColor(col.waveformBarFillFront, percent - 3);
			col.waveformBarFillBack  = shadeColor(col.waveformBarFillBack,  percent - 3);
			col.waveformBarFillPreFront = shadeColor(col.waveformBarFillPreFront, percent - 3);
			col.waveformBarFillPreBack = shadeColor(col.waveformBarFillPreBack, percent - 3);
			col.waveformBarIndicator = shadeColor(col.waveformBarIndicator, percent - 3);
		}

		// * VOLUME BAR COLORS * //
		col.volumeBar = shadeColor(col.volumeBar, percent);
		col.volumeBarFrame = shadeColor(col.volumeBarFrame, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) col.volumeBarFill = shadeColor(col.volumeBarFill, percent - 3);

		// * STYLE COLORS * //
		col.styleProgressBar = shadeColor(col.styleProgressBar, percent);
		col.styleProgressBarLineTop = shadeColor(col.styleProgressBarLineTop, percent);
		col.styleProgressBarLineBottom = shadeColor(col.styleProgressBarLineBottom, percent);
		col.styleVolumeBar = shadeColor(col.styleVolumeBar, percent);
	}
	else if (pref.themeBrightness > 0) { // * Lighten
		// * PLAYLIST COLORS * //
		g_pl_colors.bg = tintColor(g_pl_colors.bg, percent);
		g_pl_colors.plman_bg = tintColor(g_pl_colors.plman_bg, percent);
		g_pl_colors.plman_text_normal = tintColor(g_pl_colors.plman_text_normal, percent);
		g_pl_colors.header_nowplaying_bg = tintColor(g_pl_colors.header_nowplaying_bg, percent);
		g_pl_colors.header_sideMarker = tintColor(g_pl_colors.header_sideMarker, percent);
		g_pl_colors.header_line_normal = tintColor(g_pl_colors.header_line_normal, percent);
		g_pl_colors.header_line_playing = tintColor(g_pl_colors.header_line_playing, percent);
		g_pl_colors.row_nowplaying_bg = tintColor(g_pl_colors.row_nowplaying_bg, percent);
		g_pl_colors.row_stripes_bg = tintColor(g_pl_colors.row_stripes_bg, percent);
		g_pl_colors.row_selection_bg = tintColor(g_pl_colors.row_selection_bg, percent);
		g_pl_colors.row_selection_frame = tintColor(g_pl_colors.row_selection_frame, percent);
		g_pl_colors.row_sideMarker = tintColor(g_pl_colors.row_sideMarker, percent);
		g_pl_colors.row_disc_subheader_line = tintColor(g_pl_colors.row_disc_subheader_line, percent);
		g_pl_colors.sbar_btn_normal = tintColor(g_pl_colors.sbar_btn_normal, percent);
		g_pl_colors.sbar_btn_hovered = tintColor(g_pl_colors.sbar_btn_hovered, percent);
		g_pl_colors.sbar_thumb_normal = tintColor(g_pl_colors.sbar_thumb_normal, percent);
		g_pl_colors.sbar_thumb_hovered = tintColor(g_pl_colors.sbar_thumb_hovered, percent);
		g_pl_colors.sbar_thumb_drag = tintColor(g_pl_colors.sbar_thumb_drag, percent);

		// * LIBRARY COLORS * //
		ui.col.bg = g_pl_colors.bg;
		ui.col.line = tintColor(ui.col.line, percent);
		ui.col.s_line = tintColor(ui.col.s_line, percent);
		ui.col.nowPlayingBg = tintColor(ui.col.nowPlayingBg, percent - 3);
		ui.col.sideMarker = tintColor(ui.col.sideMarker, percent);
		ui.col.sideMarker_nobw = tintColor(ui.col.sideMarker_nobw, percent);
		ui.col.selectionFrame = tintColor(ui.col.selectionFrame, percent);
		ui.col.sbarBtns = tintColor(ui.col.sbarBtns, percent - 5);
		ui.col.sbarNormal = tintColor(ui.col.sbarNormal, percent - 5);
		ui.col.sbarHovered = tintColor(ui.col.sbarHovered, percent - 5);
		ui.col.sbarDrag = tintColor(ui.col.sbarDrag, percent - 5);

		// * BIOGRAPHY COLORS * //
		uiBio.col.bg = g_pl_colors.bg;
		uiBio.col.bottomLine = g_pl_colors.header_line_normal;
		uiBio.col.centerLine = g_pl_colors.header_line_normal;
		uiBio.col.sbarBtns = tintColor(uiBio.col.sbarBtns, percent - 5);
		uiBio.col.sbarNormal = tintColor(uiBio.col.sbarNormal, percent - 5);
		uiBio.col.sbarHovered = tintColor(uiBio.col.sbarHovered, percent - 5);
		uiBio.col.sbarDrag = tintColor(uiBio.col.sbarDrag, percent - 5);

		// * MAIN COLORS * //
		col.bg = tintColor(col.bg, percent);
		col.uiHacksFrame = tintColor(col.uiHacksFrame, percent);
		col.shadow = tintColor(col.shadow, percent);
		col.detailsBg = tintColor(col.detailsBg, percent);
		col.timelineAdded = tintColor(col.timelineAdded, percent);
		col.timelinePlayed = tintColor(col.timelinePlayed, percent);
		col.timelineUnplayed = tintColor(col.timelineUnplayed, percent);
		col.timelineFrame = tintColor(col.timelineFrame, percent);
		col.popupBg = tintColor(col.popupBg, percent);

		// * TOP MENU BUTTON COLORS * //
		col.menuBgColor = tintColor(col.menuBgColor, percent);
		col.menuStyleBg = tintColor(col.menuStyleBg, percent);
		col.menuRectStyleEmbossTop = tintColor(col.menuRectStyleEmbossTop, percent);
		col.menuRectStyleEmbossBottom = tintColor(col.menuRectStyleEmbossBottom, percent);
		col.menuRectNormal = tintColor(col.menuRectNormal, percent);
		col.menuRectHovered = tintColor(col.menuRectHovered, percent);
		col.menuRectDown = col.menuRectHovered;

		// * LOWER BAR TRANSPORT BUTTON COLORS * //
		col.transportEllipseBg = tintColor(col.transportEllipseBg, percent);
		col.transportEllipseNormal = tintColor(col.transportEllipseNormal, percent);
		col.transportEllipseHovered = tintColor(col.transportEllipseHovered, percent);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportStyleBg = tintColor(col.transportStyleBg, percent);
		col.transportStyleTop = tintColor(col.transportStyleTop, percent);
		col.transportStyleBottom = tintColor(col.transportStyleBottom, percent);

		// * PROGRESS BAR COLORS * //
		col.progressBar = tintColor(col.progressBar, percent);
		col.progressBarStreaming = tintColor(col.progressBarStreaming, percent);
		col.progressBarFrame = tintColor(col.progressBarFrame, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) col.progressBarFill = tintColor(col.progressBarFill, percent - 3);

		// * PEAKMETER BAR COLORS * //
		col.peakmeterBarProg = tintColor(col.peakmeterBarProg, percent);
		col.peakmeterBarProgFill = tintColor(col.peakmeterBarProgFill, percent);
		col.peakmeterBarFillTop = tintColor(col.peakmeterBarFillTop, percent);
		col.peakmeterBarFillMiddle = tintColor(col.peakmeterBarFillMiddle, percent);
		col.peakmeterBarFillBack = tintColor(col.peakmeterBarFillBack, percent);
		col.peakmeterBarVertProgFill  = tintColor(col.peakmeterBarVertProgFill, percent);
		col.peakmeterBarVertFill = tintColor(col.peakmeterBarVertFill, percent);
		col.peakmeterBarVertFillPeaks = tintColor(col.peakmeterBarVertFillPeaks, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
			col.peakmeterBarProg = tintColor(col.peakmeterBarProg, percent - 3);
			col.peakmeterBarProgFill = tintColor(col.peakmeterBarProgFill, percent - 3);
			col.peakmeterBarFillTop = tintColor(col.peakmeterBarFillTop, percent - 3);
			col.peakmeterBarFillMiddle = tintColor(col.peakmeterBarFillMiddle, percent - 3);
			col.peakmeterBarFillBack = tintColor(col.peakmeterBarFillBack, percent - 3);
			col.peakmeterBarVertProgFill  = tintColor(col.peakmeterBarVertProgFill, percent - 3);
			col.peakmeterBarVertFill = tintColor(col.peakmeterBarVertFill, percent - 3);
			col.peakmeterBarVertFillPeaks = tintColor(col.peakmeterBarVertFillPeaks, percent - 3);
		}

		// * WAVEFORM BAR COLORS * //
		col.waveformBarFillFront = tintColor(col.waveformBarFillFront, percent);
		col.waveformBarFillBack  = tintColor(col.waveformBarFillBack, percent);
		col.waveformBarFillPreFront = tintColor(col.waveformBarFillPreFront, percent);
		col.waveformBarFillPreBack = tintColor(col.waveformBarFillPreBack, percent);
		col.waveformBarIndicator = tintColor(col.waveformBarIndicator, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
			col.waveformBarFillFront = tintColor(col.waveformBarFillFront, percent - 3);
			col.waveformBarFillBack = tintColor(col.waveformBarFillBack,  percent - 3);
			col.waveformBarFillPreFront = tintColor(col.waveformBarFillPreFront, percent - 3);
			col.waveformBarFillPreBack = tintColor(col.waveformBarFillPreBack, percent - 3);
			col.waveformBarIndicator = tintColor(col.waveformBarIndicator, percent - 3);
		}

		// * VOLUME BAR COLORS * //
		col.volumeBar = tintColor(col.volumeBar, percent);
		col.volumeBarFrame = tintColor(col.volumeBarFrame, percent);
		if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) col.volumeBarFill = tintColor(col.volumeBarFill, percent - 3);

		// * STYLE COLORS * //
		col.styleProgressBar = tintColor(col.styleProgressBar, percent);
		col.styleProgressBarLineTop = tintColor(col.styleProgressBarLineTop, percent);
		col.styleProgressBarLineBottom = tintColor(col.styleProgressBarLineBottom, percent);
		col.styleVolumeBar = tintColor(col.styleVolumeBar, percent);
	}
}


///////////////////////////
// * STYLE ALTERNATIVE * //
///////////////////////////
function styleAlternativeColors() {
	// * PLAYLIST * //
	g_pl_colors.bg =
		pref.theme === 'white' ? RGB(245, 245, 245) :
		pref.theme === 'black' ? tintColor(g_pl_colors.bg, 6) :
		pref.theme === 'reborn' || pref.theme === 'random' ? shadeColor(g_pl_colors.bg, 5) :
		pref.theme === 'blue' ? RGB(8, 110, 190) :
		pref.theme === 'darkblue' ? RGB(17, 35, 57) :
		pref.theme === 'red' ? RGB(106, 18, 18) :
		pref.theme === 'cream' ? RGB(255, 247, 240) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? tintColor(g_pl_colors.bg, 8) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? shadeColor(g_pl_colors.bg, 5) : '';

	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = g_pl_colors.bg;

	g_pl_colors.header_nowplaying_bg =
		pref.theme === 'blue' ? RGB(20, 120, 205) :
		pref.theme === 'darkblue' ? RGB(18, 42, 70) :
		pref.theme === 'red' ? RGB(130, 25, 25) :
		g_pl_colors.header_nowplaying_bg;

	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_selection_bg = g_pl_colors.row_nowplaying_bg;

	// * LIBRARY * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

	// * BIOGRAPHY * //
	uiBio.col.bg = g_pl_colors.bg;

	// * MAIN * //
	col.bg =
		pref.theme === 'white' ? RGB(255, 255, 255) :
		pref.theme === 'black' ? tintColor(col.bg, 4) :
		pref.theme === 'reborn' || pref.theme === 'random' ? tintColor(col.bg, 8) :
		pref.theme === 'blue' ? RGB(20, 120, 205) :
		pref.theme === 'darkblue' ? RGB(18, 42, 70) :
		pref.theme === 'red' ? RGB(130, 25, 25) :
		pref.theme === 'cream' ? RGB(255, 255, 255) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? RGB(30, 30, 30) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? tintColor(col.bg, 8) : '';

	col.uiHacksFrame = col.bg;

	col.shadow =
		pref.theme === 'reborn' || pref.theme === 'random' ? RGBA(0, 0, 0, 25) :
		pref.theme === 'blue' ? col.shadow + RGBA(0, 0, 0, 25) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? RGBA(0, 0, 0, 255) :
		col.shadow + RGBA(0, 0, 0, 10);

	col.detailsBg = g_pl_colors.bg;
	col.detailsText = col.lowerBarTitle;

	// * LOWER BAR TRANSPORT BUTTONS * //
	col.transportEllipseBg =
		pref.theme === 'white' ? tintColor(col.transportEllipseBg, 100) :
		pref.theme === 'black' ? tintColor(col.transportEllipseBg, 4) :
		pref.theme === 'reborn' || pref.theme === 'random' ? tintColor(col.transportEllipseBg, 0) :
		pref.theme === 'blue' ? tintColor(col.transportEllipseBg, 6) :
		pref.theme === 'darkblue' ? tintColor(col.transportEllipseBg, 0) :
		pref.theme === 'red' ? RGB(158, 30, 30) :
		pref.theme === 'cream' ? g_pl_colors.bg :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? shadeColor(col.transportEllipseBg, 20) :
		shadeColor(col.transportEllipseBg, 10);

	col.transportEllipseNormal =
		pref.theme === 'black' ? shadeColor(col.transportEllipseNormal, 6) :
		pref.theme === 'red' ? RGB(106, 18, 18) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? shadeColor(col.transportEllipseNormal, 90) :
		tintColor(col.transportEllipseNormal, 6);

	col.transportEllipseHovered = tintColor(col.transportEllipseHovered, 6);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.theme === 'black' ? tintColor(col.transportStyleBg, 4) :
		pref.theme === 'blue' ? tintColor(col.transportStyleBg, 6) :
		pref.theme === 'darkblue' ? tintColor(col.transportStyleBg, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleBg, 2) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? shadeColor(col.transportStyleBg, 6) :
		tintColor(col.transportStyleBg, 6);

	col.transportStyleTop =
		pref.theme === 'black' ? shadeColor(col.transportStyleTop, 6) :
		pref.theme === 'blue' ? shadeColor(col.transportStyleTop, 6) :
		pref.theme === 'darkblue' ? shadeColor(col.transportStyleTop, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleTop, pref.styleTransportButtons === 'emboss' ? 6 : 2) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? shadeColor(col.transportStyleTop, 6) :
		tintColor(col.transportStyleTop, 6);

	col.transportStyleBottom =
		pref.theme === 'black' ? shadeColor(col.transportStyleBottom, 0) :
		pref.theme === 'blue' ? shadeColor(col.transportStyleBottom, 6) :
		pref.theme === 'darkblue' ? shadeColor(col.transportStyleBottom, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleBottom, pref.styleTransportButtons === 'emboss' ? 6 : 2) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? shadeColor(col.transportStyleBottom, 6) :
		tintColor(col.transportStyleBottom, 6);

	// * PROGRESS BAR * //
	col.progressBar =
		pref.theme === 'white' ? pref.styleBevel ? tintColor(col.progressBar, 60) : tintColor(col.progressBar, 40) :
		pref.theme === 'black' ? tintColor(col.progressBar, 2) :
		pref.theme === 'reborn' || pref.theme === 'random' ? colBrightness < 25 ? tintColor(col.primary, 12) : fb.IsPlaying && !noAlbumArtStub ? g_pl_colors.bg : col.progressBar :
		pref.theme === 'blue' ? tintColor(col.progressBar, 2) :
		pref.theme === 'darkblue' ? tintColor(col.progressBar, 0) :
		pref.theme === 'red' ? RGB(158, 30, 30) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? pref.styleBevel ? shadeColor(col.progressBar, 60) : shadeColor(col.progressBar, 35) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? shadeColor(col.progressBar, 5) :
		g_pl_colors.bg;

	// * VOLUME BAR * //
	col.volumeBar = col.progressBar;
	col.volumeBarFill = col.progressBarFill;
}


/////////////////////////////
// * STYLE ALTERNATIVE 2 * //
/////////////////////////////
function styleAlternative2Colors() {
	// * PLAYLIST * //
	g_pl_colors.bg =
		pref.theme === 'white' ? tintColor(g_pl_colors.bg, 4) :
		pref.theme === 'black' ? tintColor(g_pl_colors.bg, 3) :
		pref.theme === 'reborn' || pref.theme === 'random' ? tintColor(g_pl_colors.bg, 5) :
		pref.theme === 'blue' ? RGB(20, 120, 205) :
		pref.theme === 'darkblue' ? RGB(18, 42, 70) :
		pref.theme === 'red' ? RGB(120, 22, 22) :
		pref.theme === 'cream' ? RGB(255, 255, 255) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? tintColor(g_pl_colors.bg, 6) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? tintColor(g_pl_colors.bg, 5) : '';

	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = g_pl_colors.bg;

	g_pl_colors.header_nowplaying_bg =
		pref.theme === 'black' && colBrightness < 25 ? tintColor(col.primary, 15) :
		pref.theme === 'reborn' || pref.theme === 'random' ? pref.styleBlend ? RGBtoRGBA(col.darkAccent, 60) : RGBtoRGBA(col.darkAccent, 40) :
		pref.theme === 'red' ? RGB(140, 25, 25) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? tintColor(g_pl_colors.header_nowplaying_bg, 6) :
		g_pl_colors.header_nowplaying_bg;

	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_selection_bg = g_pl_colors.row_nowplaying_bg;

	// * LIBRARY * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

	// * BIOGRAPHY * //
	uiBio.col.bg = g_pl_colors.bg;

	// * MAIN * //
	col.bg =
		pref.theme === 'white' ? shadeColor(col.bg, 6) :
		pref.theme === 'black' ? tintColor(col.bg, 10) :
		pref.theme === 'reborn' || pref.theme === 'random' ? shadeColor(col.bg, 8) :
		pref.theme === 'blue' ? RGB(8, 102, 180) :
		pref.theme === 'darkblue' ? RGB(17, 35, 57) :
		pref.theme === 'red' ? RGB(95, 15, 15) :
		pref.theme === 'cream' ? RGB(255, 247, 240) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? RGB(25, 25, 25) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? shadeColor(col.bg, 8) : '';

	col.uiHacksFrame = col.bg;

	col.shadow =
		pref.theme === 'black' ? col.shadow - RGBA(0, 0, 0, 80) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? col.shadow :
		col.shadow + RGBA(0, 0, 0, 5);

	col.detailsBg = g_pl_colors.bg;
	col.detailsText = col.lowerBarTitle;

	// * LOWER BAR TRANSPORT BUTTONS * //
	col.transportEllipseBg =
		pref.theme === 'white' ? tintColor(col.transportEllipseBg, 100) :
		pref.theme === 'black' ? shadeColor(col.transportEllipseBg, 6) :
		pref.theme === 'darkblue' ? tintColor(col.transportEllipseBg, 0) :
		pref.theme === 'red' ? RGB(140, 25, 25) :
		tintColor(col.transportEllipseBg, 6);

	col.transportEllipseNormal =
		pref.theme === 'black' ? shadeColor(col.transportEllipseNormal, 60) :
		tintColor(col.transportEllipseNormal, 6);

	col.transportEllipseHovered = tintColor(col.transportEllipseHovered, 6);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.theme === 'white' ? pref.styleBevel ? shadeColor(col.transportStyleBg, 10) : shadeColor(col.transportStyleBg, 7) :
		pref.theme === 'darkblue' ? tintColor(col.transportStyleBg, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleBg, 2) :
		pref.theme === 'cream' ? RGB(230, 230, 230) :
		tintColor(col.transportStyleBg, 6);

	col.transportStyleTop =
		pref.theme === 'white' ? shadeColor(col.transportStyleTop, 6) :
		pref.theme === 'blue' ? tintColor(col.transportStyleTop, 12) :
		pref.theme === 'darkblue' ? tintColor(col.transportStyleTop, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleTop, 2) :
		tintColor(col.transportStyleTop, 6);

	col.transportStyleBottom =
		pref.theme === 'white' ? shadeColor(col.transportStyleBottom, 6) :
		pref.theme === 'blue' ? shadeColor(col.transportStyleBottom, 10) :
		pref.theme === 'darkblue' ? tintColor(col.transportStyleBottom, 0) :
		pref.theme === 'red' ? tintColor(col.transportStyleBottom, 2) :
		tintColor(col.transportStyleBottom, 6);

	// * PROGRESS BAR * //
	col.progressBar =
		pref.theme === 'white' ? pref.styleBevel ? tintColor(col.progressBar, 60) : tintColor(col.progressBar, 100) :
		pref.theme === 'black' ? shadeColor(col.progressBar, 16) :
		pref.theme === 'reborn' || pref.theme === 'random' ? colBrightness < 25 ? tintColor(col.primary, 12) : g_pl_colors.bg :
		pref.theme === 'blue' ? g_pl_colors.bg :
		pref.theme === 'darkblue' ? g_pl_colors.row_nowplaying_bg :
		pref.theme === 'red' ? tintColor(col.progressBar, 0) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme) ? tintColor(col.progressBar, 3) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme) ? shadeColor(col.progressBar, 2) :
		g_pl_colors.bg;

	// * VOLUME BAR * //
	col.volumeBar = col.progressBar;
	col.volumeBarFill = col.progressBarFill;
}


///////////////////////////////
// * STYLE BLACK AND WHITE * //
///////////////////////////////
function styleBlackAndWhiteColors() {
	// * SETUP col.primary * //
	col.primary = RGB(255, 255, 255);

	// * PLAYLIST COLORS * //
	g_pl_colors.bg = RGB(20, 20, 20);
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(180, 180, 180);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(200, 200, 200) : RGB(240, 240, 240);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(240, 240, 240) : RGB(180, 180, 180);
	g_pl_colors.header_nowplaying_bg = pref.styleBlend ? RGBA(230, 230, 230, 200) : RGB(230, 230, 230);
	g_pl_colors.header_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255);
	g_pl_colors.header_artist_normal = RGB(220, 220, 220);
	g_pl_colors.header_artist_playing = RGB(25, 25, 25);
	g_pl_colors.header_album_normal = RGB(200, 200, 200);
	g_pl_colors.header_album_playing = RGB(25, 25, 25);
	g_pl_colors.header_info_normal = RGB(200, 200, 200);
	g_pl_colors.header_info_playing = RGB(25, 25, 25);
	g_pl_colors.header_date_normal = RGB(220, 220, 220);
	g_pl_colors.header_date_playing = RGB(25, 25, 25);
	g_pl_colors.header_line_normal = pref.styleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
	g_pl_colors.header_line_playing = RGB(25, 25, 25);
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
	g_pl_colors.row_selection_bg = pref.styleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
	g_pl_colors.row_selection_frame = g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(200, 200, 200);
	g_pl_colors.row_title_playing = RGB(25, 25, 25);
	g_pl_colors.row_title_selected = RGB(255, 255, 255);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = pref.styleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
	g_pl_colors.sbar_btn_normal = RGB(200, 200, 200);
	g_pl_colors.sbar_btn_hovered = RGB(255, 255, 255);
	g_pl_colors.sbar_thumb_normal = RGB(180, 180, 180);
	g_pl_colors.sbar_thumb_hovered = RGB(255, 255, 255);
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;

	// * LIBRARY COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.nowPlayingBg = pref.styleBlend ? RGBA(255, 255, 255, 200) : RGB(230, 230, 230);
	ui.col.sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255);
	ui.col.selectionFrame = pref.styleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;
	ui.col.iconPlus = RGB(220, 220, 220);
	ui.col.iconPlus_h = RGB(255, 255, 255);
	ui.col.iconPlus_sel = RGB(255, 255, 255);
	ui.col.iconPlusBg = RGB(45, 45, 45);
	ui.col.iconMinus_e = RGB(220, 220, 220);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(255, 255, 255);
	ui.col.text = RGB(200, 200, 200);
	ui.col.text_h = !ppt.albumArtShow || ppt.albumArtShow && ppt.highLightRow !== 2 ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.text_nowp = RGB(0, 0, 0);
	ui.col.textSel =
		ppt.albumArtShow && !['coversLabelsRight', 'coversLabelsBottom', 'coversLabelsBlend'].includes(pref.libraryDesign) ||
		pref.libraryDesign === 'traditional' ? RGB(0, 0, 0) : RGB(255, 255, 255);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(200, 200, 200);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(200, 200, 200);
	ui.col.searchBtn = RGB(255, 255, 255);
	ui.col.crossBtn = RGB(255, 255, 255);
	ui.col.filterBtn = RGB(220, 220, 220);
	ui.col.settingsBtn = RGB(220, 220, 220);
	ui.col.line = pref.styleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
	ui.col.s_line = ui.col.line;
	ui.col.sbarBtns = RGB(200, 200, 200);
	ui.col.sbarNormal = RGB(255, 255, 255);
	ui.col.sbarHovered = RGB(255, 255, 255);
	ui.col.sbarDrag = RGB(255, 255, 255);

	// * BIOGRAPHY COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.headingText = RGB(230, 230, 230);
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = g_pl_colors.row_title_normal;
	uiBio.col.sbarBtns = RGB(200, 200, 200);
	uiBio.col.sbarNormal = RGB(255, 255, 255);
	uiBio.col.sbarHovered = RGB(255, 255, 255);
	uiBio.col.sbarDrag = RGB(255, 255, 255);
	uiBio.col.noPhotoStubBg = RGB(25, 25, 25);
	uiBio.col.noPhotoStubText = pref.theme === 'cream' ? RGB(120, 170, 130) : g_pl_colors.header_artist_playing;

	// * MAIN COLORS * //
	col.bg = pref.styleBevel ? RGB(255, 255, 255) : RGB(230, 230, 230);
	col.noAlbumArtStub = RGB(255, 255, 255);
	col.lowerBarArtist = RGB(80, 80, 80);
	col.lowerBarTitle = RGB(80, 80, 80);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;

	// * DETAILS COLORS * //
	col.detailsBg = g_pl_colors.bg;
	col.detailsText = RGB(220, 220, 220);
	col.timelineAdded = isStreaming ? RGB(207, 0, 5) : RGB(230, 230, 230);
	col.timelinePlayed = isStreaming ? RGB(207, 0, 5) : RGB(180, 180, 180);
	col.timelineUnplayed = isStreaming ? RGB(207, 0, 5) : RGB(160, 160, 160);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor = RGB(255, 255, 255);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(210, 210, 210) :
		pref.styleTopMenuButtons === 'emboss' ? RGB(235, 235, 235) :
		pref.styleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220);

	col.menuRectStyleEmbossTop = RGB(255, 255, 255);
	col.menuRectStyleEmbossBottom = pref.styleBevel ? RGB(200, 200, 200) : RGB(195, 195, 195);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(200, 200, 200) : RGB(205, 205, 205) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = RGB(80, 80, 80);
	col.menuTextHovered = RGB(40, 40, 40);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel'  ? pref.styleBevel ? RGB(200, 200, 200) : RGB(205, 205, 205) :
		pref.styleTransportButtons === 'inner'  ? pref.styleBevel ? RGB(215, 215, 215) : RGB(205, 205, 205) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGB(230, 230, 230) : RGB(215, 215, 215) :
		RGB(225, 225, 225);

	col.transportStyleTop = RGB(255, 255, 255);

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ?
			pref.styleBlend || pref.styleBlend2 ? RGB(180, 180, 180) : pref.styleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
		pref.styleTransportButtons === 'emboss' ?
			pref.styleBlend || pref.styleBlend2 ? RGB(180, 180, 180) : pref.styleBevel ? RGB(215, 215, 215) : RGB(210, 210, 210) :
		RGB(230, 230, 230);

	// * PROGRESS BAR COLORS * //
	col.progressBar =
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(205, 205, 205) : RGB(215, 215, 215) :
		pref.styleBevel ? RGB(195, 195, 195) : RGB(210, 210, 210);

	col.progressBarFill = RGB(255, 255, 255);

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = RGB(20, 20, 20);
	col.peakmeterBarFillTop       = RGB(140, 140, 140);
	col.peakmeterBarFillMiddle    = RGB(20, 20, 20);
	col.peakmeterBarFillBack      = RGB(80, 80, 80);
	col.peakmeterBarVertProgFill  = RGB(20, 20, 20);
	col.peakmeterBarVertFill      = RGB(20, 20, 20);
	col.peakmeterBarVertFillPeaks = RGB(120, 120, 120);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = RGB(120, 120, 120);
	col.waveformBarFillBack     = RGB(20, 20, 20);
	col.waveformBarFillPreFront = RGB(160, 160, 160);
	col.waveformBarFillPreBack  = RGB(120, 120, 120);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(255, 255, 255);
	col.volumeBarFill = RGB(120, 120, 120);
	col.volumeBarFrame = RGB(210, 210, 210);

	// * STYLE COLORS * //
	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
		pref.styleProgressBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 40) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(0, 0, 0, 40) :
											pref.styleBevel ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(0, 0, 0, 50) :
											RGBA(0, 0, 0, 20) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 180) : RGBA(255, 255, 255, 255) :
											pref.styleBevel ? RGBA(255, 255, 255, 160) : RGBA(255, 255, 255, 220) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 150) : RGBA(255, 255, 255, 255) :
											pref.styleBevel ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 170) : '';

	col.styleProgressBarFill =
		pref.styleProgressBarFill === 'bevel' ? RGBA(0, 0, 0, pref.styleBevel ? 40 : 30) :
		pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, pref.styleBevel ? 50 : 40) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 30) :
		pref.styleVolumeBar === 'inner' ? RGBA(0, 0, 0, 30) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(255, 255, 255, 90) : '';
}


/////////////////////////////////
// * STYLE BLACK AND WHITE 2 * //
/////////////////////////////////
function styleBlackAndWhite2Colors() {
	// * SETUP col.primary * //
	col.primary = RGB(255, 255, 255);

	// * PLAYLIST COLORS * //
	g_pl_colors.bg = RGB(245, 245, 245);
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = pref.autoHidePlman ? g_pl_colors.bg : RGB(180, 180, 180);
	g_pl_colors.plman_text_hovered = pref.autoHidePlman ? RGB(100, 100, 100) : RGB(240, 240, 240);
	g_pl_colors.plman_text_pressed = pref.autoHidePlman ? RGB(100, 100, 100) : RGB(180, 180, 180);
	g_pl_colors.header_nowplaying_bg = pref.styleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
	g_pl_colors.header_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
	g_pl_colors.header_artist_normal = RGB(80, 80, 80);
	g_pl_colors.header_artist_playing = RGB(60, 60, 60);
	g_pl_colors.header_album_normal = RGB(80, 80, 80);
	g_pl_colors.header_album_playing = RGB(60, 60, 60);
	g_pl_colors.header_info_normal = RGB(60, 60, 60);
	g_pl_colors.header_info_playing = RGB(60, 60, 60);
	g_pl_colors.header_date_normal = RGB(60, 60, 60);
	g_pl_colors.header_date_playing = RGB(60, 60, 60);
	g_pl_colors.header_line_normal = pref.styleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
	g_pl_colors.header_line_playing = pref.styleBlend ? RGB(200, 200, 200) : RGB(215, 215, 215);
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_stripes_bg = pref.styleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
	g_pl_colors.row_selection_bg = pref.styleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
	g_pl_colors.row_selection_frame = pref.styleBlend ? RGB(190, 190, 190) : g_pl_colors.row_selection_bg;
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	g_pl_colors.row_title_normal = RGB(80, 80, 80);
	g_pl_colors.row_title_playing = RGB(60, 60, 60);
	g_pl_colors.row_title_selected = RGB(0, 0, 0);
	g_pl_colors.row_title_hovered = g_pl_colors.row_title_selected;
	g_pl_colors.row_rating_color = RGB(255, 190, 0);
	g_pl_colors.row_disc_subheader_line = pref.styleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
	g_pl_colors.sbar_btn_normal = RGB(100, 100, 100);
	g_pl_colors.sbar_btn_hovered = RGB(0, 0, 0);
	g_pl_colors.sbar_thumb_normal = RGB(100, 100, 100);
	g_pl_colors.sbar_thumb_hovered = RGB(40, 40, 40);
	g_pl_colors.sbar_thumb_drag = g_pl_colors.sbar_thumb_hovered;

	// * LIBRARY COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.nowPlayingBg = pref.styleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
	ui.col.sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
	ui.col.selectionFrame = pref.styleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;
	ui.col.iconPlus = RGB(80, 80, 80);
	ui.col.iconPlus_h = RGB(0, 0, 0);
	ui.col.iconPlus_sel = RGB(0, 0, 0);
	ui.col.iconPlusBg = pref.libraryDesign === 'traditional' ? RGB(255, 255, 255) : RGB(45, 45, 45);
	ui.col.iconMinus_e = RGB(80, 80, 80);
	ui.col.iconMinus_c = ui.col.iconMinus_e;
	ui.col.iconMinus_h = RGB(0, 0, 0);
	ui.col.text = ppt.albumArtShow && img.labels.overlayDark ? RGB(220, 220, 220) : RGB(80, 80, 80);
	ui.col.text_h = ppt.albumArtShow && img.labels.overlayDark ? RGB(255, 255, 255) : RGB(0, 0, 0);
	ui.col.text_nowp = RGB(0, 0, 0);
	ui.col.textSel = RGB(0, 0, 0);
	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;
	ui.col.txt_box = RGB(80, 80, 80);
	ui.col.count = ui.col.text;
	ui.col.search = RGB(80, 80, 80);
	ui.col.searchBtn = RGB(0, 0, 0);
	ui.col.crossBtn = RGB(0, 0, 0);
	ui.col.filterBtn = RGB(80, 80, 80);
	ui.col.settingsBtn = RGB(80, 80, 80);
	ui.col.line = pref.styleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
	ui.col.s_line = ui.col.line;
	ui.col.sbarBtns = RGB(60, 60, 60);
	ui.col.sbarNormal = RGB(0, 0, 0);
	ui.col.sbarHovered = RGB(40, 40, 40);
	ui.col.sbarDrag = RGB(40, 40, 40);

	// * BIOGRAPHY COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.headingText = RGB(60, 60, 60);
	uiBio.col.bottomLine = g_pl_colors.header_line_normal;
	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.text = g_pl_colors.row_title_normal;
	uiBio.col.source = g_pl_colors.row_title_normal;
	uiBio.col.sbarBtns = RGB(60, 60, 60);
	uiBio.col.sbarNormal = RGB(0, 0, 0);
	uiBio.col.sbarHovered = RGB(40, 40, 40);
	uiBio.col.sbarDrag = RGB(40, 40, 40);
	uiBio.col.noPhotoStubBg = RGB(25, 25, 25);
	uiBio.col.noPhotoStubText = pref.theme === 'cream' ? RGB(120, 170, 130) : g_pl_colors.header_artist_playing;

	// * MAIN COLORS * //
	col.bg = pref.styleBevel ? RGB(50, 50, 50) : RGB(25, 25, 25);
	col.shadow = isPlayingCD ? RGBA(0, 0, 0, 30) : col.shadow;
	col.noAlbumArtStub = RGB(40, 40, 40);
	col.lowerBarArtist = RGB(240, 240, 240);
	col.lowerBarTitle = RGB(220, 220, 220);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;

	// * DETAILS COLORS * //
	col.detailsBg = g_pl_colors.bg;
	col.detailsText = RGB(60, 60, 60);
	col.timelineAdded = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
	col.timelinePlayed = isStreaming ? RGB(207, 0, 5) : RGB(80, 80, 80);
	col.timelineUnplayed = isStreaming ? RGB(207, 0, 5) : RGB(120, 120, 120);
	col.timelineFrame = col.detailsBg;
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	// * TOP MENU BUTTONS COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'inner'  ? pref.styleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'emboss' ? RGB(45, 45, 45) :
		RGB(35, 35, 35);

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'inner'  ? RGB(20, 20, 20) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
		pref.styleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);

	col.menuRectStyleEmbossTop = pref.styleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70);
	col.menuRectStyleEmbossBottom = RGB(0, 0, 0);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) :
		pref.styleTopMenuButtons === 'bevel'  ? RGB(0, 0, 0) :
		RGB(60, 60, 60);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
		RGB(100, 100, 100);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(200, 200, 200) : RGB(180, 180, 180);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = pref.styleBlend || pref.styleBlend2 ? RGB(60, 60, 60) : RGB(40, 40, 40);
	col.transportEllipseNormal = RGB(50, 50, 50);
	col.transportEllipseHovered = RGB(100, 100, 100);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(20, 20, 20) :
		pref.styleTransportButtons === 'emboss' ? RGB(50, 50, 50) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(50, 50, 50) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(10, 10, 10) :
		pref.styleTransportButtons === 'emboss' ? RGB(20, 20, 20) : '';

	col.transportIconNormal = RGB(200, 200, 200);
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(50, 50, 50);
	col.progressBarFill = RGB(210, 210, 210);

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = RGB(200, 200, 200);
	col.peakmeterBarFillTop       = RGB(120, 120, 120);
	col.peakmeterBarFillMiddle    = RGB(160, 160, 160);
	col.peakmeterBarFillBack      = RGB(80, 80, 80);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = RGB(245, 245, 245);
	col.peakmeterBarVertFillPeaks = RGB(200, 200, 200);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = RGB(245, 245, 245);
	col.waveformBarFillBack     = RGB(200, 200, 200);
	col.waveformBarFillPreFront = RGB(160, 160, 160);
	col.waveformBarFillPreBack  = RGB(120, 120, 120);
	col.waveformBarIndicator    = RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = col.progressBar;
	col.volumeBarFill = col.progressBarFill;
	col.volumeBarFrame = RGB(50, 50, 50);

	// * STYLE COLORS * //
	col.styleProgressBar =
		pref.styleProgressBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
		pref.styleProgressBar === 'inner' ? RGBA(0, 0, 0, 100) : '';

	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 60)  : RGBA(0, 0, 0, 255) :
											RGBA(0, 0, 0, 255) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
											pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 40) : RGBA(255, 255, 255, 30) :
											pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 30) :
											pref.styleBevel ? RGBA(255, 255, 255, 45) : RGBA(255, 255, 255, 40) : '';

	col.styleProgressBarFill = pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner' ? RGBA(0, 0, 0, 70) : '';

	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) : '';
}


////////////////////////////
// * STYLE BLACK REBORN * //
////////////////////////////
function styleBlackRebornColors() {
	if (!fb.IsPlaying || !albumArt && !noAlbumArtStub) col.primary = RGB(25, 25, 25);
	if (isStreaming || isPlayingCD) setNoAlbumArtColors();

	// * PLAYLIST COLORS * //
	g_pl_colors.bg = RGB(20, 20, 20);
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = g_pl_colors.bg;
	g_pl_colors.header_nowplaying_bg = colBrightness < 25 ? col.lightAccent : pref.styleBevel ? shadeColor(col.primary, 10) : col.primary;
	g_pl_colors.header_line_normal = pref.styleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);
	g_pl_colors.header_line_playing = RGB(25, 25, 25);
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_disc_subheader_line = pref.styleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);

	// * LIBRARY COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

	// * BIOGRAPHY COLORS * //
	uiBio.col.bg = g_pl_colors.bg;

	// * MAIN COLORS * //
	col.bg = colBrightness < 25 || isStreaming || isPlayingCD ? pref.styleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25) : col.primary;
	col.detailsBg = g_pl_colors.bg;
	col.detailsText = RGB(220, 220, 220);
	col.styleBevel = isStreaming || isPlayingCD || !fb.IsPlaying ? RGB(0, 0, 0) : col.primary === RGB(175, 205, 225) ? RGB(70, 90, 105) : col.darkAccent_50;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = g_pl_colors.bg;
	col.transportEllipseNormal = col.transportEllipseBg;
	col.transportEllipseHovered = RGB(120, 120, 120);
	col.transportEllipseDown = col.transportEllipseHovered;
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * WHEN PLAYING * //
	if (fb.IsPlaying) {
		if (lightBg) {
			// * PLAYLIST COLORS * //
			g_pl_colors.row_title_playing = col.darkAccent_100;

			// * MAIN COLORS * //
			col.noAlbumArtStub = RGB(175, 205, 225);
			col.lowerBarArtist = col.darkAccent_75;
			col.lowerBarTitle = col.darkAccent_75;
			col.lowerBarTime = col.lowerBarTitle;
			col.lowerBarLength = col.lowerBarTitle;

			// * TOP MENU BUTTON COLORS * //
			col.menuBgColor =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 50) :
				pref.styleTopMenuButtons !== 'default' ? col.lightAccent_10 : col.lightAccent_50;

			col.menuRectNormal =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 30) :
				col.darkAccent;

			col.menuRectHovered =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 40) : RGBtoRGBA(col.darkAccent_75, 30) :
				col.darkAccent;

			col.menuRectDown = col.menuRectHovered;
			col.menuTextNormal = col.darkAccent_75;
			col.menuTextHovered = col.darkAccent_100;
			col.menuTextDown = col.menuTextHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			col.transportIconNormal = pref.styleTransportButtons === 'minimal' ? RGB(20, 20, 20) : RGB(180, 180, 180);
			col.menuStyleBg = col.primary === RGB(175, 205, 225) ? RGB(130, 153, 168) : col.accent;
			col.menuRectStyleEmbossTop = col.lightAccent;
			col.menuRectStyleEmbossBottom = col.darkAccent;
		}
		else {
			// * PLAYLIST COLORS * //
			g_pl_colors.row_title_playing = col.lightAccent_100;

			// * MAIN COLORS * //
			col.noAlbumArtStub = RGB(175, 205, 225);
			col.lowerBarArtist = col.lightAccent_100;
			col.lowerBarTitle = col.lightAccent_100;
			col.lowerBarTime = col.lowerBarTitle;
			col.lowerBarLength = col.lowerBarTitle;

			// * TOP MENU BUTTON COLORS * //
			col.menuBgColor =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.lightAccent_80, 40) : RGBtoRGBA(col.lightAccent_80, 50) :
				pref.styleTopMenuButtons !== 'default' ? col.lightAccent_10 : col.darkAccent_50;

			col.menuRectNormal =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 60) : RGBtoRGBA(col.darkAccent_75, 50) :
				col.lightAccent_50;

			col.menuRectHovered =
				pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ?
					pref.styleBevel ? RGBtoRGBA(col.darkAccent_75, 60) : RGBtoRGBA(col.darkAccent_75, 50) :
				col.lightAccent_50;

			col.menuRectDown = col.menuRectHovered;
			col.menuTextNormal = col.lightAccent_80;
			col.menuTextHovered = col.lightAccent_100;
			col.menuTextDown = col.menuTextHovered;

			// * LOWER BAR TRANSPORT BUTTON COLORS * //
			col.transportIconNormal = pref.styleTransportButtons === 'minimal' ? RGB(220, 220, 220) : RGB(180, 180, 180);
			col.menuStyleBg = col.primary === RGB(175, 205, 225) ? RGB(130, 153, 168) : col.accent;
			col.menuRectStyleEmbossTop = col.lightAccent;
			col.menuRectStyleEmbossBottom = col.darkAccent;
		}
	}

	// * PROGRESS BAR COLORS * //
	col.progressBar =
		colBrightness < 50 ?
			pref.styleProgressBar === 'bevel' ? RGB(30, 30, 30) :
			pref.styleProgressBar === 'inner' ? RGB(30, 30, 30) :
			pref.styleBevel ? colBrightness < 25 ? RGB(30, 30, 30) : RGB(0, 0, 0) : RGB(0, 0, 0) :
		g_pl_colors.bg;

	if (col.primary === RGB(175, 205, 225)) {
		col.progressBarFill = pref.styleBlend || pref.styleBlend2 ? RGB(155, 185, 205) : RGB(145, 170, 190);
	}

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness > 200 || colBrightness < 75 ? tintColor(col.primary,  100) : shadeColor(col.primary, 100);
	col.peakmeterBarFillTop       = colBrightness > 200 ? shadeColor(col.primary, 10) : tintColor(col.primary, 40);
	col.peakmeterBarFillMiddle    = colBrightness > 200 ? shadeColor(col.primary, 20) : tintColor(col.primary, 60);
	col.peakmeterBarFillBack      = colBrightness > 200 ? shadeColor(col.primary, 40) : tintColor(col.primary, 80);
	col.peakmeterBarVertProgFill  = colBrightness > 200 ? shadeColor(col.primary, 25) : col.progressBarFill;
	col.peakmeterBarVertFill      = colBrightness > 200 ? shadeColor(col.primary, 15) : tintColor(col.primary, 40);
	col.peakmeterBarVertFillPeaks = colBrightness > 200 ? shadeColor(col.primary, 25) : tintColor(col.primary, 60);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness > 200 ? shadeColor(col.primary, 80) : tintColor(col.primary, 90);
	col.waveformBarFillBack     = colBrightness > 200 ? shadeColor(col.primary, 40) : tintColor(col.primary, 45);
	col.waveformBarFillPreFront = colBrightness > 150 ? shadeColor(col.primary, 40) : tintColor(col.primary, 50);
	col.waveformBarFillPreBack  = colBrightness > 150 ? shadeColor(col.primary, 20) : tintColor(col.primary, 25);
	col.waveformBarIndicator    = colBrightness > 200 ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = g_pl_colors.bg;
	col.volumeBarFill = col.progressBarFill;

	// * STYLE COLORS * //
	col.styleVolumeBar =
		pref.styleVolumeBar === 'bevel' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
		pref.styleVolumeBar === 'inner' ? pref.styleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '';

	col.styleVolumeBarFill = pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner' ? RGBA(0, 0, 0, 100)  : '';
}


///////////////////////////////////
// * STYLE REBORN WHITE COLORS * //
///////////////////////////////////
function styleRebornWhiteColors() {
	// * PLAYLIST COLORS * //
	g_pl_colors.bg = !fb.IsPlaying ? RGB(255, 255, 255) : g_pl_colors.bg;

	// * MAIN COLORS * //
	col.bg = pref.styleBlend || pref.styleBlend2 ? RGB(255, 255, 255) : RGB(245, 245, 245);
	col.noAlbumArtStub = RGB(90, 90, 90);
	col.lowerBarArtist = pref.styleBlend || pref.styleBlend2 ? RGB(40, 40, 40) : RGB(80, 80, 80);
	col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? RGB(50, 50, 50) : RGB(100, 100, 100);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(250, 250, 250) : RGB(235, 235, 235) :
		RGB(255, 255, 255);

	col.menuRectNormal =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? pref.styleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
		pref.styleBlend || pref.styleBlend2 ? pref.styleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
		pref.styleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(50, 50, 50) : RGB(100, 100, 100);
	col.menuTextHovered = pref.styleBlend || pref.styleBlend2 ? RGB(0, 0, 0) : RGB(80, 80, 80);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = pref.styleBlend || pref.styleBlend2 ? RGB(225, 225, 225) : RGB(255, 255, 255);
	col.transportEllipseNormal = RGB(220, 220, 220);
	col.transportEllipseHovered = RGB(200, 200, 200);
	col.transportEllipseDown = col.transportEllipseHovered;
	col.transportIconNormal = pref.styleBlend || pref.styleBlend2 ? RGB(80, 80, 80) : RGB(100, 100, 100);
	col.transportIconHovered = RGB(80, 80, 80);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = pref.styleBevel ? RGB(225, 225, 225) : RGB(220, 220, 220);
	col.progressBarFill = shadeColor(col.primary, 5);

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness < 75 ? tintColor(col.primary, 40) : shadeColor(col.primary, 40);
	col.peakmeterBarFillTop       = tintColor(col.primary,  10);
	col.peakmeterBarFillMiddle    = tintColor(col.primary,  30);
	col.peakmeterBarFillBack      = tintColor(col.primary,  50);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = shadeColor(col.primary, 10);
	col.peakmeterBarVertFillPeaks = tintColor(col.primary,  20);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = col.primary;
	col.waveformBarFillBack     = shadeColor(col.primary, 20);
	col.waveformBarFillPreFront = RGB(180, 180, 180);
	col.waveformBarFillPreBack  = RGB(160, 160, 160);
	col.waveformBarIndicator    = colBrightness > 200 ? RGB(0, 0, 0) : tintColor(col.primary, 30);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(255, 255, 255);
	col.volumeBarFill = col.primary;
	col.volumeBarFrame = RGB(220, 220, 220);

	// * STYLE COLORS * //
	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) :
											pref.styleBevel ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 0) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) :
											pref.styleBevel ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 20) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) :
											pref.styleBevel ? RGBA(255, 255, 255, 100) :
											pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 255) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 25) :
											pref.styleBevel ? RGBA(0, 0, 0, 5) :
											pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 255) : '';
}


///////////////////////////////////
// * STYLE REBORN BLACK COLORS * //
///////////////////////////////////
function styleRebornBlackColors() {
	// * MAIN COLORS * //
	col.bg = pref.styleBevel ? RGB(40, 40, 40) : RGB(20, 20, 20);
	col.noAlbumArtStub = RGB(90, 90, 90);
	col.lowerBarArtist = RGB(240, 240, 240);
	col.lowerBarTitle = pref.styleBlend || pref.styleBlend2 ? RGB(220, 220, 220) : RGB(200, 200, 200);
	col.lowerBarTime = col.lowerBarTitle;
	col.lowerBarLength = col.lowerBarTitle;

	// * TOP MENU BUTTON COLORS * //
	col.menuBgColor =
		pref.styleTopMenuButtons === 'bevel'  ? pref.styleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'inner'  ? pref.styleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
		pref.styleTopMenuButtons === 'emboss' ? RGB(45, 45, 45) :
		col.darkAccent_50;

	col.menuStyleBg =
		pref.styleTopMenuButtons === 'inner'  ? RGB(20, 20, 20) :
		pref.styleTopMenuButtons === 'emboss' ? pref.styleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
		pref.styleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);

	col.menuRectStyleEmbossTop = pref.styleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70);
	col.menuRectStyleEmbossBottom = RGB(0, 0, 0);

	col.menuRectNormal = pref.styleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) : RGB(60, 60, 60);

	col.menuRectHovered =
		pref.styleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
		pref.styleTopMenuButtons === 'bevel' || pref.styleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
		RGB(120, 120, 120);

	col.menuRectDown = col.menuRectHovered;
	col.menuTextNormal = pref.styleBlend || pref.styleBlend2 ? RGB(220, 220, 220) : RGB(180, 180, 180);
	col.menuTextHovered = RGB(255, 255, 255);
	col.menuTextDown = col.menuTextHovered;

	// * LOWER BAR TRANSPORT BUTTON COLORS * //
	col.transportEllipseBg = pref.styleBlend || pref.styleBlend2 ? RGB(50, 50, 50) : RGB(35, 35, 35);
	col.transportEllipseNormal = RGB(60, 60, 60);
	col.transportEllipseHovered = RGB(120, 120, 120);
	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportStyleBg =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(20, 20, 20) :
		pref.styleTransportButtons === 'emboss' ? RGB(50, 50, 50) : '';

	col.transportStyleTop =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(50, 50, 50) :
		pref.styleTransportButtons === 'emboss' ? pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';

	col.transportStyleBottom =
		pref.styleTransportButtons === 'bevel' || pref.styleTransportButtons === 'inner' ? RGB(10, 10, 10) :
		pref.styleTransportButtons === 'emboss' ? RGB(20, 20, 20) : '';

	col.transportIconNormal = pref.styleBlend || pref.styleBlend2 ? RGB(180, 180, 180) : RGB(160, 160, 160);
	col.transportIconHovered = RGB(255, 255, 255);
	col.transportIconDown = col.transportIconHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = RGB(50, 50, 50);
	col.progressBarFill = colBrightness < 50 ? col.lightAccent : col.primary;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness > 200 ? shadeColor(col.primary, 40) : colBrightness < 50 ? tintColor(col.primary, 50) : tintColor(col.primary, 40);
	col.peakmeterBarFillTop       = colBrightness <  50 ? tintColor(col.primary,  20) : tintColor(col.primary,  10);
	col.peakmeterBarFillMiddle    = colBrightness <  50 ? tintColor(col.primary,  40) : tintColor(col.primary,  30);
	col.peakmeterBarFillBack      = colBrightness <  50 ? tintColor(col.primary,  30) : shadeColor(col.primary, 15);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = colBrightness <  50 ? tintColor(col.primary,  20) : shadeColor(col.primary, 10);
	col.peakmeterBarVertFillPeaks = colBrightness <  50 ? tintColor(col.primary,  30) : tintColor(col.primary,  20);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness < 50 ? tintColor(col.primary, 40) : colBrightness < 100 ? tintColor(col.primary, 20) : col.primary;
	col.waveformBarFillBack     = colBrightness < 50 ? tintColor(col.primary, 20) : colBrightness < 100 ? col.primary : shadeColor(col.primary, 20);
	col.waveformBarFillPreFront = RGB(100, 100, 100);
	col.waveformBarFillPreBack  = RGB(80, 80, 80);
	col.waveformBarIndicator    = colBrightness > 200 ? RGB(255, 255, 255) : RGB(220, 220, 220);

	// * VOLUME BAR COLORS * //
	col.volumeBar = RGB(35, 35, 35);
	col.volumeBarFill = colBrightness < 50 ? col.lightAccent : col.primary;
	col.volumeBarFrame = RGB(60, 60, 60);

	// * STYLE COLORS * //
	col.styleProgressBarLineTop =
		pref.styleProgressBar === 'bevel' ? RGBA(0, 0, 0, 255) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
											pref.styleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';

	col.styleProgressBarLineBottom =
		pref.styleProgressBar === 'bevel' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(255, 255, 255, 30) :
											pref.styleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
		pref.styleProgressBar === 'inner' ? pref.styleProgressBarDesign === 'rounded' ? RGBA(255, 255, 255, 30) :
											pref.styleBevel ? RGBA(255, 255, 255, 45) :
											pref.styleBlend || pref.styleBlend2 ? RGBA(255, 255, 255, 25) :
											colBrightness < 50 ? RGBA(255, 255, 255, 15) : RGBA(255, 255, 255, 40) : '';
}


////////////////////////////////////
// * STYLE REBORN FUSION COLORS * //
////////////////////////////////////
function styleRebornFusionColors() {
	if (!(fb.IsPlaying && isColored)) return;
	const smallColDiff = colorDistance(col.primary, col.primary_alt) < 100;

	// * PLAYLIST COLORS * //
	g_pl_colors.header_nowplaying_bg = pref.styleBlend ? RGBtoRGBA(col.lightAccent_7_alt, 130) : col.lightAccent_7_alt;
	g_pl_colors.header_sideMarker = smallColDiff ? col.lightAccent_35_alt : col.primary_alt;
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;

	// * MAIN COLORS * //
	col.bg = col.primary_alt;
	col.uiHacksFrame = col.bg;
	col.transportEllipseBg = col.lightAccent_50_alt;
	col.transportEllipseNormal = col.lightAccent_alt;
	col.transportEllipseHovered = col.lightAccent_50_alt;
	col.transportEllipseDown = col.transportEllipseHovered;

	// * PROGRESS BAR COLORS * //
	col.progressBar = col.accent_alt;
	col.progressBarFill = smallColDiff ? col.lightAccent_50 : col.primary;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness2 > 200 ? shadeColor(col.primary_alt, 100) : colBrightness2 < 75 ? tintColor(col.primary_alt, 100) : tintColor(col.primary_alt, 40);
	col.peakmeterBarFillTop       = colBrightness2 > 200 ? shadeColor(col.primary_alt,  10) : tintColor(col.primary_alt, 40);
	col.peakmeterBarFillMiddle    = colBrightness2 > 200 ? shadeColor(col.primary_alt,  20) : tintColor(col.primary_alt, 60);
	col.peakmeterBarFillBack      = colBrightness2 > 200 ? shadeColor(col.primary_alt,  40) : tintColor(col.primary_alt, 80);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = smallColDiff ? col.lightAccent_50 : col.primary;
	col.peakmeterBarVertFillPeaks = tintColor(col.primary, 60);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness2 > 200 || noAlbumArtStub ? shadeColor(col.primary_alt, 80) : tintColor(col.primary_alt, 90);
	col.waveformBarFillBack     = colBrightness2 > 200 || noAlbumArtStub ? shadeColor(col.primary_alt, 40) : tintColor(col.primary_alt, 45);
	col.waveformBarFillPreFront = colBrightness2 > 150 ? shadeColor(col.primary_alt, 40) : tintColor(col.primary_alt, 50);
	col.waveformBarFillPreBack  = colBrightness2 > 150 ? shadeColor(col.primary_alt, 20) : tintColor(col.primary_alt, 25);
	col.waveformBarIndicator    = colBrightness2 > 200 || noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = col.transportEllipseBg;
	col.volumeBarFrame = col.volumeBar;
	col.volumeBarFill = col.progressBarFill;
}


//////////////////////////////////////
// * STYLE REBORN FUSION 2 COLORS * //
//////////////////////////////////////
function styleRebornFusion2Colors() {
	if (!(fb.IsPlaying && isColored)) return;
	const smallColDiff = colorDistance(col.primary, col.primary_alt) < 100;

	// * PLAYLIST COLORS * //
	g_pl_colors.bg = col.primary_alt;
	g_pl_colors.plman_bg = g_pl_colors.bg;
	g_pl_colors.plman_text_normal = g_pl_colors.bg;
	g_pl_colors.header_nowplaying_bg = pref.styleBlend ? RGBtoRGBA(col.lightAccent_7, 130) : tintColor(col.primary_alt, 10);
	g_pl_colors.header_sideMarker = smallColDiff ? col.lightAccent_35 : col.primary;
	g_pl_colors.row_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_sideMarker = smallColDiff ? col.lightAccent_35 : col.primary;

	// * LIBRARY COLORS * //
	ui.col.bg = g_pl_colors.bg;
	ui.col.rowStripes = g_pl_colors.row_stripes_bg;
	ui.col.nowPlayingBg = ppt.albumArtShow ? tintColor(g_pl_colors.row_nowplaying_bg, 7) : g_pl_colors.row_nowplaying_bg;
	ui.col.sideMarker = g_pl_colors.row_sideMarker;
	ui.col.selectionFrame = g_pl_colors.row_selection_frame;
	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// * BIOGRAPHY COLORS * //
	uiBio.col.bg = g_pl_colors.bg;
	uiBio.col.rowStripes = g_pl_colors.row_stripes_bg;

	// * MAIN COLORS * //
	col.bg = col.primary;
	col.detailsBg = col.primary_alt !== RGB(25, 160, 240) && albumArt && !isStreaming ? col.primary_alt : RGB(255, 255, 255);
	col.detailsText =
		isStreaming || isPlayingCD || !albumArt ? RGB(120, 120, 120) :
		lightBgDetails ? RGB(55, 55, 55) :
		RGB(255, 255, 255);

	col.transportEllipseBg = col.lightAccent_65;
	col.transportEllipseNormal = col.lightAccent;
	col.transportEllipseHovered = col.lightAccent_50;
	col.transportEllipseDown = col.transportEllipseHovered;

	col.progressBar = pref.styleBevel ? shadeColor(col.primary_alt, 5) : col.lightAccent;
	col.progressBarFill = smallColDiff ? col.lightAccent_35 : col.primary_alt;
	col.volumeBar = col.transportEllipseBg;
	col.volumeBarFrame = col.volumeBar;
	col.volumeBarFill = smallColDiff ? col.lightAccent_35 : col.primary;
}


///////////////////////////////////////////
// * STYLE REBORN FUSION ACCENT COLORS * //
///////////////////////////////////////////
function styleRebornFusionAccentColors() {
	if (!(fb.IsPlaying && isColored)) return;
	const smallColDiff = colorDistance(col.primary, col.primary_alt) < 100;

	g_pl_colors.header_nowplaying_bg = smallColDiff ? colBrightness > 150 ? col.darkAccent_50_alt : col.lightAccent_50_alt : col.primary_alt;
	g_pl_colors.header_sideMarker = g_pl_colors.header_nowplaying_bg;
	g_pl_colors.row_nowplaying_bg = col.primary_alt;
	g_pl_colors.row_sideMarker = g_pl_colors.header_sideMarker;
	ui.col.sideMarker =	g_pl_colors.header_sideMarker;

	col.progressBarFill = smallColDiff ? colBrightness > 150 ? col.darkAccent_50_alt : col.lightAccent_50_alt : col.primary_alt;

	// * PEAKMETER BAR COLORS * //
	col.peakmeterBarProg          = col.progressBar;
	col.peakmeterBarProgFill      = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff ? 80 : 50) : tintColor(col.primary_alt, smallColDiff ? 80 : 50);
	col.peakmeterBarFillTop       = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff ? 40 : 10) : tintColor(col.primary_alt, smallColDiff ? 40 : 10);
	col.peakmeterBarFillMiddle    = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff ? 30 :  0) : tintColor(col.primary_alt, smallColDiff ? 30 :  0);
	col.peakmeterBarFillBack      = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff ? 60 : 30) : tintColor(col.primary_alt, smallColDiff ? 60 : 30);
	col.peakmeterBarVertProgFill  = col.progressBarFill;
	col.peakmeterBarVertFill      = col.progressBarFill;
	col.peakmeterBarVertFillPeaks = tintColor(col.primary_alt, 60);
	if (peakmeterBar) peakmeterBar.setColors(fb.GetNowPlaying());

	// * WAVEFORM BAR COLORS * //
	col.waveformBarFillFront    = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff || colBrightness > 200 || noAlbumArtStub ? 60 : 10) : tintColor(col.primary_alt, smallColDiff ? 60 : 10);
	col.waveformBarFillBack     = colBrightness > 150 ? shadeColor(col.primary_alt, smallColDiff || colBrightness > 200 || noAlbumArtStub ? 80 : 20) : tintColor(col.primary_alt, smallColDiff ? 80 : 20);
	col.waveformBarFillPreFront = colBrightness > 150 ? shadeColor(col.primary, 20) : tintColor(col.primary, 30);
	col.waveformBarFillPreBack  = colBrightness > 150 ? shadeColor(col.primary, 30) : tintColor(col.primary, 40);
	col.waveformBarIndicator    = colBrightness > 200 || noAlbumArtStub ? RGB(0, 0, 0) : RGB(255, 255, 255);

	// * VOLUME BAR COLORS * //
	col.volumeBar = col.transportEllipseBg;
	col.volumeBarFrame = col.volumeBar;
	col.volumeBarFill = col.progressBarFill;
}


/////////////////////////
// * STYLE FUNCTIONS * //
/////////////////////////
/** Style Black And White Reborn - Dynamically change between style Black and white 1 and 2 */
function initBlackAndWhiteReborn() {
	setImageBrightness();

	if (imgBrightness > 150) {
		pref.styleBlackAndWhite2 = true; // White background
		pref.styleBlackAndWhite = false;
	}
	else {
		pref.styleBlackAndWhite = true; // Black background
		pref.styleBlackAndWhite2 = false;
	}
}


/** Style Blend - blurs and blends album art image in the background */
function setStyleBlend() {
	const setStyleBlendProfiler = timings.showDebugTiming ? fb.CreateProfiler('setStyleBlend') : null;

	const blurImage = (image, blurLevel) => {
		switch (pref.theme) {
			case 'white': blurLevel = 100; break;
			case 'black': blurLevel = 150; break;

			case 'reborn': case 'random':
				switch (true) {
					case imgBrightness > 125: blurLevel = 250; break;
					case imgBrightness > 100: blurLevel = 220; break;
					case imgBrightness >  75: blurLevel = 200; break;
					case imgBrightness >  50: blurLevel = 220; break;
					case imgBrightness >   0: blurLevel = 200; break;
				}
				break;

			case 'blue': case 'darkblue': case 'red': case 'cream':
			case 'nblue': case 'ngreen': case 'nred': case 'ngold':
			case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
			case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
			blurLevel = 250; break;
		}

		image.StackBlur(blurLevel);

		if (settings.showThemeLog) console.log(`Blended image blur: ${blurLevel}`);
		if (settings.showThemeLogOverlay) blendedImgBlur = blurLevel;

		return image;
	}

	const formatBlendedImg = (image, imgW, imgH, angle, alpha) => {
		if (!image || !imgW || !imgH) return image;

		let tempImg = gdi.CreateImage(imgW, imgH);
		const g = tempImg.GetGraphics();

		angle = 0;

		switch (pref.theme) {
			case 'white': alpha = 70; break;
			case 'black': alpha = 50; break;

			case 'reborn': case 'random':
				switch (true) {
					case pref.styleRebornWhite && imgBrightness < 100: alpha =  70; break;
					case pref.styleRebornWhite && imgBrightness <  75: alpha =  50; break;
					case pref.styleRebornWhite && imgBrightness <  50: alpha =  30; break;
					case pref.styleRebornWhite && imgBrightness <  25: alpha =  15; break;

					case pref.styleRebornBlack && imgBrightness > 240: alpha =  30; break;
					case pref.styleRebornBlack && imgBrightness > 175: alpha = 100; break;

					case imgBrightness > 200: alpha = 150; break;
					case imgBrightness > 150: alpha = 130; break;
					case imgBrightness > 125: alpha = 120; break;
					case imgBrightness > 100: alpha = 110; break;
					case imgBrightness >  75: alpha = 100; break;
					case imgBrightness >  50: alpha =  90; break;
					case imgBrightness >   0: alpha =  80; break;
				}
				break;

			case 'blue':     alpha = 80; break;
			case 'darkblue': alpha = 70; break;
			case 'red':      alpha = 50; break;
			case 'cream':    alpha = 70; break;
			case 'nblue': case 'ngreen': case 'nred': case 'ngold': alpha = 50; break;
			case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
			case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
			alpha = 70; break;
		}

		try { // * Prevent crash if album art is corrupt, file format is not supported or has a unusual ICC profile embedded
			g.DrawImage(image, 0, 0, ww, wh, 0, 0, image.Width, image.Height, angle, alpha);
		} catch (e) {
			console.log('<Error: Image blending failed, album art could not be properly parsed! Maybe it is corrupt, file format is not supported or has a unusual ICC profile embedded>');
		}
		tempImg.ReleaseGraphics(g);
		tempImg = blurImage(tempImg, 0, 0, tempImg.Width, tempImg.Height, 0, 0, tempImg.Width, tempImg.Height);

		if (settings.showThemeLog) console.log(`Blended image alpha: ${alpha}\nTheme brightness: ${pref.themeBrightness}`);
		if (settings.showThemeLogOverlay) blendedImgAlpha = alpha;

		return tempImg;
	}

	const setBlendedImg = () => formatBlendedImg(albumArt, ww, wh, 100);
	blendedImg = setBlendedImg(albumArt, fb.GetNowPlaying());

	if (timings.showDebugTiming) setStyleBlendProfiler.Print();
}


///////////////////////////
// * INITIALIZE COLORS * //
///////////////////////////
/** Init all colors that are used in the Playlist, mostly called from initTheme() */
function initPlaylistColors() {
	switch (pref.theme) {
		case 'white': playlistColorsWhiteTheme(); break;
		case 'black': playlistColorsBlackTheme(); break;
		case 'reborn': case 'random': playlistColorsRebornRandomTheme(); break;
		case 'blue': playlistColorsBlueTheme(); break;
		case 'darkblue': playlistColorsDarkblueTheme(); break;
		case 'red': playlistColorsRedTheme(); break;
		case 'cream': playlistColorsCreamTheme(); break;
		case 'nblue': case 'ngreen': case 'nred': case 'ngold': playlistColorsNeonThemes(); break;
		case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
		case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
		playlistColorsCustomTheme(); break;
	}
}


/** Init all colors that are used in the Library, mostly called from initTheme() */
function initLibraryColors() {
	switch (pref.theme) {
		case 'white': libraryColorsWhiteTheme(); break;
		case 'black': libraryColorsBlackTheme(); break;
		case 'reborn': case 'random': libraryColorsRebornRandomTheme(); break;
		case 'blue': libraryColorsBlueTheme(); break;
		case 'darkblue': libraryColorsDarkblueTheme(); break;
		case 'red': libraryColorsRedTheme(); break;
		case 'cream': libraryColorsCreamTheme(); break;
		case 'nblue': case 'ngreen': case 'nred': case 'ngold': libraryColorsNeonThemes(); break;
		case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
		case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
		libraryColorsCustomTheme(); break;
	}
	if (ppt.theme !== 0) libraryThemeColors();
}


/** Init all colors that are used in the Biography, mostly called from initTheme() */
function initBiographyColors() {
	switch (pref.theme) {
		case 'white': biographyColorsWhiteTheme(); break;
		case 'black': biographyColorsBlackTheme(); break;
		case 'reborn': case 'random': biographyColorsRebornRandomTheme(); break;
		case 'blue': biographyColorsBlueTheme(); break;
		case 'darkblue': biographyColorsDarkblueTheme(); break;
		case 'red': biographyColorsRedTheme(); break;
		case 'cream': biographyColorsCreamTheme(); break;
		case 'nblue': case 'ngreen': case 'nred': case 'ngold': biographyColorsNeonThemes(); break;
		case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
		case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
		biographyColorsCustomTheme(); break;
	}
	if (pptBio.theme !== 0) biographyThemeColors();
}


/** Init all colors that are used in Georgia-ReBORN main, mostly called from initTheme() */
function initMainColors() {
	switch (pref.theme) {
		case 'white': mainColorsWhiteTheme(); break;
		case 'black': mainColorsBlackTheme(); break;
		case 'reborn': case 'random': mainColorsRebornRandomTheme(); break;
		case 'blue': mainColorsBlueTheme(); break;
		case 'darkblue': mainColorsDarkblueTheme(); break;
		case 'red': mainColorsRedTheme(); break;
		case 'cream': mainColorsCreamTheme(); break;
		case 'nblue': case 'ngreen': case 'nred': case 'ngold': mainColorsNeonThemes(); break;
		case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
		case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
		mainColorsCustomTheme(); break;
	}
}


/** Init all colors that are used in styles, mostly called from initTheme() */
function initStyleColors() {
	if      (pref.styleAlternative) styleAlternativeColors();
	else if (pref.styleAlternative2) styleAlternative2Colors();
	else if (pref.styleBlackAndWhite) styleBlackAndWhiteColors();
	else if (pref.styleBlackAndWhite2) styleBlackAndWhite2Colors();
	else if (pref.styleBlackReborn) styleBlackRebornColors();
	else if (pref.styleRebornWhite) styleRebornWhiteColors();
	else if (pref.styleRebornBlack) styleRebornBlackColors();
	else if (pref.styleRebornFusion) styleRebornFusionColors();
	else if (pref.styleRebornFusion2) styleRebornFusion2Colors();
	else if (pref.styleRebornFusionAccent) styleRebornFusionAccentColors();
}


/** Init all colors that are used in the chronflow user-component, mostly called from initTheme() */
function initChronflowColors() {
	try {
		const chron = new ActiveXObject('chron.IChronControl');
		if (chron) {
			let r_bg = 255;
			let g_bg = 255;
			let b_bg = 255;

			if (g_pl_colors.bg !== RGB(255, 255, 255)) {
				const bg_rgb = Math.abs(g_pl_colors.bg);

				r_bg = getRed(bg_rgb);
				g_bg = getGreen(bg_rgb);
				b_bg = getBlue(bg_rgb);

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
			r_bg = getRed(col.lowerBarArtist);
			g_bg = getGreen(col.lowerBarArtist);
			b_bg = getBlue(col.lowerBarArtist);

			let strhex = '0x';
			const rgbtohex = RGBtoHEX(b_bg, g_bg, r_bg);
			strhex = strhex.concat(rgbtohex);
			chron.SetTextColor(strhex, /*refresh*/ [1]);
		}
	}
	catch (e) {
		// debugLog('Unable to create ActiveX chron.IChronControl object');
	}
}


//////////////////////////
// * SET THEME COLORS * //
//////////////////////////
function setBackgroundColorDefinition() {
	const customThemes = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme);

	if (['white', 'black', 'reborn', 'random', 'cream'].includes(pref.theme)) {
		colBrightness  = new Color(col.primary).brightness;
		colBrightness2 = new Color(col.primary_alt).brightness;

		lightBg =
			noAlbumArtStub && (pref.theme === 'white' && !pref.styleBlackAndWhite || pref.theme === 'reborn' || pref.theme === 'random')
			||
			colBrightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) &&
				((pref.theme === 'white' || pref.theme === 'black') && colBrightness > 150 || pref.theme === 'reborn' || pref.theme === 'random' && !pref.styleRandomDark)
			||
			colBrightness > 150 && !pref.styleBlend && !pref.styleBlend2 &&
				(pref.theme === 'white' || pref.theme === 'black' || pref.theme === 'reborn' || pref.theme === 'random' && !pref.styleRandomDark)
			||
			pref.theme === 'cream';
	}

	if (!(pref.styleRebornFusion || pref.styleRebornFusion2 || pref.styleRebornFusionAccent || customThemes)) {
		return;
	}
	const mainBgColor      = new Color(pref.styleRebornFusion2 ? col.primary     : customThemes ? HEXtoRGB(customColor.col_bg)         : col.primary_alt).brightness;
	const playlistBgColor  = new Color(pref.styleRebornFusion2 ? col.primary_alt : customThemes ? HEXtoRGB(customColor.g_pl_colors_bg) : col.primary).brightness;
	const detailsBgColor   = new Color(pref.styleRebornFusion2 ? col.primary_alt : customThemes ? HEXtoRGB(customColor.col_detailsBg)  : col.primary).brightness;
	const libraryBgColor   = new Color(pref.styleRebornFusion2 ? col.primary_alt : customThemes ? HEXtoRGB(customColor.ui_col_bg)      : col.primary).brightness;
	const biographyBgColor = new Color(pref.styleRebornFusion2 ? col.primary_alt : customThemes ? HEXtoRGB(customColor.uiBio_col_bg)   : col.primary).brightness;

	lightBgMain =
	mainBgColor + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) ||
	mainBgColor > 150 && !pref.styleBlend && !pref.styleBlend2;

	lightBgPlaylist =
	playlistBgColor + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) ||
	playlistBgColor > 150 && (!pref.styleBlend && !pref.styleBlend2 || pref.styleBlend2 && pref.styleRebornFusion2);

	lightBgDetails =
	detailsBgColor + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) ||
	detailsBgColor > 150 && (!pref.styleBlend && !pref.styleBlend2 || pref.styleBlend2 && pref.styleRebornFusion2);

	lightBgLibrary =
	libraryBgColor + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) ||
	libraryBgColor > 150 && (!pref.styleBlend && !pref.styleBlend2 || pref.styleBlend2 && pref.styleRebornFusion2);

	lightBgBiography =
	biographyBgColor + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2) ||
	biographyBgColor > 150 && (!pref.styleBlend && !pref.styleBlend2 || pref.styleBlend2 && pref.styleRebornFusion2);
}


function setImageBrightness() {
	if (albumArt && (ppt.theme !== 0 || pref.styleBlend || pref.styleBlend2 || pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || pref.styleBlackAndWhiteReborn)) {
		imgBrightness = calcImgBrightness(albumArt);
	}
}


/** Change col.primary when streaming, reset to default when playing from CD or using noAlbumArtStub */
function setNoAlbumArtColors() {
	if (isStreaming && (['white', 'black', 'reborn', 'random'].includes(pref.theme))) {
		col.primary = RGB(207, 0, 5);
	}
	if (isPlayingCD || noAlbumArtStub) {
		if (!isStreaming) setThemeColors();
		uiBio.updateProp(1); // Needed to update color for NO PHOTO/COVER stub in Biography when changing themes
	}
}


function setTheme(color, color2) {
	if (color2 === undefined) color2 = color;
	let themeCol = new Color(color.primary);
	const customThemes = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme);

	if (colorDistance(color.primary, col.bg, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		if (pref.theme !== 'reborn' && pref.theme !== 'random' && (pref.theme !== 'black' && !pref.styleBlackReborn) && !customThemes) {
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
			color.primary = tintColor(color.primary, 15);
			color.accent = tintColor(color.primary, 10);
			themeCol = new Color(color.primary);
		}
		else if (pref.theme !== 'reborn' && pref.theme !== 'random' && (pref.theme !== 'black' && !pref.styleBlackReborn) && !customThemes && !pref.systemFirstLaunch) { // * Prevent crash when clearing Panel Properties
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Shading theme color.');
			color.primary = shadeColor(color.primary, 5);
			themeCol = new Color(color.primary);
		}
	}
	col.primary = color.primary;
	col.primary_alt = color2.primary_alt;

	if (colorDistance(color.primary, col.progressBar, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		// Progress bar fill is too close in color to bg
		if (settings.showThemeLog) console.log('>>> Theme primary color is too close to progress bar. Adjusting progressBar');
		if (pref.theme === 'white' && themeCol.brightness < 125) {
			col.progressBar = RGB(180, 180, 180);
		}
	}

	if (str.timeline) {
		str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);
	}

	col.primary     = color.primary;
	col.primary_alt = color2.primary_alt;

	// * Reborn/Random theme main tone palette
	col.darkAccent_100     = shadeColor(color.primary, 100);
	col.darkAccent_100_alt = shadeColor(color2.primary_alt, 100);
	col.darkAccent_75      = shadeColor(color.primary, 75);
	col.darkAccent_75_alt  = shadeColor(color2.primary_alt, 75);
	col.darkAccent_65      = shadeColor(color.primary, 65);
	col.darkAccent_65_alt  = shadeColor(color2.primary_alt, 65);
	col.darkAccent_50      = shadeColor(color.primary, 50);
	col.darkAccent_50_alt  = shadeColor(color2.primary_alt, 50);
	col.darkAccent         = color.darkAccent;
	col.darkAccent_alt     = color2.darkAccent_alt;
	col.accent             = color.accent;
	col.accent_alt         = color2.accent_alt;

	col.lightAccent_2      = tintColor(color.primary, 2);
	col.lightAccent_2_alt  = tintColor(color2.primary_alt, 2);
	col.lightAccent_7      = tintColor(color.primary, 7);
	col.lightAccent_7_alt  = tintColor(color2.primary_alt, 7);
	col.lightAccent_10     = tintColor(color.primary, 10);
	col.lightAccent_10_alt = tintColor(color2.primary_alt, 10);

	col.lightAccent         = color.lightAccent;
	col.lightAccent_alt     = color2.lightAccent_alt;
	col.lightAccent_35      = tintColor(color.primary, 35);
	col.lightAccent_35_alt  = tintColor(color2.primary_alt, 35);
	col.lightAccent_50      = tintColor(color.primary, 50);
	col.lightAccent_50_alt  = tintColor(color2.primary_alt, 50);
	col.lightAccent_65      = tintColor(color.primary, 65);
	col.lightAccent_65_alt  = tintColor(color2.primary_alt, 65);
	col.lightAccent_80      = tintColor(color.primary, 80);
	col.lightAccent_80_alt  = tintColor(color2.primary_alt, 80);
	col.lightAccent_100     = tintColor(color.primary, 100);
	col.lightAccent_100_alt = tintColor(color2.primary_alt, 100);

	// * Change col.primary if too bright or too dark
	if (pref.theme === 'white' && (colorDistance(col.primary, col.progressBar)) < 60) {
		col.primary = col.darkAccent;
	}
	// else if (pref.theme === 'black' && !pref.styleBlackReborn && (colorDistance(col.primary, col.bg)) < 50) {
	// 	col.primary = RGB(175, 205, 225);
	// }
	// else if (colorDistance(col.primary, col.bg) < 60) {
	// 	col.primary = col.darkAccent;
	// }
}


/** Sets default theme colors, used on startup when nothing has been played or using noAlbumArtStub */
function setThemeColors() {
	switch (pref.theme) {
		case 'white': setTheme(whiteTheme.colors); break;
		case 'black': setTheme(blackTheme.colors); break;
		case 'reborn': setTheme(rebornTheme.colors); break;
		case 'random': setTheme(randomTheme.colors); break;
		case 'blue': setTheme(blueTheme.colors); break;
		case 'darkblue': setTheme(darkblueTheme.colors); break;
		case 'red': setTheme(redTheme.colors); break;
		case 'cream': setTheme(creamTheme.colors); break;
		case 'nblue': setTheme(nblueTheme.colors); break;
		case 'ngreen': setTheme(ngreenTheme.colors); break;
		case 'nred': setTheme(nredTheme.colors); break;
		case 'ngold': setTheme(ngoldTheme.colors); break;
		case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
		case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
		setTheme(customTheme.colors); break;
	}
}


/** Sets and saves currently used colors, used when transfering colors to a custom theme */
function setCurrentColorsToCustomTheme(slot) {
	const currentColors = {
		// * PLAYLIST COLORS * //
		g_pl_colors_bg: RGBFtoHEX(g_pl_colors.bg),
		g_pl_colors_plman_text_normal: RGBFtoHEX(g_pl_colors.plman_text_normal),
		g_pl_colors_plman_text_hovered: RGBFtoHEX(g_pl_colors.plman_text_hovered),
		g_pl_colors_plman_text_pressed: RGBFtoHEX(g_pl_colors.plman_text_pressed),
		g_pl_colors_header_nowplaying_bg: RGBFtoHEX(g_pl_colors.header_nowplaying_bg),
		g_pl_colors_header_sideMarker: RGBFtoHEX(g_pl_colors.header_sideMarker),
		g_pl_colors_header_artist_normal: RGBFtoHEX(g_pl_colors.header_artist_normal),
		g_pl_colors_header_artist_playing: RGBFtoHEX(g_pl_colors.header_artist_playing),
		g_pl_colors_header_album_normal: RGBFtoHEX(g_pl_colors.header_album_normal),
		g_pl_colors_header_album_playing: RGBFtoHEX(g_pl_colors.header_album_playing),
		g_pl_colors_header_info_normal: RGBFtoHEX(g_pl_colors.header_info_normal),
		g_pl_colors_header_info_playing: RGBFtoHEX(g_pl_colors.header_info_playing),
		g_pl_colors_header_date_normal: RGBFtoHEX(g_pl_colors.header_date_normal),
		g_pl_colors_header_date_playing: RGBFtoHEX(g_pl_colors.header_date_playing),
		g_pl_colors_header_line_normal: RGBFtoHEX(g_pl_colors.header_line_normal),
		g_pl_colors_header_line_playing: RGBFtoHEX(g_pl_colors.header_line_playing),
		g_pl_colors_row_nowplaying_bg: RGBFtoHEX(g_pl_colors.row_nowplaying_bg),
		g_pl_colors_row_stripes_bg: RGBFtoHEX(g_pl_colors.row_stripes_bg),
		g_pl_colors_row_selection_frame: RGBFtoHEX(g_pl_colors.row_selection_frame),
		g_pl_colors_row_sideMarker: RGBFtoHEX(g_pl_colors.row_sideMarker),
		g_pl_colors_row_title_normal: RGBFtoHEX(g_pl_colors.row_title_normal),
		g_pl_colors_row_title_playing: RGBFtoHEX(g_pl_colors.row_title_playing),
		g_pl_colors_row_title_selected: RGBFtoHEX(g_pl_colors.row_title_selected),
		g_pl_colors_row_title_hovered: RGBFtoHEX(g_pl_colors.row_title_hovered),
		g_pl_colors_row_rating_color: RGBFtoHEX(g_pl_colors.row_rating_color),
		g_pl_colors_row_disc_subheader_line: RGBFtoHEX(g_pl_colors.row_disc_subheader_line),
		g_pl_colors_sbar_btn_normal: RGBFtoHEX(g_pl_colors.sbar_btn_normal),
		g_pl_colors_sbar_btn_hovered: RGBFtoHEX(g_pl_colors.sbar_btn_hovered),
		g_pl_colors_sbar_thumb_normal: RGBFtoHEX(g_pl_colors.sbar_thumb_normal),
		g_pl_colors_sbar_thumb_hovered: RGBFtoHEX(g_pl_colors.sbar_thumb_hovered),
		g_pl_colors_sbar_thumb_drag: RGBFtoHEX(g_pl_colors.sbar_thumb_drag),

		// * LIBRARY COLORS * //
		ui_col_bg: RGBFtoHEX(ui.col.bg),
		ui_col_rowStripes: RGBFtoHEX(ui.col.rowStripes),
		ui_col_nowPlayingBg: RGBFtoHEX(ui.col.nowPlayingBg),
		ui_col_sideMarker: RGBFtoHEX(ui.col.sideMarker),
		ui_col_selectionFrame: RGBFtoHEX(ui.col.selectionFrame),
		ui_col_selectionFrame2: RGBFtoHEX(ui.col.selectionFrame2),
		ui_col_hoverFrame: RGBFtoHEX(ui.col.hoverFrame),
		ui_col_iconPlus: RGBFtoHEX(ui.col.iconPlus),
		ui_col_iconPlus_h: RGBFtoHEX(ui.col.iconPlus_h),
		ui_col_iconPlus_sel: RGBFtoHEX(ui.col.iconPlus_sel),
		ui_col_iconPlusBg: RGBFtoHEX(ui.col.iconPlusBg),
		ui_col_iconMinus_e: RGBFtoHEX(ui.col.iconMinus_e),
		ui_col_iconMinus_c: RGBFtoHEX(ui.col.iconMinus_c),
		ui_col_iconMinus_h: RGBFtoHEX(ui.col.iconMinus_h),
		ui_col_text: RGBFtoHEX(ui.col.text),
		ui_col_text_h: RGBFtoHEX(ui.col.text_h),
		ui_col_text_nowp: RGBFtoHEX(ui.col.text_nowp),
		ui_col_textSel: RGBFtoHEX(ui.col.textSel),
		ui_col_txt: RGBFtoHEX(ui.col.txt),
		ui_col_txt_h: RGBFtoHEX(ui.col.txt_h),
		ui_col_txt_box: RGBFtoHEX(ui.col.txt_box),
		ui_col_search: RGBFtoHEX(ui.col.search),
		ui_col_searchBtn: RGBFtoHEX(ui.col.searchBtn),
		ui_col_crossBtn: RGBFtoHEX(ui.col.crossBtn),
		ui_col_filterBtn: RGBFtoHEX(ui.col.filterBtn),
		ui_col_settingsBtn: RGBFtoHEX(ui.col.settingsBtn),
		ui_col_line: RGBFtoHEX(ui.col.line),
		ui_col_s_line: RGBFtoHEX(ui.col.s_line),
		ui_col_sbarBtns: RGBFtoHEX(ui.col.sbarBtns),
		ui_col_sbarNormal: RGBFtoHEX(ui.col.sbarNormal),
		ui_col_sbarHovered: RGBFtoHEX(ui.col.sbarHovered),
		ui_col_sbarDrag: RGBFtoHEX(ui.col.sbarDrag),

		// * BIOGRAPHY COLORS * //
		uiBio_col_bg: RGBFtoHEX(uiBio.col.bg),
		uiBio_col_rowStripes: RGBFtoHEX(uiBio.col.rowStripes),
		uiBio_col_headingText: RGBFtoHEX(uiBio.col.headingText),
		uiBio_col_bottomLine: RGBFtoHEX(uiBio.col.bottomLine),
		uiBio_col_centerLine: RGBFtoHEX(uiBio.col.centerLine),
		uiBio_col_sectionLine: RGBFtoHEX(uiBio.col.sectionLine),
		uiBio_col_accent: RGBFtoHEX(uiBio.col.accent),
		uiBio_col_source: RGBFtoHEX(uiBio.col.source),
		uiBio_col_summary: RGBFtoHEX(uiBio.col.summary),
		uiBio_col_text: RGBFtoHEX(uiBio.col.text),
		uiBio_col_lyricsNormal: RGBFtoHEX(uiBio.col.lyricsNormal),
		uiBio_col_lyricsHighlight: RGBFtoHEX(uiBio.col.lyricsHighlight),
		uiBio_col_noPhotoStubBg: RGBFtoHEX(uiBio.col.noPhotoStubBg),
		uiBio_col_noPhotoStubText: RGBFtoHEX(uiBio.col.noPhotoStubText),
		uiBio_col_sbarBtns: RGBFtoHEX(uiBio.col.sbarBtns),
		uiBio_col_sbarNormal: RGBFtoHEX(uiBio.col.sbarNormal),
		uiBio_col_sbarHovered: RGBFtoHEX(uiBio.col.sbarHovered),
		uiBio_col_sbarDrag: RGBFtoHEX(uiBio.col.sbarDrag),

		// * MAIN COLORS * //
		col_bg: RGBFtoHEX(col.bg),
		col_shadow: RGBFtoHEX(col.shadow),
		col_discArtShadow: RGBFtoHEX(col.discArtShadow),
		col_noAlbumArtStub: RGBFtoHEX(col.noAlbumArtStub),
		col_lowerBarArtist: RGBFtoHEX(col.lowerBarArtist),
		col_lowerBarTitle: RGBFtoHEX(col.lowerBarTitle),
		col_lowerBarTime: RGBFtoHEX(col.lowerBarTime),
		col_lowerBarLength: RGBFtoHEX(col.lowerBarLength),
		col_lyricsNormal: RGBFtoHEX(col.lyricsNormal),
		col_lyricsHighlight: RGBFtoHEX(col.lyricsHighlight),
		col_lyricsShadow: RGBFtoHEX(col.lyricsShadow),
		col_detailsBg: RGBFtoHEX(col.detailsBg),
		col_detailsText: RGBFtoHEX(col.detailsText),
		col_detailsRating: RGBFtoHEX(col.detailsRating),
		col_timelineAdded: RGBFtoHEX(col.timelineAdded),
		col_timelinePlayed: RGBFtoHEX(col.timelinePlayed),
		col_timelineUnplayed: RGBFtoHEX(col.timelineUnplayed),
		col_timelineFrame: RGBFtoHEX(col.timelineFrame),
		col_popupBg: RGBFtoHEX(col.popupBg),
		col_popupText: RGBFtoHEX(col.popupText),
		col_menuBgColor: RGBFtoHEX(col.menuBgColor),
		col_menuStyleBg: RGBFtoHEX(col.menuStyleBg),
		col_menuRectStyleEmbossTop: RGBFtoHEX(col.menuRectStyleEmbossTop),
		col_menuRectStyleEmbossBottom: RGBFtoHEX(col.menuRectStyleEmbossBottom),
		col_menuRectNormal: RGBFtoHEX(col.menuRectNormal),
		col_menuRectHovered: RGBFtoHEX(col.menuRectHovered),
		col_menuRectDown: RGBFtoHEX(col.menuRectDown),
		col_menuTextNormal: RGBFtoHEX(col.menuTextNormal),
		col_menuTextHovered: RGBFtoHEX(col.menuTextHovered),
		col_menuTextDown: RGBFtoHEX(col.menuTextDown),
		col_transportEllipseBg: RGBFtoHEX(col.transportEllipseBg),
		col_transportEllipseNormal: RGBFtoHEX(col.transportEllipseNormal),
		col_transportEllipseHovered: RGBFtoHEX(col.transportEllipseHovered),
		col_transportEllipseDown: RGBFtoHEX(col.transportEllipseDown),
		col_transportStyleBg: RGBFtoHEX(col.transportStyleBg),
		col_transportStyleTop: RGBFtoHEX(col.transportStyleTop),
		col_transportStyleBottom: RGBFtoHEX(col.transportStyleBottom),
		col_transportIconNormal: RGBFtoHEX(col.transportIconNormal),
		col_transportIconHovered: RGBFtoHEX(col.transportIconHovered),
		col_transportIconDown: RGBFtoHEX(col.transportIconDown),
		col_progressBar: RGBFtoHEX(col.progressBar),
		col_progressBarStreaming: RGBFtoHEX(col.progressBarStreaming),
		col_progressBarFrame: RGBFtoHEX(col.progressBarFrame),
		col_progressBarFill: RGBFtoHEX(col.progressBarFill),
		col_peakmeterBarProg: RGBFtoHEX(col.peakmeterBarProg),
		col_peakmeterBarProgFill: RGBFtoHEX(col.peakmeterBarProgFill),
		col_peakmeterBarFillTop: RGBFtoHEX(col.peakmeterBarFillTop),
		col_peakmeterBarFillMiddle: RGBFtoHEX(col.peakmeterBarFillMiddle),
		col_peakmeterBarFillBack: RGBFtoHEX(col.peakmeterBarFillBack),
		col_peakmeterBarVertProgFill: RGBFtoHEX(col.peakmeterBarVertProgFill),
		col_peakmeterBarVertFill: RGBFtoHEX(col.peakmeterBarVertFill),
		col_peakmeterBarVertFillPeaks: RGBFtoHEX(col.peakmeterBarVertFillPeaks),
		col_waveformBarFillFront: RGBFtoHEX(col.waveformBarFillFront),
		col_waveformBarFillBack: RGBFtoHEX(col.waveformBarFillBack),
		col_waveformBarFillPreFront: RGBFtoHEX(col.waveformBarFillPreFront),
		col_waveformBarFillPreBack: RGBFtoHEX(col.waveformBarFillPreBack),
		col_waveformBarIndicator: RGBFtoHEX(col.waveformBarIndicator),
		col_volumeBar: RGBFtoHEX(col.volumeBar),
		col_volumeBarFrame: RGBFtoHEX(col.volumeBarFrame),
		col_volumeBarFill: RGBFtoHEX(col.volumeBarFill),
		col_styleBevel: RGBFtoHEX(col.styleBevel),
		col_styleGradient: RGBFtoHEX(col.styleGradient),
		col_styleGradient2: RGBFtoHEX(col.styleGradient2),
		col_styleProgressBar: RGBFtoHEX(col.styleProgressBar),
		col_styleProgressBarLineTop: RGBFtoHEX(col.styleProgressBarLineTop),
		col_styleProgressBarLineBottom: RGBFtoHEX(col.styleProgressBarLineBottom),
		col_styleProgressBarFill: RGBFtoHEX(col.styleProgressBarFill),
		col_styleVolumeBar: RGBFtoHEX(col.styleVolumeBar),
		col_styleVolumeBarFill: RGBFtoHEX(col.styleVolumeBarFill)
	}

	switch (slot) {
		case 'custom01':
			customTheme01 = configCustom.addConfigurationObject(customTheme01Schema, currentColors, customThemeComments);
			customColor = customTheme01;
			configCustom.updateConfigObjValues('customTheme01', currentColors, true);
			break;
		case 'custom02':
			customTheme02 = configCustom.addConfigurationObject(customTheme02Schema, currentColors, customThemeComments);
			customColor = customTheme02;
			configCustom.updateConfigObjValues('customTheme02', currentColors, true);
			break;
		case 'custom03':
			customTheme03 = configCustom.addConfigurationObject(customTheme03Schema, currentColors, customThemeComments);
			customColor = customTheme03;
			configCustom.updateConfigObjValues('customTheme03', currentColors, true);
			break;
		case 'custom04':
			customTheme04 = configCustom.addConfigurationObject(customTheme04Schema, currentColors, customThemeComments);
			customColor = customTheme04;
			configCustom.updateConfigObjValues('customTheme04', currentColors, true);
			break;
		case 'custom05':
			customTheme05 = configCustom.addConfigurationObject(customTheme05Schema, currentColors, customThemeComments);
			customColor = customTheme05;
			configCustom.updateConfigObjValues('customTheme05', currentColors, true);
			break;
		case 'custom06':
			customTheme06 = configCustom.addConfigurationObject(customTheme06Schema, currentColors, customThemeComments);
			customColor = customTheme06;
			configCustom.updateConfigObjValues('customTheme06', currentColors, true);
			break;
		case 'custom07':
			customTheme07 = configCustom.addConfigurationObject(customTheme07Schema, currentColors, customThemeComments);
			customColor = customTheme07;
			configCustom.updateConfigObjValues('customTheme07', currentColors, true);
			break;
		case 'custom08':
			customTheme08 = configCustom.addConfigurationObject(customTheme08Schema, currentColors, customThemeComments);
			customColor = customTheme08;
			configCustom.updateConfigObjValues('customTheme08', currentColors, true);
			break;
		case 'custom09':
			customTheme09 = configCustom.addConfigurationObject(customTheme09Schema, currentColors, customThemeComments);
			customColor = customTheme09;
			configCustom.updateConfigObjValues('customTheme09', currentColors, true);
			break;
		case 'custom10':
			customTheme10 = configCustom.addConfigurationObject(customTheme10Schema, currentColors, customThemeComments);
			customColor = customTheme10;
			configCustom.updateConfigObjValues('customTheme10', currentColors, true);
			break;
	}
}


////////////////////////////////
// * RANDOM COLOR GENERATOR * //
////////////////////////////////
/** Random theme color generator used for Random theme */
function randomThemeColor() {
	const generateRandomColor = () => {
		const R = Math.floor((Math.random() * (pref.styleRandomPastel ? 127 : 27)) + (pref.styleRandomPastel ? 127 : 27));
		const G = Math.floor((Math.random() * (pref.styleRandomPastel ? 127 : 27)) + (pref.styleRandomPastel ? 127 : 27));
		const B = Math.floor((Math.random() * (pref.styleRandomPastel ? 127 : 27)) + (pref.styleRandomPastel ? 127 : 27));
		return pref.styleRandomPastel || pref.styleRandomDark ? (R << 16) + (G << 8) + B : ((1 << 24) * Math.random() | 0);
	};

	const color = new Color(generateRandomColor());
	const tObj = createThemeColorObject(color);
	setTheme(tObj);

	if (settings.showThemeLog) {
		console.log('Random generated color:', color.getRGB(true));
		console.log('Random color brightness:', color.brightness);
	}
	if (settings.showThemeLogOverlay) selectedPrimaryColor = color.getRGB(true);
}


/** Style Random theme auto color - auto creates new colors depending on time interval */
function randomThemeAutoColor() {
	clearInterval(randomThemeAutoColorTimer);
	randomThemeAutoColorTimer = null;

	if (pref.styleRandomAutoColor !== 'off' && pref.styleRandomAutoColor !== 'track') {
		randomThemeAutoColorTimer = setInterval(() => {
			initTheme();
		}, pref.styleRandomAutoColor);
	}
	else if (pref.styleRandomAutoColor === 'track') {
		initTheme();
	}
	debugLog('initTheme -> randomThemeAutoColor');
}


///////////////////////////////////
// * ALBUM ART COLOR GENERATOR * //
///////////////////////////////////
/**
 * @param {GdiBitmap} image
 * @param {number} maxColorsToPull
 */
function getThemeColorsJson(image, maxColorsToPull, secondaryColor) {
	const minFrequency = 0.015;
	const maxBrightness = pref.theme === 'black' || pref.styleBlend || ['reborn', 'random'].includes(pref.theme) && pref.styleBlend2 ? 255 : 212;
	let selectedColor;
	let selectedColor2;

	try {
		const colorsWeighted = JSON.parse(image.GetColourSchemeJSON(maxColorsToPull));
		colorsWeighted.map(c => {
			c.col = new Color(c.col);
			return c.col;
		});

		if (settings.showThemeLog) console.log('idx      color        bright  freq   weight');

		let maxWeight = 0;
		let maxWeight2 = 0;
		selectedColor = colorsWeighted[0].col;  // Choose first color in case no color selected below
		selectedColor2 = colorsWeighted[1].col; // Choose second color in case no color selected below

		colorsWeighted.forEach((c, i) => {
			const col = c.col;
			const randomMinMaxNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
			const midBrightness = 127 - Math.abs(127 - col.brightness); // Favors colors with a brightness around 127
			const midBrightness2 = randomMinMaxNum(60, 120) - Math.abs(randomMinMaxNum(60, 120) - col.brightness); // Favors colors with a random brightness from 60 - 120
			c.weight = c.freq * midBrightness * 10; // Multiply by 10 so numbers are easier to compare
			c.weight2 = c.freq * midBrightness2 * 10; // Multiply by 10 so numbers are easier to compare

			if (c.freq >= minFrequency && !col.isCloseToGreyscale && col.brightness < maxBrightness) {
				if (settings.showThemeLog) {
					console.log(leftPad(i, 2), col.getRGB(true, true), leftPad(col.brightness, 4), ' ', `${leftPad((c.freq * 100).toFixed(2), 5)}%`, leftPad(c.weight.toFixed(2), 7));
				}
				if (c.weight > maxWeight) {
					maxWeight = c.weight;
					selectedColor = col;
				}
				if (c.weight2 < c.weight) {
					maxWeight2 = c.weight2;
					selectedColor2 = col;
				}
			}
			else if (settings.showThemeLog) {
				console.log(' -', col.getRGB(true, true), leftPad(col.brightness, 4), ' ', `${leftPad((c.freq * 100).toFixed(2), 5)}%`, col.isCloseToGreyscale ? '   grey' : (c.freq < minFrequency) ? '   freq' : ' bright');
			}
		});

		if (selectedColor.brightness < 37) {
			if (settings.showThemeLog) console.log(selectedColor.getRGB(true), 'brightness:', selectedColor.brightness, 'too dark -- searching for highlight color');
			let brightest = selectedColor;
			maxWeight = 0;
			colorsWeighted.forEach(c => {
				if (c.col.brightness > selectedColor.brightness &&
					c.col.brightness < 200 &&
					!c.col.isCloseToGreyscale &&
					c.weight > maxWeight &&
					c.freq > 0.01) {
						maxWeight = c.weight;
						brightest = c.col;
					}
			});
			selectedColor = brightest;
		}
		if (selectedColor.brightness < selectedColor2.brightness) {
			if (settings.showThemeLog) console.log(selectedColor.getRGB(true), 'brightness:', selectedColor.brightness, 'too dark -- searching for highlight color');
			let brightest = selectedColor2;
			maxWeight = 0;
			colorsWeighted.forEach(c => {
				if (c.col.brightness > selectedColor2.brightness &&
					c.col.brightness < 200 &&
					!c.col.isCloseToGreyscale &&
					c.freq > 0.05) {
						maxWeight2 = c.weight2;
						brightest = c.col;
					}
			});
			selectedColor2 = brightest;
		}

		if (settings.showThemeLog) {
			console.log('Primary color:', selectedColor.getRGB(true));
			console.log('Primary color 2:', selectedColor2.getRGB(true));
		}
		if (settings.showThemeLogOverlay) {
			selectedPrimaryColor = selectedColor.getRGB(true);
			selectedPrimaryColor2 = selectedColor2.getRGB(true);
		}

		return secondaryColor ? selectedColor2.val : selectedColor.val;
	}
	catch (e) {
		console.log('<Error: GetColourSchemeJSON failed.>');
	}
}


async function getThemeColors(image) {
	let calculatedColor;
	let calculatedColor2;
	const val = $('[%THEMECOLOR%]');
	const val2 = $('[%THEMECOLOR2%]');

	if (val.length) { // Color hardcoded in tags from music files
		const themeRgb = val.match(/\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		const themeRgb2 = val2.match(/\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		calculatedColor = themeRgb ? RGB(parseInt(themeRgb[1]), parseInt(themeRgb[2]), parseInt(themeRgb[3])) : 0xff000000 | parseInt(val, 16);
		calculatedColor2 = themeRgb2 ? RGB(parseInt(themeRgb2[1]), parseInt(themeRgb2[2]), parseInt(themeRgb2[3])) : 0xff000000 | parseInt(val2, 16);
	} else {
		calculatedColor = getThemeColorsJson(image, 14);
		calculatedColor2 = getThemeColorsJson(image, 14, true);
	}

	if (!isNaN(calculatedColor)) {
		let color = new Color(calculatedColor);
		let color2 = new Color(calculatedColor2);

		while (pref.theme !== 'black' && color.brightness > 220) {
			calculatedColor = shadeColor(calculatedColor, pref.theme === 'white' ? 12 : 3);
			if (settings.showThemeLog) console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
			color2 = new Color(calculatedColor2);
		}
		while (!color.isGreyscale && color.brightness <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
			color2 = new Color(calculatedColor2);
		}

		const tObj = createThemeColorObject(color);
		const tObj2 = createThemeColorObject(color, color2);
		if (pref.theme === 'reborn') {
			setTheme(tObj, tObj2);
		} else {
			setTheme(tObj);
		}

		if (settings.showThemeLog) console.log('Primary color brightness:', color.brightness);
		if (settings.showThemeLog) console.log('Primary color 2 brightness:', color2.brightness);
	}
}


function createThemeColorObject(color, color2) {
	if (color2 === undefined) color2 = color;
	const themeObj = {
		primary: color.val,
		primary_alt: color2.val,
		darkAccent: shadeColor(color.val, 30),
		darkAccent_alt: shadeColor(color2.val, 30),
		accent: shadeColor(color.val, 15),
		accent_alt: shadeColor(color2.val, 15),
		lightAccent: tintColor(color.val, 20),
		lightAccent_alt: tintColor(color2.val, 20)
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
		themeObj.darkAccent = shadeColor(color.val, 35);
		themeObj.darkAccent_alt = shadeColor(color2.val, 35);
		themeObj.accent = tintColor(color.val, 10);
		themeObj.accent_alt = tintColor(color2.val, 10);
		themeObj.lightAccent = tintColor(color.val, 20);
		themeObj.lightAccent_alt = tintColor(color2.val, 20);
	}
	else if (color.brightness > 210) {
		themeObj.darkAccent = shadeColor(color.val, 30);
		themeObj.darkAccent_alt = shadeColor(color2.val, 30);
		themeObj.accent = shadeColor(color.val, 20);
		themeObj.accent_alt = shadeColor(color2.val, 20);
		themeObj.lightAccent = shadeColor(color.val, 10);
		themeObj.lightAccent_alt = shadeColor(color2.val, 10);
	}
	return themeObj;
}
