/** @type ColorsObj */
var col = {}; // colors
var themeArray = [];


// PLAYLIST COLORS
function initPlaylistColors() {
	const colBrightness = new Color(col.primary).brightness;
	const imgBrightness = calcImageBrightness(albumart);

	//---> Common
	g_pl_colors.background =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(20, 20, 20) :
		pref.rebornTheme || pref.randomTheme ?
		/*	Need this extra condition to overwrite col.primary when switching themes, no album art loaded i.e on startup and going back to Reborn/Random theme.
			Reborn/Random theme should stay default white and not the defined col.primary dark gray */
			g_pl_colors.background != undefined ? !albumart || col.primary === rgb(90, 90, 90) && !fb.IsPlaying || col.primary === rgb(25, 160, 240) && !fb.IsPlaying ? RGB(255, 255, 255) :
			pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? col.altBG : col.primary : RGB(255, 255, 255) :
		pref.blueTheme ?  RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(255, 247, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

	const isColored = g_pl_colors.background != RGB(255, 255, 255);
	const isNotColored = g_pl_colors.background == RGB(255, 255, 255);

	//---> Playlist Manager
	g_pl_colors.playlist_mgr_text_normal =
		pref.whiteTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(140, 140, 140) :
		pref.blackTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(180, 180, 180) :
		pref.rebornTheme || pref.randomTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(140, 140, 140) :
		pref.blueTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(220, 220, 220) :
		pref.darkblueTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(220, 220, 220) :
		pref.redTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(220, 220, 220) :
		pref.creamTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(220, 220, 220) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.autoHidePLM ? g_pl_colors.background : RGB(200, 200, 200) : '';

	g_pl_colors.playlist_mgr_text_hovered =
		pref.whiteTheme ? pref.autoHidePLM ? RGB(120, 120, 120) : RGB(80, 80, 80) :
		pref.blackTheme ? pref.autoHidePLM ? RGB(200, 200, 200) : RGB(240, 240, 240) :
		pref.rebornTheme || pref.randomTheme ? pref.autoHidePLM ? RGB(120, 120, 120) : RGB(80, 80, 80) :
		pref.blueTheme ? pref.autoHidePLM ? RGB(230, 230, 230) : RGB(255, 255, 255) :
		pref.darkblueTheme ? pref.autoHidePLM ? RGB(220, 220, 220) : RGB(255, 255, 255) :
		pref.redTheme ? pref.autoHidePLM ? RGB(220, 220, 220) : RGB(255, 255, 255) :
		pref.creamTheme ? pref.autoHidePLM ? RGB(110, 110, 110) : RGB(80, 80, 80) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.autoHidePLM ? RGB(220, 220, 220) : RGB(255, 255, 255) : '';

	g_pl_colors.playlist_mgr_text_pressed =
		pref.whiteTheme ? pref.autoHidePLM ? RGB(80, 80, 80) : RGB(140, 140, 140) :
		pref.blackTheme ? pref.autoHidePLM ? RGB(240, 240, 240) : RGB(180, 180, 180) :
		pref.rebornTheme || pref.randomTheme ? pref.autoHidePLM ? RGB(80, 80, 80) : RGB(140, 140, 140) :
		pref.blueTheme ? pref.autoHidePLM ? RGB(255, 255, 255) : RGB(220, 220, 220) :
		pref.darkblueTheme ? pref.autoHidePLM ? RGB(255, 255, 255) : RGB(220, 220, 220) :
		pref.redTheme ? pref.autoHidePLM ? RGB(255, 255, 255) : RGB(220, 220, 220) :
		pref.creamTheme ? pref.autoHidePLM ? RGB(80, 80, 80) : RGB(130, 130, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.autoHidePLM ? RGB(255, 255, 255) : RGB(200, 200, 200) : '';

	//---> Header
	g_pl_colors.group_title =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.group_title_selected =
		pref.whiteTheme ? g_pl_colors.group_title :
		pref.blackTheme ? g_pl_colors.group_title :
		pref.rebornTheme || pref.randomTheme ? g_pl_colors.group_title :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(240, 240, 240) :
		pref.redTheme ? RGB(240, 240, 240) :
		pref.creamTheme ? g_pl_colors.group_title :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

	g_pl_colors.artist_normal =
		pref.whiteTheme ? g_pl_colors.group_title :
		pref.blackTheme ? g_pl_colors.group_title :
		pref.rebornTheme || pref.randomTheme ? g_pl_colors.group_title :
		pref.blueTheme ? RGB(240, 240, 240) :
		pref.darkblueTheme ? RGB(240, 240, 240) :
		pref.redTheme ? RGB(240, 240, 240) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

	g_pl_colors.artist_playing =
		pref.whiteTheme ? pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) : pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	g_pl_colors.album_normal =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.album_playing =
		pref.whiteTheme ? pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? RGB(245, 245, 245) : pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(245, 245, 245) :
		pref.redTheme ? RGB(245, 245, 245) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

	g_pl_colors.info_normal =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.info_playing =
		pref.whiteTheme ? pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? RGB(245, 245, 245) : g_pl_colors.info_normal :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.rebornTheme || pref.randomTheme ? g_pl_colors.info_normal :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(245, 245, 245) :
		pref.redTheme ? RGB(245, 245, 245) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

	g_pl_colors.date_normal =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(240, 240, 240) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.date_playing =
		pref.whiteTheme ? pref.layout_mode === 'artwork_mode' || pref.layout_mode === 'compact_mode' ? RGB(245, 245, 245) : g_pl_colors.date_normal :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.rebornTheme || pref.randomTheme ? g_pl_colors.date_normal :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(245, 245, 245) :
		pref.redTheme ? RGB(245, 245, 245) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	g_pl_colors.line_normal =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	g_pl_colors.line_playing =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(220, 220, 220) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(50, 50, 50) : '';

	// Not used, only for selection in compact header mode
	g_pl_colors.line_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	g_pl_colors.header_sideMarker =
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	g_pl_colors.header_nowplaying_bg =
		pref.whiteTheme || pref.blackTheme ? col.primary :
		pref.rebornTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.darkMiddleAccent : col.primary :
		pref.randomTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.middleAccent, 130) : colBrightness > 130 ? shadeColor(col.primary, 5) : col.middleAccent : col.primary :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(130, 25, 25) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(25, 25, 25, 100) : RGB(25, 25, 25) : '';

	g_pl_colors.header_compact_marker = g_pl_colors.header_sideMarker;
	g_pl_colors.header_compact_nowplaying_bg = g_pl_colors.header_nowplaying_bg;

	//---> Row
	g_pl_colors.title_selected =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	g_pl_colors.title_playing =
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.rebornTheme ? isNotColored && ( /*streaming or playing audio cd*/ col.primary != RGB(207, 0, 5) && col.primary != RGB(90, 90, 90)) ? rgb(20, 20, 20) : RGB(245, 245, 245) :
		pref.randomTheme ? isNotColored && ( /*streaming or playing audio cd*/ col.primary != RGB(207, 0, 5) && col.primary != RGB(65, 65, 65)) ? rgb(20, 20, 20) : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	g_pl_colors.title_normal =
		pref.whiteTheme && (pref.layout_mode === 'default_mode' || pref.layout_mode === 'artwork_mode') ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(100, 100, 100) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

	g_pl_colors.title_hovered = g_pl_colors.title_selected;
	g_pl_colors.rating_color = RGB(255, 190, 0);

	g_pl_colors.count_normal =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(100, 100, 100) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.count_selected = g_pl_colors.title_selected;
	g_pl_colors.count_playing = g_pl_colors.title_playing;
	g_pl_colors.row_selected = ''; // Not used, don't need this header + row selection

	g_pl_colors.row_alternate =
		pref.whiteTheme ? pref.themeStyleBlend ? RGBA(245, 245, 245, 130) : RGB(245, 245, 245) :
		pref.blackTheme ? pref.themeStyleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.altBG : RGB(245, 245, 245) :
		pref.blueTheme ? pref.themeStyleBlend ? RGBA(5, 110, 195, 130) : RGB(5, 110, 195) :
		pref.darkblueTheme ? pref.themeStyleBlend ? RGBA(22, 40, 63, 130) : RGB(22, 40, 63) :
		pref.redTheme ? pref.themeStyleBlend ? RGBA(100, 20, 20, 130) : RGB(100, 20, 20) :
		pref.creamTheme ? pref.themeStyleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend ? RGBA(20, 20, 20, 130) : RGB(20, 20, 20) : '';

	g_pl_colors.row_focus_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

	g_pl_colors.row_focus_normal = RGB(80, 80, 80);

	g_pl_colors.row_sideMarker =
		pref.whiteTheme || pref.blackTheme ? col.primary :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	g_pl_colors.row_selection_frame =
		pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme || pref.creamTheme ? g_pl_colors.row_focus_selected :
		pref.blueTheme ? RGB(10, 135, 230) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(145, 25, 25) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(40, 40, 40) : '';

	g_pl_colors.row_selection_frame_cropped =
		pref.whiteTheme || pref.blackTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.row_focus_selected :
		pref.blueTheme ? RGB(255, 135, 230) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(145, 25, 25) : '';

	g_pl_colors.row_nowplaying_bg =
		pref.whiteTheme || pref.blackTheme ? col.primary :
		pref.rebornTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.darkMiddleAccent : col.primary :
		pref.randomTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.middleAccent, 130) : colBrightness > 130 ? shadeColor(col.primary, 5) : col.middleAccent : col.primary :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(130, 25, 25) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(25, 25, 25, 100) : RGB(25, 25, 25) : '';

	//---> Common.js Settings Override
	g_theme.colors.pss_back = g_pl_colors.background;
	g_theme.colors.panel_back = g_pl_colors.background;
	g_theme.colors.panel_front = g_pl_colors.background;

	g_theme.colors.panel_line =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	g_theme.colors.panel_line_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(0, 0, 0) :
		pref.rebornTheme || pref.randomTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	g_theme.colors.panel_text_normal =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	g_pl_colors.ico_fore_colors_normal =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(100, 100, 100) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.lightAccent : RGB(120, 120, 120) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	g_pl_colors.ico_fore_colors_hovered =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(160, 160, 160) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.lightAccent : RGB(0, 0, 0) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(100, 100, 100) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 0, 0) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	g_pl_colors.thumb_colors_normal =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(100, 100, 100) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.lightAccent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(10, 135, 225) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(145, 25, 25) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	g_pl_colors.thumb_colors_hovered =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(160, 160, 160) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.lightAccent : RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 0, 0) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	g_pl_colors.thumb_colors_down = g_pl_colors.thumb_colors_hovered;

	// Reborn/Random theme
	if ((pref.rebornTheme || pref.randomTheme) && isColored) {
		if (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) || (pref.themeStyleBlend || pref.themeStyleBlend2) && imgBrightness > 190) {
			g_pl_colors.playlist_mgr_text_normal = pref.autoHidePLM ? col.primary : col.superDarkAccent;
			g_pl_colors.playlist_mgr_text_hovered = col.maxDarkAccent;
			g_pl_colors.playlist_mgr_text_pressed = col.maxDarkAccent;
			g_pl_colors.artist_normal = col.superDarkAccent;
			g_pl_colors.artist_playing = col.superDarkAccent;
			g_pl_colors.album_normal = col.superDarkAccent;
			g_pl_colors.album_playing = col.superDarkAccent;
			g_pl_colors.info_normal = col.superDarkAccent;
			g_pl_colors.info_playing = col.superDarkAccent;
			g_pl_colors.date_normal = col.superDarkAccent;
			g_pl_colors.date_playing = col.superDarkAccent;
			g_pl_colors.title_normal = col.superDarkAccent;
			g_pl_colors.title_selected = col.maxDarkAccent;
			g_pl_colors.title_hovered = col.maxDarkAccent;
			g_pl_colors.title_playing = col.maxDarkAccent;
		}
		else if (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131)) {
			g_pl_colors.playlist_mgr_text_normal = pref.autoHidePLM ? col.primary : col.superLightAccent;
			g_pl_colors.playlist_mgr_text_hovered = col.maxLightAccent;
			g_pl_colors.playlist_mgr_text_pressed = col.maxLightAccent;
			g_pl_colors.artist_normal = col.superLightAccent;
			g_pl_colors.artist_playing = col.maxLightAccent;
			g_pl_colors.album_normal = col.superLightAccent;
			g_pl_colors.album_playing = col.maxLightAccent;
			g_pl_colors.info_normal = col.superLightAccent;
			g_pl_colors.info_playing = col.maxLightAccent;
			g_pl_colors.date_normal = col.superLightAccent;
			g_pl_colors.date_playing = col.maxLightAccent;
			g_pl_colors.title_normal = col.superLightAccent;
			g_pl_colors.title_selected = col.maxLightAccent;
			g_pl_colors.title_hovered = col.maxLightAccent;
			g_pl_colors.title_playing = col.maxLightAccent;
		}
		switch (true) {
			case colBrightness > 200:
				g_pl_colors.line_normal = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				g_pl_colors.line_playing = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				g_pl_colors.row_selection_frame = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				g_theme.colors.panel_line = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				break;
			case colBrightness > 150:
				g_pl_colors.line_normal = shadeColor(col.accent, 2);
				g_pl_colors.line_playing = shadeColor(col.accent, 4);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 2);
				g_theme.colors.panel_line = shadeColor(col.accent, 2);
				break;
			case colBrightness > 125:
				g_pl_colors.line_normal = shadeColor(col.accent, 5);
				g_pl_colors.line_playing = shadeColor(col.accent, 7);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 5);
				g_theme.colors.panel_line = shadeColor(col.accent, 5);
				break;
			case colBrightness > 100:
				g_pl_colors.line_normal = shadeColor(col.accent, 10);
				g_pl_colors.line_playing = shadeColor(col.accent, 15);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 10);
				g_theme.colors.panel_line = shadeColor(col.accent, 10);
				break;
			case colBrightness > 75:
				g_pl_colors.line_normal = shadeColor(col.accent, 15);
				g_pl_colors.line_playing = shadeColor(col.accent, 20);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 15);
				g_theme.colors.panel_line = shadeColor(col.accent, 15);
				break;
			case colBrightness > 50:
				g_pl_colors.line_normal = shadeColor(col.accent, 20);
				g_pl_colors.line_playing = shadeColor(col.accent, 25);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 20);
				g_theme.colors.panel_line = shadeColor(col.accent, 20);
				break;
			case colBrightness > 0:
				g_pl_colors.line_normal = shadeColor(col.accent, 15);
				g_pl_colors.line_playing = shadeColor(col.accent, 35);
				g_pl_colors.row_selection_frame = shadeColor(col.accent, 15);
				g_theme.colors.panel_line = shadeColor(col.accent, 15);
				break;
		}
	}
}


// LIBRARY COLORS
function initLibraryColors() {
	const colBrightness = new Color(col.primary).brightness;
	const imgBrightness = calcImageBrightness(albumart);
	const isColored = g_pl_colors.background != RGB(255, 255, 255);

	ui.col.bg = g_pl_colors.background;
	ui.col.topBarUnderlay = g_pl_colors.background;

	ui.col.iconPlus =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.iconPlus_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	ui.col.iconMinus_e =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(255, 202, 128) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.iconMinus_c = ui.col.iconMinus_e;

	ui.col.iconMinus_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	ui.col.iconPlusbg =
		pref.whiteTheme ? RGB(240, 240, 240) :
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? RGB(240, 240, 240) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	ui.col.iconPlusSel =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	ui.col.nowpBgSel =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	ui.col.text =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(100, 100, 100) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

	ui.col.text_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	ui.col.textSel = pref.rebornTheme || pref.randomTheme ? RGB(255, 255, 255) : ui.col.text_h;

	ui.col.txt = ui.col.text;
	ui.col.txt_h = ui.col.text_h;

	ui.col.txt_box =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(40, 40, 40) : RGB(80, 80, 80) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(80, 80, 80) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

	ui.col.text_nobw_nowp =
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.count = ui.col.text;
	ui.col.selBlend = ui.col.text;
	ui.col.lotBlend = ui.col.selBlend;

	ui.col.search =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(100, 100, 100) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

	ui.col.searchBtn =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.crossBtn =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(40, 40, 40) : RGB(80, 80, 80) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(80, 80, 80) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.filterBtn =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

	ui.col.settingsBtn =
		pref.whiteTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.line =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? shadeColor(col.accent, 10) : col.accent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

	ui.col.s_line = ui.col.line;

	ui.col.nowPlayingBg =
		pref.whiteTheme || pref.blackTheme ? col.primary :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBlend ? RGBtoRGBA(col.darkMiddleAccent, 130) : col.darkMiddleAccent : col.primary :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : '';

	ui.col.sideMarker =
		pref.whiteTheme && !pref.themeStyleBlackAndWhite && !pref.themeStyleBlackAndWhite2 || pref.blackTheme ? col.primary :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.sideMarker_nobw =
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

	ui.col.selectionFrame =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.lightAccent : RGB(200, 200, 200) :
		pref.blueTheme ? RGB(10, 135, 230) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(145, 25, 25) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(40, 40, 40) : '';

	ui.col.selectionFrame2 = ui.col.sideMarker;
	ui.col.hoverFrame = ui.col.sideMarker;

	// Library scrollbar colors, also linked with biography scrollbar colors
	ui.col.sbarBtns =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(100, 100, 100) :
		pref.rebornTheme || pref.randomTheme ? isColored ? ui.col.text : RGB(120, 120, 120) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	ui.col.sbarNormal =
		pref.whiteTheme ? RGB(116, 127, 129) :
		pref.blackTheme ? RGB(224, 224, 224) :
		pref.rebornTheme || pref.randomTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(10, 150, 255) :
		pref.darkblueTheme ? RGB(36, 84, 143) :
		pref.redTheme ? RGB(198, 32, 32) :
		pref.creamTheme ? RGB(116, 127, 129) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';
	ui.col.sbarNormalR = getRed(ui.col.sbarNormal);
	ui.col.sbarNormalG = getGreen(ui.col.sbarNormal);
	ui.col.sbarNormalB = getBlue(ui.col.sbarNormal);

	ui.col.sbarHovered =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(160, 160, 160) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 0, 0) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';
	ui.col.sbarHoveredR = getRed(ui.col.sbarHovered);
	ui.col.sbarHoveredG = getGreen(ui.col.sbarHovered);
	ui.col.sbarHoveredB = getBlue(ui.col.sbarHovered);

	ui.col.sbarDrag =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(160, 160, 160) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 0, 0) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';
	ui.col.sbarDragR = getRed(ui.col.sbarDrag);
	ui.col.sbarDragG = getGreen(ui.col.sbarDrag);
	ui.col.sbarDragB = getBlue(ui.col.sbarDrag);

	// Reborn/Random theme colors for library scrollbar, also linked with biography scrollbar colors
	ui.col.accentR = getRed(col.accent);
	ui.col.accentG = getGreen(col.accent);
	ui.col.accentB = getBlue(col.accent);
	ui.col.extraLightAccentR = getRed(col.extraLightAccent);
	ui.col.extraLightAccentG = getGreen(col.extraLightAccent);
	ui.col.extraLightAccentB = getBlue(col.extraLightAccent);
	ui.col.lightMiddleAccentR = getRed(col.lightMiddleAccent);
	ui.col.lightMiddleAccentG = getGreen(col.lightMiddleAccent);
	ui.col.lightMiddleAccentB = getBlue(col.lightMiddleAccent);
	ui.col.extraDarkAccentR = getRed(col.extraDarkAccent);
	ui.col.extraDarkAccentG = getGreen(col.extraDarkAccent);
	ui.col.extraDarkAccentB = getBlue(col.extraDarkAccent);

	// Reborn/Random theme
	if ((pref.rebornTheme || pref.randomTheme) && isColored) {
		if (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) || (pref.themeStyleBlend || pref.themeStyleBlend2) && imgBrightness > 190) {
			ui.col.iconPlus = col.superDarkAccent;
			ui.col.iconPlus_h = col.maxDarkAccent;
			ui.col.iconMinus_e = col.superDarkAccent;
			ui.col.iconMinus_h = col.maxDarkAccent;
			ui.col.iconPlusbg = col.darkMiddleAccent;
			ui.col.iconPlusSel = col.maxDarkAccent;
			ui.col.nowpBgSel = col.maxDarkAccent;
			ui.col.text = col.superDarkAccent;
			ui.col.text_h = col.maxDarkAccent;
			ui.col.textSel = col.maxDarkAccent;
			ui.col.txt_box = col.superDarkAccent;
			ui.col.search = col.superDarkAccent;
			ui.col.searchBtn = col.superDarkAccent;
			ui.col.crossBtn = col.superDarkAccent;
			ui.col.filterBtn = col.superDarkAccent;
			ui.col.settingsBtn = col.superDarkAccent;
			ui.col.line = col.accent;
			ui.col.sbarBtns = isColored ? ui.col.text : col.superDarkAccent;
		}
		else if (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131)) {
			ui.col.iconPlus = col.superLightAccent;
			ui.col.iconPlus_h = col.maxLightAccent;
			ui.col.iconMinus_e = col.superLightAccent;
			ui.col.iconMinus_h = col.maxLightAccent;
			ui.col.iconPlusbg = col.darkMiddleAccent;
			ui.col.iconPlusSel = col.maxLightAccent;
			ui.col.nowpBgSel = col.maxLightAccent;
			ui.col.text = col.superLightAccent;
			ui.col.text_h = col.maxLightAccent;
			ui.col.textSel = col.maxLightAccent;
			ui.col.txt_box = col.superLightAccent;
			ui.col.search = col.superLightAccent;
			ui.col.searchBtn = col.superLightAccent;
			ui.col.crossBtn = col.superLightAccent;
			ui.col.filterBtn = col.superLightAccent;
			ui.col.settingsBtn = col.superLightAccent;
			ui.col.line = col.accent;
			ui.col.sbarBtns = isColored ? ui.col.text : col.superLightAccent;
		}
		switch (true) {
			case colBrightness > 200:
				ui.col.line = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				ui.col.selectionFrame = pref.themeStyleBlend ? tintColor(col.accent, 10) : col.accent;
				break;
			case colBrightness > 150:
				ui.col.line = shadeColor(col.accent, 4);
				ui.col.selectionFrame = shadeColor(col.accent, 2);
				break;
			case colBrightness > 125:
				ui.col.line = shadeColor(col.accent, 7);
				ui.col.selectionFrame = shadeColor(col.accent, 5);
				break;
			case colBrightness > 100:
				ui.col.line = shadeColor(col.accent, 15);
				ui.col.selectionFrame = shadeColor(col.accent, 10);
				break;
			case colBrightness > 75:
				ui.col.line = shadeColor(col.accent, 20);
				ui.col.selectionFrame = shadeColor(col.accent, 15);
				break;
			case colBrightness > 50:
				ui.col.line = shadeColor(col.accent, 25);
				ui.col.selectionFrame = shadeColor(col.accent, 20);
				break;
			case colBrightness > 0:
				ui.col.line = shadeColor(col.accent, 35);
				ui.col.selectionFrame = shadeColor(col.accent, 15);
				break;
		}
	}
}


// BIOGRAPHY COLORS
function initBiographyColors() {
	const colBrightness = new Color(col.primary).brightness;
	const imgBrightness = calcImageBrightness(albumart);
	const isColored = g_pl_colors.background != RGB(255, 255, 255);

	pptBio.headFontStyle = 1;
	uiBio.col.bg = g_pl_colors.background;

	uiBio.col.head =
		uiBio.blur.dark ? pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : rgb(230, 230, 230) :
		uiBio.blur.blend && (pref.blackTheme || pref.blackTheme || pref.darkblueTheme || pref.redTheme) ? g_pl_colors.artist_playing :
		uiBio.blur.light ? rgb(65, 65, 65) : uiBio.blur.light && (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) ? g_pl_colors.artist_playing :
		pref.whiteTheme && pref.layout_mode === 'artwork_mode' ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) : pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) :
		g_pl_colors.artist_playing;

	uiBio.col.text =
		uiBio.blur.dark ? rgb(230, 230, 230) :
		uiBio.blur.blend && (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme) ? g_pl_colors.title_normal :
		uiBio.blur.light ? rgb(60, 60, 60) :
		g_pl_colors.title_normal;

	uiBio.col.source =
		uiBio.blur.dark ? rgb(230, 230, 230) :
		uiBio.blur.blend && (!pref.whiteTheme || !pref.rebornTheme || !pref.randomTheme || !pref.creamTheme) ? rgb(230, 230, 230) :
		uiBio.blur.light ? rgb(60, 60, 60) :
		g_pl_colors.title_normal;

	uiBio.col.bottomLine =
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? rgb(55, 55, 55) :
		uiBio.blur.dark && (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme) ? col.extraDarkAccent :
		(uiBio.blur.blend || uiBio.blur.light) && (pref.whiteTheme || pref.rebornTheme || pref.randomTheme || pref.creamTheme) ? rgb(120, 120, 120) :
		g_pl_colors.line_normal;

	uiBio.col.centerLine = uiBio.col.bottomLine;
	uiBio.col.sbarBtns = ui.col.sbarBtns;

	uiBio.col.noPhotoStubText =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.creamTheme ? RGB(120, 170, 130) :
		g_pl_colors.artist_playing;

	uiBio.col.noPhotoStubBg =
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.darkMiddleAccent : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(130, 25, 25) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB (25, 25, 25) : '';

	// Reborn/Random theme colors
	if ((pref.rebornTheme || pref.randomTheme) && isColored) {
		if (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) || (pref.themeStyleBlend || pref.themeStyleBlend2) && imgBrightness > 190) {
			uiBio.col.head = uiBio.blur.dark ? col.superLightAccent : col.superDarkAccent;
			uiBio.col.text = uiBio.blur.dark ? col.superLightAccent : col.superDarkAccent;
			uiBio.col.source = uiBio.blur.dark ? col.superLightAccent : col.superDarkAccent;
			uiBio.col.bottomLine = col.darkAccent;
			uiBio.col.centerLine = col.darkAccent;
			uiBio.col.sbarBtns = isColored && !uiBio.blur.dark && !uiBio.blur.blend && !uiBio.blur.light ? col.maxDarkAccent : uiBio.blur.light ? col.maxDarkAccent : uiBio.blur.dark ? col.maxLightAccent : RGB(20, 20, 20);
		}
		else if (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131)) {
			uiBio.col.head = uiBio.blur.light ? col.superDarkAccent : col.superLightAccent;
			uiBio.col.text = uiBio.blur.light ? col.superDarkAccent : col.superLightAccent;
			uiBio.col.source = uiBio.blur.light ? col.superDarkAccent : col.superLightAccent;
			uiBio.col.bottomLine = col.darkAccent;
			uiBio.col.centerLine = col.darkAccent;
			uiBio.col.sbarBtns = isColored && !uiBio.blur.dark && !uiBio.blur.blend && !uiBio.blur.light ? col.maxLightAccent : uiBio.blur.dark ? col.maxLightAccent : uiBio.blur.light ? col.maxDarkAccent : RGB(220, 220, 220);
		}
	}
}


// MAIN COLORS
function initMainColors() {
	const colBrightness = new Color(col.primary).brightness;
	const imgBrightness = calcImageBrightness(albumart);
	const isColored = g_pl_colors.background != RGB(255, 255, 255);
	const isNotColored = g_pl_colors.background == RGB(255, 255, 255);

	col.artist =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(240, 240, 240) : RGB(240, 240, 240) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	col.now_playing =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(220, 220, 220) : RGB(200, 200, 200) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(90, 90, 90) : RGB(100, 100, 100) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

	col.info_text =
		pref.whiteTheme ? isStreaming || isPlayingCD || !albumart ? RGB(120, 120, 120) : colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 100 : 130) ? RGB(55, 55, 55) : RGB(255, 255, 255) :
		pref.blackTheme ? isStreaming || isPlayingCD || !albumart ? RGB(255, 255, 255) : colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) ? col.superDarkAccent : !albumart ? rgb(120, 120, 120) : col.maxLightAccent :
		pref.rebornTheme || pref.randomTheme ? isStreaming || isPlayingCD || !albumart ? RGB(120, 120, 120) : colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) ? RGB(55, 55, 55) : RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

	col.bg =
		pref.whiteTheme ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(245, 245, 245) :
		pref.blackTheme ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.primary === RGB(0, 0, 0) ? RGB(20, 20, 20) : col.primary : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(5, 110, 195) :
		pref.darkblueTheme ? RGB(22, 40, 63) :
		pref.redTheme ? RGB(100, 20, 20) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20) : '';

	col.detailsBg =
		pref.whiteTheme ? col.primary !== rgb(25, 160, 240) && !noAlbumArtStub && !isStreaming ? col.primary : RGB(255, 255, 255) :
		pref.blackTheme ? col.primary !== rgb(25, 160, 240) && !noAlbumArtStub && !isStreaming ? col.primary : RGB(20, 20, 20)  :
		pref.rebornTheme ? col.primary !== rgb(25, 160, 240) && !noAlbumArtStub && !isStreaming ? col.primary : RGB(255, 255, 255) :
		pref.randomTheme ? col.primary !== rgb(25, 160, 240) && !noAlbumArtStub && !isStreaming ? col.darkMiddleAccent : RGB(255, 255, 255) :
		pref.blueTheme ?  RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(255, 247, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(12, 12, 12, 100) : RGB(12, 12, 12) : '';

	col.themeStyleBevel =
		pref.whiteTheme ? pref.themeStyleBevel && pref.themeStyleBlackAndWhite2 ? RGB(0, 0, 0) : RGB(40, 40, 40) :
		pref.blackTheme ? pref.themeStyleBlackReborn ? col.primary === RGB(165, 195, 215) && fb.IsPlaying ? RGB(70, 90, 105) : fb.IsPlaying ? col.extraDarkAccent : RGB(0, 0, 0) : RGB(0, 0, 0) :
		pref.rebornTheme || pref.randomTheme ? pref.themeStyleRebornWhite ? RGB(40, 40, 40) : pref.themeStyleRebornBlack ? RGB(0, 0, 0) : col.maxDarkAccent :
		pref.blueTheme ? RGB(0, 0, 0) :
		pref.darkblueTheme ? RGB(0, 0, 0) :
		pref.redTheme ? RGB(0, 0, 0) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(0, 0, 0) : '';

	col.themeStyleGradient =
		pref.rebornTheme || pref.randomTheme ? isColored ? col.darkAccent : col.bg :
		pref.blueTheme ? RGBA(0, 0, 0, 90) :
		pref.darkblueTheme ? RGBA(0, 0, 0, 140) :
		pref.redTheme ? RGBA(0, 0, 0, 90) : '';

	col.themeStyleGradient2 =
		pref.rebornTheme || pref.randomTheme ? isColored ? col.darkAccent : col.bg :
		pref.blueTheme ? RGB(3, 72, 128) :
		pref.darkblueTheme ? RGB(10, 20, 35) :
		pref.redTheme ? RGB(65, 13, 13) : '';

	col.themeStyleAlternative =
		pref.whiteTheme ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(245, 245, 245) :
		pref.blackTheme ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.primary : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(5, 110, 195) :
		pref.darkblueTheme ? RGB(22, 40, 63) :
		pref.redTheme ? RGB(100, 20, 20) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20) : '';

	col.uiHackFrame =
		pref.whiteTheme ?
			pref.themeStyleBlackAndWhite ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(230, 230, 230) :
			pref.themeStyleBlackAndWhite2 ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(25, 25, 25) :
			RGB(245, 245, 245) :
		pref.blackTheme ? pref.themeStyleBlackReborn && fb.IsPlaying ? col.primary : RGB(35, 35, 35) :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleRebornWhite ? RGB(245, 245, 245) :
			pref.themeStyleRebornBlack ? RGB(25, 25, 25) :
			isColored ?	col.primary : RGB(245, 245, 245) :
		pref.blueTheme ? RGB(63, 155, 202) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ?	RGB(125, 0, 0) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : '';

	col.aa_border = RGBA(60, 60, 60, 128);
	col.rating = RGB(255, 170, 32);
	col.hotness = RGB(192, 192, 0);

	col.tl_added =
		pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ? isStreaming ? rgb(207, 0, 5) : col.darkAccent :
		pref.blueTheme ? RGB(12, 144, 245) :
		pref.darkblueTheme ? RGB(31, 65, 107) :
		pref.redTheme ? RGB(156, 30, 30) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : '';

	col.tl_played =
		pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ? isStreaming ? rgb(207, 0, 5) : col.accent :
		pref.blueTheme ? RGB(12, 137, 232) :
		pref.darkblueTheme ? RGB(27, 58, 94) :
		pref.redTheme ? RGB(143, 27, 27) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(70, 145, 85) : RGB(130, 184, 141) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(40, 40, 40) : '';

	col.tl_unplayed =
		pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ? isStreaming ? rgb(207, 0, 5) : col.lightAccent :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(130, 25, 25) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(75, 150, 90) : RGB(139, 196, 151) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(50, 50, 50) : '';

	if (str.timeline) { // Needed to update timeline colors when changing themes
		str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
	}

	col.menuTextNormal =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(200, 200, 200) : RGB(180, 180, 180) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(242, 7, 46) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	col.menuTextHovered =
		pref.whiteTheme ? RGB(80, 80, 80) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(80, 80, 80) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? pref.themeStyleBlend ? RGB(60, 60, 60) : RGB(100, 100, 100) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 8, 8) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	col.menuTextDown = col.menuTextHovered;

	col.menuRectNormal =
		pref.whiteTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleAlternative2 ? RGB(190, 190, 190) :
			RGB(200, 200, 200) :
		pref.blackTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' ? RGB(0, 0, 0) :
			RGB(60, 60, 60) :
		pref.rebornTheme || pref.randomTheme ? RGB(140, 140, 140) :
		pref.blueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(76, 175, 255, 130) :
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(5, 85, 150) : RGB(5, 100, 180) :
			RGB(76, 175, 255) :
		pref.darkblueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(200, 200, 200, 140) :
			RGB(200, 200, 200) :
		pref.redTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(200, 200, 200, 140) :
			RGB(200, 200, 200) :
		pref.creamTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(100, 150, 110, 100) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(150, 150, 150) :
			RGB(100, 150, 110) :
		pref.nblueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(0, 200, 255, 80) :
			RGB(0, 200, 255) :
		pref.ngreenTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(0, 200, 0, 80) :
			RGB(0, 200, 0) :
		pref.nredTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(242, 7, 46, 80) :
			RGB(242, 7, 46) :
		pref.ngoldTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(254, 204, 3, 80) :
			RGB(254, 204, 3) : '';

	col.menuRectHovered =
		pref.whiteTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleAlternative2 ? RGB(190, 190, 190) :
			RGB(200, 200, 200) :
		pref.blackTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(120, 120, 120) :
		pref.rebornTheme || pref.randomTheme ? RGB(200, 200, 200) :
		pref.blueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(76, 175, 255, 130) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(5, 85, 150) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(4, 68, 120) : RGB(5, 100, 180) :
			RGB(76, 175, 255) :
		pref.darkblueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(50, 90, 150, 140) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(15, 25, 40) : RGB(18, 30, 50) :
			RGB(50, 90, 150) :
		pref.redTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(204, 45, 45, 140) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(66, 13, 13) : RGB(77, 15, 15) :
			RGB(204, 45, 45) :
		pref.creamTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(190, 190, 190, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(150, 150, 150) :
			RGB(190, 190, 190) :
		pref.nblueTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(0, 238, 255, 80) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(0, 238, 255) :
		pref.ngreenTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(0, 255, 0, 80) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(0, 255, 0) :
		pref.nredTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(255, 8, 8, 80) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(255, 8, 8) :
		pref.ngoldTheme ?
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(255, 242, 3, 80) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(255, 242, 3) : '';

	col.menuRectDown = col.menuRectHovered;

	col.menuBgColor =
		pref.whiteTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			RGB(255, 255, 255) :
		pref.blackTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(45, 45, 45) :
			RGB(35, 35, 35) :
		pref.rebornTheme || pref.randomTheme ?
			isColored ?
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
				pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
				col.lightAccent :
			RGB(255, 255, 255) :
		pref.blueTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(10, 123, 209) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(10, 130, 220) : RGB(10, 130, 220) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(10, 130, 220) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(10, 130, 220) : RGB(10, 135, 230) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(10, 123, 209) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(10, 130, 220) : RGB(10, 130, 220) :
			RGB(10, 130, 220) :
		pref.darkblueTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(27, 55, 90) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(27, 55, 90) : RGB(27, 55, 90) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(38, 70, 110) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(38, 70, 110) : RGB(38, 70, 110) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(27, 55, 90) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(27, 55, 90) : RGB(27, 55, 90) :
			RGB(27, 55, 90) :
		pref.redTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(140, 25, 25) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(140, 25, 25) : RGB(140, 25, 25) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(160, 32, 32) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(160, 32, 32) : RGB(160, 32, 32) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(140, 25, 25) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(140, 25, 25) : RGB(140, 25, 25) :
			RGB(140, 25, 25) :
		pref.creamTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			RGB(247, 239, 233) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
			RGB(50, 50, 50) : '';

	col.menuThemeStyleBg =
		pref.whiteTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
			pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220) :
		pref.blackTheme ?
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			pref.themeStyleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20) :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
				isColored ?
					pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 70) : RGBtoRGBA(col.superDarkAccent, 80) :
				pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220) :
			pref.themeStyleTopMenuButtons === 'emboss' ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
				isColored ?
					pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 30) : RGBtoRGBA(col.superDarkAccent, 40) :
				pref.themeStyleBevel ? RGB(235, 235, 235) : RGB(225, 225, 225) :
			RGB(255, 255, 255) :
		pref.blueTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(5, 110, 195) : RGB(5, 110, 195) :
			pref.themeStyleBevel ? RGB(5, 90, 160) : RGB(5, 100, 175) :
		pref.darkblueTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(27, 48, 77) : RGB(27, 48, 77) :
			pref.themeStyleBevel ? RGB(22, 40, 60) : RGB(25, 45, 70) :
		pref.redTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(125, 25, 25) : RGB(125, 25, 25) :
			pref.themeStyleBevel ? RGB(100, 20, 20) : RGB(100, 20, 20) :
		pref.creamTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(240, 230, 220) : RGB(240, 230, 220) :
			pref.themeStyleBevel ? RGB(212, 205, 200) : RGB(229, 222, 216) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(35, 35, 35) : RGB(40, 40, 40) :
			pref.themeStyleBevel ? RGB(25, 25, 25) : RGB(20, 20, 20) : '';

	col.menuRectThemeStyleTop =
		pref.whiteTheme ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
		pref.blackTheme ? pref.themeStyleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70) :
		pref.rebornTheme || pref.randomTheme ?
			isColored ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70) :
				col.lightAccent :
			pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
		pref.blueTheme ? pref.themeStyleBevel ? RGB(10, 138, 228) : RGB(10, 138, 228) :
		pref.darkblueTheme ? pref.themeStyleBevel ? RGB(35, 70, 115) : RGB(35, 70, 115) :
		pref.redTheme ? pref.themeStyleBevel ? RGB(158, 30, 30) : RGB(158, 30, 30) :
		pref.creamTheme ? pref.themeStyleBevel ? RGB(235, 235, 235) : RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(60, 60, 60) : '';

	col.menuRectThemeStyleBottom =
		pref.whiteTheme ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) :
		pref.blackTheme ? RGB(0, 0, 0) :
		pref.rebornTheme || pref.randomTheme ?
			isColored ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(0, 0, 0) : RGB(0, 0, 0) :
				col.darkAccent :
			pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) :
		pref.blueTheme ? pref.themeStyleBevel ? RGB(6, 95, 160) : RGB(6, 95, 160) :
		pref.darkblueTheme ? pref.themeStyleBevel ? RGB(6, 10, 15) : RGB(6, 10, 15) :
		pref.redTheme ? pref.themeStyleBevel ? RGB(54, 10, 10) : RGB(54, 10, 10) :
		pref.creamTheme ? pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(215, 215, 215) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(0, 0, 0) : '';

	col.transportIconNormal =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 || pref.themeStyleTransportButtons === 'minimal' ? RGB(80, 80, 80) : RGB(120, 120, 120) :
		pref.blackTheme ? RGB(160, 160, 160) :
		pref.rebornTheme || pref.randomTheme ? RGB(120, 120, 120) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 || pref.themeStyleTransportButtons === 'minimal' ? RGB(65, 135, 80) : RGB(100, 150, 110) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(242, 7, 46) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	col.transportIconHovered =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 || pref.themeStyleTransportButtons === 'minimal' ? RGB(0, 0, 0) : RGB(60, 60, 60) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.rebornTheme || pref.randomTheme ? RGB(80, 80, 80) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(100, 100, 100) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 8, 8) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	col.transportIconDown = col.transportIconHovered;

	col.transportEllipseNormal =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(210, 210, 210) : RGB(220, 220, 220) :
		pref.blackTheme ? RGB(60, 60, 60) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.darkMiddleAccent : RGB(220, 220, 220) :
		pref.blueTheme ? RGB(22, 107, 186) :
		pref.darkblueTheme ? RGB(20, 33, 48) :
		pref.redTheme ? RGB(82, 19, 19) :
		pref.creamTheme ? RGB(220, 220, 220) :
		pref.nblueTheme ? RGB(50, 50, 50) :
		pref.ngreenTheme ? RGB(50, 50, 50) :
		pref.nredTheme ? RGB(50, 50, 50) :
		pref.ngoldTheme ? RGB(50, 50, 50) : '';

	col.transportEllipseHovered =
		pref.whiteTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(160, 160, 160) : RGB(170, 170, 170) : RGB(180, 180, 180) :
		pref.blackTheme ? RGB(120, 120, 120) :
		pref.rebornTheme || pref.randomTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(76, 175, 255) :
		pref.darkblueTheme ? RGB(50, 90, 150) :
		pref.redTheme ? RGB(204, 45, 45) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 8, 8) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	col.transportEllipseDown = col.transportEllipseHovered;

	col.transportEllipseBg =
		pref.whiteTheme ? (pref.themeStyleBlend || pref.themeStyleBlend2) && fb.IsPlaying ? RGB(230, 230, 230) : RGB(255, 255, 255) :
		pref.blackTheme ? (pref.themeStyleBlend || pref.themeStyleBlend2) && fb.IsPlaying ? col.progressBar : RGB(35, 35, 35) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : RGB(255, 255, 255) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme ? RGB(35, 35, 35) :
		pref.ngreenTheme ? RGB(35, 35, 35) :
		pref.nredTheme ? RGB(35, 35, 35) :
		pref.ngoldTheme ? RGB(35, 35, 35) : '';

	col.transportThemeStyleBg =
		pref.whiteTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(225, 225, 225) : '' :
		pref.blackTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleTransportButtons === 'bevel' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
					RGBtoRGBA(col.superDarkAccent, 100) :
				pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'inner' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(220, 220, 220) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
					RGBtoRGBA(col.superDarkAccent, 120) :
				pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(225, 225, 225) :
			pref.themeStyleTransportButtons === 'emboss' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(225, 225, 225) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
					RGBtoRGBA(col.superDarkAccent, 40) :
				pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(225, 225, 225) : '' :
		pref.blueTheme ?
			pref.themeStyleTransportButtons === 'bevel' ? pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(5, 90, 160) : RGB(5, 100, 180) :
			pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(10, 110, 190) : pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(5, 100, 180) : RGB(17, 100, 180) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(8, 110, 190) : RGB(11, 132, 224) : '' :
		pref.darkblueTheme ?
			pref.themeStyleTransportButtons === 'bevel' ? pref.themeStyleBevel ? RGB(22, 40, 60) : RGB(25, 45, 70) :
			pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(22, 40, 60) : pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(25, 45, 70) : RGB(25, 45, 70) :
			pref.themeStyleTransportButtons === 'emboss' ? RGB(27, 55, 90) : '' :
		pref.redTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(100, 20, 20) : RGB(100, 20, 20) :
			pref.themeStyleTransportButtons === 'emboss' ? RGB(140, 25, 25) : '' :
		pref.creamTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(212, 205, 200) : RGB(229, 222, 216) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(240, 225, 210) : RGB(240, 225, 210) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(0, 0, 0) : RGB(0, 0, 0) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) : '' : '';

	col.transportThemeStyleTop =
		pref.whiteTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) : '' :
		pref.blackTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
					pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 220) : RGBtoRGBA(col.superLightAccent, 230) :
				pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTransportButtons === 'emboss' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) :
					pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 100) : RGBtoRGBA(col.superLightAccent, 100) : '' :
				pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
		pref.blueTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(7, 135, 240) : RGB(7, 130, 230) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(12, 138, 235) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(10, 115, 200) : RGB(12, 138, 235) : '' :
		pref.darkblueTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(38, 70, 110) : RGB(38, 70, 110) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(35, 70, 115) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(35, 70, 115) : RGB(35, 70, 115) : '' :
		pref.redTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(160, 32, 32) : RGB(160, 32, 32) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(166, 30, 30) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(166, 30, 30) : RGB(166, 30, 30) : '' :
		pref.creamTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '' : '';

	col.transportThemeStyleBottom =
		pref.whiteTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(215, 215, 215) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '' :
		pref.blackTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleTransportButtons === 'bevel' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) :
					pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 30) : RGBtoRGBA(col.superDarkAccent, 20) :
				pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'inner' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) :
					pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 30) : RGBtoRGBA(col.superDarkAccent, 40) :
				pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'emboss' ?
				isColored ?
					pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) :
					pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
					pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 60) :
				pref.themeStyleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '' :
		pref.blueTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(5, 85, 150) : RGB(5, 100, 180) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(6, 95, 160) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(4, 68, 120) : RGB(5, 100, 175) : '' :
		pref.darkblueTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(15, 25, 40) : RGB(18, 30, 50) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(20, 36, 50) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(20, 36, 50) : RGB(20, 36, 50) : '' :
		pref.redTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(66, 13, 13) : RGB(77, 15, 15) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel && !pref.themeStyleGradient2 ? RGB(80, 15, 15) : pref.themeStyleGradient2 || pref.themeStyleGradient2 && pref.themeStyleBevel ? RGB(54, 10, 10) : RGB(80, 15, 15) : '' :
		pref.creamTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(190, 190, 190) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(210, 210, 210) : RGB(225, 225, 225) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(0, 0, 0) : RGB(0, 0, 0) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) : '' : '';

	col.progressBar =
		pref.whiteTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGB(245, 245, 245) : RGB(220, 220, 220) :
			pref.themeStyleBevel ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(235, 235, 235) : RGB(200, 200, 200) :
			(pref.themeStyleBlend || pref.themeStyleBlend2) && fb.IsPlaying ? RGB(240, 240, 240) : RGB(220, 220, 220) :
		pref.blackTheme ?
			pref.themeStyleProgressBar === 'bevel' ? RGB(36, 36, 36) :
			pref.themeStyleProgressBar === 'inner' ? RGB(37, 37, 37) :
			RGB(35, 35, 35) :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleBevel ? shadeColor(col.accent, 20) : col.accent : RGB(220, 220, 220) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGB(240, 240, 240) : RGB(240, 240, 240) :
			pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : '';

	col.progressBarStreaming =
		pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ? RGB(207, 0, 5) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 238, 255) :
		pref.ngreenTheme ? RGB(0, 255, 0) :
		pref.nredTheme ? RGB(255, 0, 0) :
		pref.ngoldTheme ? RGB(255, 242, 3) : '';

	col.themeStyleProgressBar =
		pref.whiteTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '' :
		pref.blackTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 100) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleProgressBar === 'bevel' ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
				pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 40) :
			pref.themeStyleProgressBar === 'inner' ?
				pref.themeStyleRebornWhite ? pref.themeStyleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) :
				pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 100) :
				pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 60) : '' :
		pref.blueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '' :
		pref.darkblueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '' :
		pref.redTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '' :
		pref.creamTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '' : '';

	col.themeStyleProgressBarLineTop =
		pref.whiteTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 40) : pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 50) : pref.themeStyleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 20) : '' :
		pref.blackTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) : pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) : pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 50) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleProgressBar === 'bevel' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superLightAccent, 255) : RGBtoRGBA(col.superDarkAccent, 80) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 35) : RGBtoRGBA(col.superDarkAccent, 60) :
													 pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superLightAccent, 255) : RGBtoRGBA(col.superDarkAccent, 15) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superDarkAccent, 30) :
			pref.themeStyleProgressBar === 'inner' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 40) : RGBtoRGBA(col.superDarkAccent, 70) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 75) : RGBtoRGBA(col.superDarkAccent, 100) :
													 pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 10) : RGBtoRGBA(col.superDarkAccent, 40) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superDarkAccent, 50) : '' :
		pref.blueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 40) : pref.themeStyleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 20) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) : pref.themeStyleBevel ? RGBA(0, 0, 0, 45) : RGBA(0, 0, 0, 15) : '' :
		pref.darkblueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 160) : RGBA(0, 0, 0, 80) : pref.themeStyleBevel ? RGBA(0, 0, 0, 160) : RGBA(0, 0, 0, 80) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) : pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) : '' :
		pref.redTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) : pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 70) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 80) : RGBA(0, 0, 0, 60) : pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) : '' :
		pref.creamTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 25) : pref.themeStyleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 10) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 30) : pref.themeStyleBevel ? RGBA(0, 0, 0, 15) : RGBA(0, 0, 0, 10) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) : '';

	col.themeStyleProgressBarLineBottom =
		pref.whiteTheme ?
			pref.themeStyleProgressBar === 'bevel' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 160) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
													 pref.themeStyleBevel ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 100) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 220) :
			pref.themeStyleProgressBar === 'inner' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 100) : RGBA(255, 255, 255, 140) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 140) : RGBA(255, 255, 255, 255) :
													 pref.themeStyleBevel ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 140) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) : '' :
		pref.blackTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 25) : pref.themeStyleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 10) : pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 15) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleProgressBar === 'bevel' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superLightAccent, 20) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 25) : RGBtoRGBA(col.superLightAccent, 40) :
				 									 pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 25) : RGBtoRGBA(col.superLightAccent, 20) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 70) : RGBtoRGBA(col.superLightAccent, 30) :
			pref.themeStyleProgressBar === 'inner' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 25) : RGBtoRGBA(col.superLightAccent, 20) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 40) : RGBtoRGBA(col.superLightAccent, 25) :
				 									 pref.themeStyleBevel ? isNotColored ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superLightAccent, 25) : isNotColored ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superLightAccent, 30) : '' :
		pref.blueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(10, 125, 210) : RGB(10, 130, 220) : pref.themeStyleBevel ? RGB(10, 125, 210) : RGB(10, 130, 220) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(10, 130, 220) : RGB(12, 138, 235) : pref.themeStyleBevel ? RGB(10, 130, 220) : RGB(12, 138, 235) : '' :
		pref.darkblueTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(30, 62, 102) : RGB(30, 62, 102) : pref.themeStyleBevel ? RGB(30, 62, 102) : RGB(30, 62, 102) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(30, 62, 102) : RGB(30, 62, 102) : pref.themeStyleBevel ? RGB(30, 62, 102) : RGB(30, 62, 102) : '' :
		pref.redTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(145, 28, 28) : RGB(145, 28, 28) : pref.themeStyleBevel ? RGB(145, 28, 28) : RGB(145, 28, 28) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGB(158, 30, 30) : RGB(145, 28, 28) : pref.themeStyleBevel ? RGB(158, 30, 30) : RGB(145, 28, 28) : '' :
		pref.creamTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) : pref.themeStyleBevel ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 140) : RGBA(0, 0, 0, 15) : pref.themeStyleBevel ? RGBA(255, 255, 255, 120) : RGBA(0, 0, 0, 10) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 20) : pref.themeStyleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 20) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 20) : pref.themeStyleBevel ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 25) : RGBA(0, 0, 0, 100) : '';

	col.progressBarFrame =
		pref.whiteTheme ? pref.themeStyleBevel ? RGB(180, 180, 180) : '' :
		pref.blackTheme ? pref.themeStyleBevel ? RGB(0, 0, 0) : '' :
		pref.blueTheme ? RGB(22, 107, 186) :
		pref.darkblueTheme ? RGB(22, 37, 54) :
		pref.redTheme ? RGB(92, 21, 21) :
		pref.creamTheme ? RGB(230, 230, 230) : '';

	col.progressBarFill =
		pref.whiteTheme ? pref.themeStyleBevel ? shadeColor(col.primary, 5) : col.primary :
		pref.blackTheme ? col.primary :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	col.themeStyleProgressBarFill =
		pref.whiteTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.blackTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 80) : '' : col.primary :
		pref.blueTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.darkblueTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.redTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.creamTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 80) : '' : '';

	col.volumeBar =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(35, 35, 35) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.extraLightAccent : RGB(255, 255, 255) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : '';

	col.themeStyleVolumeBar =
		pref.whiteTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 30) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 40) : '' :
		pref.blackTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '' :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 40) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 60) : '' :
		pref.blueTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) : '' :
		pref.darkblueTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 60) : '' :
		pref.redTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 40) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 50) : '' :
		pref.creamTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 20) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) : '' : '';

	col.volumeBarFill =
		pref.whiteTheme || pref.blackTheme ? col.primary :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.accent : col.primary :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(65, 135, 80) : RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

	col.themeStyleVolumeBarFill =
		pref.whiteTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.blackTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.rebornTheme || pref.randomTheme ? isColored ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 80) : '' : col.primary :
		pref.blueTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.darkblueTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.redTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100) : '' :
		pref.creamTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '' :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 80) : '' : '';

	col.volumeBarFrame =
		pref.whiteTheme ? RGB(220, 220, 220) :
		pref.blackTheme ? RGB(60, 60, 60) :
		pref.rebornTheme || pref.randomTheme ? isColored ? col.accent : RGB(220, 220, 220) :
		pref.blueTheme ? RGB(22, 107, 186) :
		pref.darkblueTheme ? RGB(20, 33, 48) :
		pref.redTheme ? RGB(82, 19, 19) :
		pref.creamTheme ? RGB(220, 220, 220) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(50, 50, 50) : '';

	col.shadow =
		pref.whiteTheme ? pref.themeStyleBlackAndWhite2 ? RGBA(0, 0, 0, 240) : RGBA(0, 0, 0, 25) :
		pref.blackTheme ?
			pref.themeStyleBevel && !pref.themeStyleBlackReborn ? RGBA(0, 0, 0, 240) :
			pref.themeStyleAlternative ? RGBA(0, 0, 0, 100) :
			pref.themeStyleAlternative2 ? RGBA(0, 0, 0, 240) :
			pref.themeStyleBlackReborn ? RGBA(0, 0, 0, 120) :
			RGBA(0, 0, 0, 120) :
		pref.rebornTheme || pref.randomTheme ?
			pref.themeStyleRebornBlack ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
			RGBA(0, 0, 0, 35) :
		pref.blueTheme ? RGBA(0, 0, 0, 25) :
		pref.darkblueTheme ? RGBA(0, 0, 0, 75) :
		pref.redTheme ? RGBA(0, 0, 0, 75) :
		pref.creamTheme ? RGBA(0, 0, 0, 25) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) : '';

	// Dynamically adjust transport buttons theme styles when using White theme/Reborn White with theme style Blend
	if (((pref.whiteTheme || pref.themeStyleRebornWhite) && (pref.themeStyleBlend || pref.themeStyleBlend2)) && fb.IsPlaying && !isStreaming && !isPlayingCD) {
		switch (true) {
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) > 500: col.transportThemeStyleBottom = RGB(175, 175, 175); break;
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) > 300: col.transportThemeStyleBottom = RGB(180, 180, 180); break;
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) > 150: col.transportThemeStyleBottom = RGB(185, 185, 185); break;
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) >  75: col.transportThemeStyleBottom = RGB(190, 190, 190); break;
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) >  50: col.transportThemeStyleBottom = RGB(195, 195, 195); break;
			case colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) >   0: col.transportThemeStyleBottom = RGB(200, 200, 200); break;
		}
	}
	// Dynamically adjust progress bar background color when using White theme or Reborn white with theme style Blend
	if ((pref.whiteTheme || pref.themeStyleRebornWhite) && (pref.themeStyleBlend || pref.themeStyleBlend) && fb.IsPlaying) {
		if (colorDistance(RGB(imgBrightness, imgBrightness, imgBrightness), col.bg, true) < 180) {
			if (settings.showThemeLog) console.log('>>> Blended album art image is too close to col.bg. Adjusting progress bar');
			col.progressBar = pref.themeStyleBevel ? tintColor(col.progressBar, 10) : shadeColor(col.progressBar, 10);
		}
		if (!pref.themeStyleBlackAndWhiteReborn && colorDistance(col.progressBarFill, col.progressBar, true) < 150) {
			if (settings.showThemeLog) console.log('>>> Progress bar fill color is too close to progress bar background. Adjusting progress bar fill');
			col.progressBarFill = pref.themeStyleBevel ? shadeColor(col.progressBarFill, 20) : shadeColor(col.progressBarFill, 10);
		}
	}
	// Dynamically adjust transport buttons theme styles progress bar, lines, gradient and shadow when using Reborn/Random theme or theme style Black Reborn
	if ((pref.rebornTheme || pref.randomTheme) && fb.IsPlaying && !isStreaming && !isPlayingCD) {
		switch (true) {
			case colBrightness > 150:
				col.progressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? tintColor(col.progressBarFill, 10) : tintColor(col.progressBarFill, 10) : col.progressBarFill;
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 35) : RGBtoRGBA(col.maxDarkAccent, 30) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 50) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 10) : RGBtoRGBA(col.superDarkAccent, 10) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 95) : RGBtoRGBA(col.superDarkAccent, 90) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 45) : RGBtoRGBA(col.superDarkAccent, 40) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 65) : RGBtoRGBA(col.superLightAccent, 70) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 60) : RGBtoRGBA(col.superLightAccent, 65) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 60) : RGBtoRGBA(col.superLightAccent, 60) : '';
				col.themeStyleGradient = col.darkAccent;
				col.themeStyleGradient2 = col.darkAccent;
				col.shadow = RGBA(0, 0, 0, 35);
				break;
			case colBrightness > 125:
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 45) : RGBtoRGBA(col.maxDarkAccent, 40) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 70) : RGBtoRGBA(col.superDarkAccent, 60) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 15) : RGBtoRGBA(col.superDarkAccent, 15) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 90) : RGBtoRGBA(col.superDarkAccent, 85) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 45) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 55) : RGBtoRGBA(col.superLightAccent, 65) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 45) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 45) : '';
				col.themeStyleGradient = col.darkAccent;
				col.themeStyleGradient2 = col.darkAccent;
				col.shadow = RGBA(0, 0, 0, 40);
				break;
			case colBrightness > 100:
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 50) : RGBtoRGBA(col.maxDarkAccent, 45) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 80) : RGBtoRGBA(col.superDarkAccent, 70) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 25) : RGBtoRGBA(col.superDarkAccent, 20) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 100) : RGBtoRGBA(col.superDarkAccent, 90) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 55) : RGBtoRGBA(col.superDarkAccent, 50) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 45) : RGBtoRGBA(col.superLightAccent, 50) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 35) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 45) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 40) : '';
				col.themeStyleGradient = col.extraDarkAccent;
				col.themeStyleGradient2 = col.extraDarkAccent;
				col.shadow = RGBA(0, 0, 0, 45);
				break;
			case colBrightness > 75:
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 55) : RGBtoRGBA(col.maxDarkAccent, 50) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 90) : RGBtoRGBA(col.superDarkAccent, 80) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 35) : RGBtoRGBA(col.superDarkAccent, 30) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 55) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 40) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 30) : RGBtoRGBA(col.superLightAccent, 35) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : '';
				col.shadow = RGBA(0, 0, 0, 50);
				col.themeStyleGradient = col.extraDarkAccent;
				col.themeStyleGradient2 = col.extraDarkAccent;
				break;
			case colBrightness > 50:
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 65) : RGBtoRGBA(col.maxDarkAccent, 60) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 80) : RGBtoRGBA(col.superDarkAccent, 70) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 130) : RGBtoRGBA(col.superDarkAccent, 120) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) : '';
				col.shadow = RGBA(0, 0, 0, 55);
				col.themeStyleGradient = col.superDarkAccent;
				col.themeStyleGradient2 = col.superDarkAccent;
				break;
			case colBrightness > 0:
				col.themeStyleProgressBarFill =	pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 75) : RGBtoRGBA(col.maxDarkAccent, 70) : '';
				col.themeStyleProgressBarLineTop =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 170) : RGBtoRGBA(col.superDarkAccent, 160) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 160) : RGBtoRGBA(col.superDarkAccent, 140) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 160) : RGBtoRGBA(col.superDarkAccent, 150) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 150) : RGBtoRGBA(col.superDarkAccent, 140) : '';
				col.themeStyleProgressBarLineBottom =
					pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) :
					pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 15) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 15) : '';
				col.shadow = RGBA(0, 0, 0, 70);
				col.themeStyleGradient = col.superDarkAccent;
				col.themeStyleGradient2 = col.superDarkAccent;
				break;
		}
	}

	// Reborn/Random theme
	if ((pref.rebornTheme || pref.randomTheme) && isColored) {
		if (colBrightness > (pref.themeStyleBlend || pref.themeStyleBlend2 ? 150 : 130) || (pref.themeStyleBlend || pref.themeStyleBlend2) && imgBrightness > 190) {
			// Main
			col.artist = col.superDarkAccent;
			col.now_playing = col.superDarkAccent;

			// Top menu buttons
			col.menuTextNormal = col.superDarkAccent;
			col.menuTextHovered = col.maxDarkAccent;
			col.menuTextDown = col.menuTextHovered;
			col.menuRectNormal =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 30) :
				col.darkAccent;
			col.menuRectHovered =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 40) : RGBtoRGBA(col.superDarkAccent, 30) :
				col.darkAccent;
			col.menuRectDown = col.menuRectHovered;
			col.menuBgColor =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 50) :
				pref.themeStyleTopMenuButtons !== 'default' ? col.middleAccent : col.extraLightAccent;

			// Transport buttons
			col.transportIconNormal =
				pref.themeStyleTransportButtons === 'emboss' || pref.themeStyleTransportButtons === 'minimal' ? col.superDarkAccent : col.veryDarkAccent;
			col.transportIconHovered = col.maxDarkAccent;
			col.transportIconDown = col.transportIconHovered;
			col.transportEllipseNormal = col.accent;
			col.transportEllipseHovered = col.darkAccent;
			col.transportEllipseDown = col.transportEllipseHovered;

			if ((pref.themeStyleBlend || pref.themeStyleBlend2) && imgBrightness && !pref.themeStyleRandomDark > 200) {
				col.transportEllipseNormal = col.lightMiddleAccent;
				col.progressBar = col.middleAccent;
				col.progressBarFill = col.veryLightAccent;
			}
		}
		else if (colBrightness < (pref.themeStyleBlend || pref.themeStyleBlend2 ? 151 : 131)) {
			// Main
			col.artist = col.maxLightAccent;
			col.now_playing = col.maxLightAccent;

			// Top menu buttons
			col.menuTextNormal = col.superLightAccent;
			col.menuTextHovered = col.maxLightAccent;
			col.menuTextDown = col.menuTextHovered;
			col.menuRectNormal =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 50) :
				col.extraLightAccent;
			col.menuRectHovered =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 50) :
				col.extraLightAccent;
			col.menuRectDown = col.menuRectHovered;
			col.menuBgColor =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 50) :
				pref.themeStyleTopMenuButtons !== 'default' ? col.middleAccent : col.extraDarkAccent;

			// Transport buttons
			col.transportIconNormal =
				pref.themeStyleTransportButtons === 'emboss' ? col.superDarkAccent :
				pref.themeStyleTransportButtons === 'minimal' ? col.superLightAccent : col.superDarkAccent;
			col.transportIconHovered = col.maxDarkAccent;
			col.transportIconDown = col.transportIconHovered;
			col.transportEllipseNormal = col.accent;
			col.transportEllipseHovered = col.darkAccent;
			col.transportEllipseDown = col.transportEllipseHovered;
		}
	}

	// Theme style Reborn white
	if (pref.themeStyleRebornWhite) {
		// Playlist
		g_pl_colors.background = !fb.IsPlaying ? RGB(255, 255, 255) : g_pl_colors.background;

		// Main
		col.artist = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(40, 40, 40) : RGB(80, 80, 80);
		col.now_playing = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(50, 50, 50) : RGB(100, 100, 100);
		col.bg = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(255, 255, 255) : RGB(245, 245, 245);

		// Top menu buttons
		col.menuTextNormal = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(50, 50, 50) : RGB(100, 100, 100);
		col.menuTextHovered = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(0, 0, 0) : RGB(80, 80, 80);
		col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal =
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);
		col.menuRectHovered =
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor =
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(250, 250, 250) : RGB(255, 255, 255) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(250, 250, 250) : RGB(235, 235, 235) :
			RGB(255, 255, 255);

		// Transport buttons
		col.transportIconNormal = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(80, 80, 80) : RGB(100, 100, 100);
		col.transportIconHovered = RGB(80, 80, 80);
		col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = RGB(220, 220, 220);
		col.transportEllipseHovered = RGB(200, 200, 200);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(225, 225, 225) : RGB(255, 255, 255);

		// Progress bar
		col.progressBar = pref.themeStyleBevel ? RGB(225, 225, 225) : RGB(220, 220, 220);
		col.progressBarFill = shadeColor(col.primary, 5);
		col.themeStyleProgressBarLineTop =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) : pref.themeStyleBevel ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 0) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 50) : pref.themeStyleBevel ? RGBA(0, 0, 0, 10) : RGBA(0, 0, 0, 20) : '';
		col.themeStyleProgressBarLineBottom =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 120) : RGBA(255, 255, 255, 255) : pref.themeStyleBevel ? RGBA(255, 255, 255, 100) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 255) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 25) : pref.themeStyleBevel ? RGBA(0, 0, 0, 5) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 80) : RGBA(255, 255, 255, 255) : '';

		// Volume bar
		col.volumeBar = RGB(255, 255, 255);
		col.volumeBarFill = col.primary;
		col.volumeBarFrame = RGB(220, 220, 220);
	}

	// Theme style Reborn black
	if (pref.themeStyleRebornBlack) {
		// Playlist
		g_pl_colors.background = !fb.IsPlaying ? RGB(20, 20, 20) : g_pl_colors.background;
		g_pl_colors.playlist_mgr_text_normal = !fb.IsPlaying ? pref.autoHidePLM ? g_pl_colors.background : RGB(180, 180, 180) : g_pl_colors.playlist_mgr_text_normal;
		g_pl_colors.playlist_mgr_text_hovered = !fb.IsPlaying ? pref.autoHidePLM ? RGB(200, 200, 200) : RGB(240, 240, 240) : g_pl_colors.playlist_mgr_text_hovered;
		g_pl_colors.playlist_mgr_text_pressed = !fb.IsPlaying ? pref.autoHidePLM ? RGB(240, 240, 240) : RGB(180, 180, 180) : g_pl_colors.playlist_mgr_text_pressed;
		g_pl_colors.group_title = !fb.IsPlaying ? g_pl_colors.group_title : g_pl_colors.group_title;
		g_pl_colors.group_title_selected = !fb.IsPlaying ? g_pl_colors.group_title : g_pl_colors.group_title_selected;
		g_pl_colors.artist_normal = !fb.IsPlaying ? RGB(220, 220, 220) : g_pl_colors.artist_normal;
		g_pl_colors.album_normal = !fb.IsPlaying ? RGB(200, 200, 200) : g_pl_colors.album_normal;
		g_pl_colors.info_normal = !fb.IsPlaying ? RGB(200, 200, 200) : g_pl_colors.info_normal;
		g_pl_colors.date_normal = !fb.IsPlaying ? RGB(220, 220, 220) : g_pl_colors.date_normal;
		g_pl_colors.line_normal = !fb.IsPlaying ? RGB(45, 45, 45) : g_pl_colors.line_normal;
		g_pl_colors.title_selected = !fb.IsPlaying ? RGB(255, 255, 255) : g_pl_colors.title_selected;
		g_pl_colors.title_normal = !fb.IsPlaying ? RGB(200, 200, 200) : g_pl_colors.title_normal;
		g_pl_colors.title_hovered = !fb.IsPlaying ? RGB(255, 255, 255) : g_pl_colors.title_selected;
		g_pl_colors.row_alternate = !fb.IsPlaying ? RGB(25, 25, 25) : g_pl_colors.row_alternate;
		g_pl_colors.row_focus_selected = !fb.IsPlaying ? RGB(45, 45, 45) : g_pl_colors.row_focus_selected;
		g_pl_colors.row_focus_normal = !fb.IsPlaying ? RGB(80, 80, 80) : g_pl_colors.row_focus_normal;
		g_pl_colors.row_sideMarker = !fb.IsPlaying ? col.primary : g_pl_colors.row_sideMarker;
		g_pl_colors.row_selection_frame = !fb.IsPlaying ? g_pl_colors.row_focus_selected : g_pl_colors.row_selection_frame;
		g_pl_colors.row_selection_frame_cropped = !fb.IsPlaying ? g_pl_colors.row_focus_selected : g_pl_colors.row_selection_frame_cropped;
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		g_theme.colors.panel_line = !fb.IsPlaying ? RGB(45, 45, 45) : g_theme.colors.panel_line;
		g_theme.colors.panel_line_selected = !fb.IsPlaying ? RGB(0, 0, 0) : g_theme.colors.panel_line_selected;
		g_theme.colors.panel_text_normal = !fb.IsPlaying ? RGB(200, 200, 200) : g_theme.colors.panel_text_normal;

		// Main
		col.artist = RGB(240, 240, 240);
		col.now_playing = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(220, 220, 220) : RGB(200, 200, 200);
		col.bg = pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(25, 25, 25);

		// Top menu buttons
		col.menuTextNormal = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(220, 220, 220) : RGB(180, 180, 180);
		col.menuTextHovered = RGB(255, 255, 255);
		col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal = pref.themeStyleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) : RGB(60, 60, 60);
		col.menuRectHovered =
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(0, 0, 0) : RGB(0, 0, 0) :
			RGB(120, 120, 120);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor =
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(45, 45, 45) :
			col.extraDarkAccent;

		// Transport Buttons
		col.transportIconNormal = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(180, 180, 180) : RGB(160, 160, 160);
		col.transportIconHovered = RGB(255, 255, 255);
		col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = RGB(60, 60, 60);
		col.transportEllipseHovered = RGB(120, 120, 120);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(50, 50, 50) : RGB(35, 35, 35);
		col.transportThemeStyleBg =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) : '';
		col.transportThemeStyleTop =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';
		col.transportThemeStyleBottom =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) : '';

		// Progress bar
		col.progressBar = RGB(50, 50, 50);
		col.progressBarFill = col.primary;
		col.themeStyleProgressBarLineTop =
			pref.themeStyleProgressBar === 'bevel' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
				 pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
			pref.themeStyleProgressBar === 'inner' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) :
				 pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';
		col.themeStyleProgressBarLineBottom =
			pref.themeStyleProgressBar === 'bevel' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 30) :
				 pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
			pref.themeStyleProgressBar === 'inner' ?
				 pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 30) :
				 pref.themeStyleBevel ? RGBA(255, 255, 255, 45) : pref.themeStyleBlend || pref.themeStyleBlend2 ? RGBA(255, 255, 255, 25) : colBrightness < 50 ? RGBA(255, 255, 255, 15) : RGBA(255, 255, 255, 40) : '';

		// Volume bar
		col.volumeBar = RGB(35, 35, 35);
		col.volumeBarFill = col.primary;
		col.volumeBarFrame = RGB(60, 60, 60);
	}

	// Theme style Alternative
	if (pref.themeStyleAlternative) {
		// Playlist
		g_pl_colors.background =
			pref.whiteTheme ? RGB(245, 245, 245) :
			pref.blackTheme ? tintColor(g_pl_colors.background, 6) :
			pref.rebornTheme || pref.randomTheme ? shadeColor(g_pl_colors.background, 5) :
			pref.blueTheme ? RGB(8, 110, 190) :
			pref.darkblueTheme ? RGB(17, 35, 57) :
			pref.redTheme ? RGB(106, 18, 18) :
			pref.creamTheme ? RGB(255, 247, 240) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? tintColor(g_pl_colors.background, 8) : '';

		g_pl_colors.playlist_mgr_text_normal = g_pl_colors.background;
		// g_pl_colors.line_normal = tintColor(g_pl_colors.line_normal, 3);
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		// g_theme.colors.panel_line = tintColor(g_theme.colors.panel_line, 3);

		g_pl_colors.header_nowplaying_bg =
			pref.blueTheme ? RGB(20, 120, 205) :
			pref.darkblueTheme ? RGB(18, 42, 70) :
			pref.redTheme ? RGB(130, 25, 25) :
			g_pl_colors.header_nowplaying_bg;
		g_pl_colors.header_compact_nowplaying_bg =
			pref.blueTheme ? RGB(20, 120, 205) :
			pref.darkblueTheme ? RGB(18, 42, 70) :
			pref.redTheme ? RGB(130, 25, 25) :
			g_pl_colors.header_nowplaying_bg;
		g_pl_colors.row_nowplaying_bg =
			pref.blueTheme ? RGB(20, 120, 205) :
			pref.darkblueTheme ? RGB(18, 42, 70) :
			pref.redTheme ? RGB(130, 25, 25) :
			g_pl_colors.row_nowplaying_bg;

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

		// Biography
		uiBio.col.bg = g_pl_colors.background;

		// Main
		col.info_text = col.now_playing;
		col.bg =
			pref.whiteTheme ? RGB(255, 255, 255) :
			pref.blackTheme ? tintColor(col.bg, 4) :
			pref.rebornTheme || pref.randomTheme ? tintColor(col.bg, 8) :
			pref.blueTheme ? RGB(20, 120, 205) :
			pref.darkblueTheme ? RGB(18, 42, 70) :
			pref.redTheme ? RGB(130, 25, 25) :
			pref.creamTheme ? RGB(255, 255, 255) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : '';
		col.detailsBg = g_pl_colors.background;
		col.uiHackFrame = col.bg;

		// Transport Buttons
		col.transportEllipseNormal =
			pref.blackTheme ? shadeColor(col.transportEllipseNormal, 6) :
			pref.redTheme ? RGB(106, 18, 18) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? shadeColor(col.transportEllipseNormal, 90) :
			tintColor(col.transportEllipseNormal, 6);
		col.transportEllipseHovered = tintColor(col.transportEllipseHovered, 6);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg =
			pref.whiteTheme ? tintColor(col.transportEllipseBg, 100) :
			pref.blackTheme ? tintColor(col.transportEllipseBg, 4) :
			pref.rebornTheme || pref.randomTheme ? tintColor(col.transportEllipseBg, 0) :
			pref.blueTheme ? tintColor(col.transportEllipseBg, 6) :
			pref.darkblueTheme ? tintColor(col.transportEllipseBg, 0) :
			pref.redTheme ? RGB(158, 30, 30) :
			pref.creamTheme ? g_pl_colors.background :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? shadeColor(col.transportEllipseBg, 20) :
			shadeColor(col.transportEllipseBg, 10);
		col.transportThemeStyleBg =
			pref.blackTheme ? tintColor(col.transportThemeStyleBg, 4) :
			pref.blueTheme ? tintColor(col.transportThemeStyleBg, 6) :
			pref.darkblueTheme ? tintColor(col.transportThemeStyleBg, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleBg, 2) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? shadeColor(col.transportThemeStyleBg, 6) :
			tintColor(col.transportThemeStyleBg, 6);
		col.transportThemeStyleTop =
			pref.blackTheme ? shadeColor(col.transportThemeStyleTop, 6) :
			pref.blueTheme ? shadeColor(col.transportThemeStyleTop, 6) :
			pref.darkblueTheme ? shadeColor(col.transportThemeStyleTop, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleTop, pref.themeStyleTransportButtons === 'emboss' ? 6 : 2) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? shadeColor(col.transportThemeStyleTop, 6) :
			tintColor(col.transportThemeStyleTop, 6);
		col.transportThemeStyleBottom =
			pref.blackTheme ? shadeColor(col.transportThemeStyleBottom, 0) :
			pref.blueTheme ? shadeColor(col.transportThemeStyleBottom, 6) :
			pref.darkblueTheme ? shadeColor(col.transportThemeStyleBottom, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleBottom, pref.themeStyleTransportButtons === 'emboss' ? 6 : 2) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? shadeColor(col.transportThemeStyleBottom, 6) :
			tintColor(col.transportThemeStyleBottom, 6);

		// Progress bar
		col.progressBar =
			pref.whiteTheme ? pref.themeStyleBevel ? tintColor(col.progressBar, 60) : tintColor(col.progressBar, 40) :
			pref.blackTheme ? tintColor(col.progressBar, 2) :
			pref.rebornTheme || pref.randomTheme ? fb.IsPlaying ? g_pl_colors.background : col.progressBar :
			pref.blueTheme ? tintColor(col.progressBar, 2) :
			pref.darkblueTheme ? tintColor(col.progressBar, 0) :
			pref.redTheme ? RGB(158, 30, 30) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBevel ? shadeColor(col.progressBar, 60) : shadeColor(col.progressBar, 35) :
			g_pl_colors.background;

		// Volume bar
		col.volumeBar = col.progressBar;
		col.volumeBarFill = col.progressBarFill;

		col.shadow =
			pref.rebornTheme || pref.randomTheme ? RGBA(0, 0, 0, 25) :
			pref.blueTheme ? col.shadow + RGBA(0, 0, 0, 25) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBA(0, 0, 0, 255) :
			col.shadow + RGBA(0, 0, 0, 10);

		// Dynamically adjust shadow opacity
		if ((pref.rebornTheme || pref.randomTheme || pref.themeStyleBlackReborn) && fb.IsPlaying && !isStreaming && !isPlayingCD) {
			switch (true) {
				case colBrightness > 150: col.shadow = RGBA(0, 0, 0,  45); break;
				case colBrightness > 125: col.shadow = RGBA(0, 0, 0,  50); break;
				case colBrightness > 100: col.shadow = RGBA(0, 0, 0,  60); break;
				case colBrightness >  75: col.shadow = RGBA(0, 0, 0,  75); break;
				case colBrightness >  50: col.shadow = RGBA(0, 0, 0, 100); break;
				case colBrightness >   0: col.shadow = RGBA(0, 0, 0, 120); break;
			}
		}
	}

	// Theme style Alternative 2
	if (pref.themeStyleAlternative2) {
		// Playlist
		g_pl_colors.background =
			pref.whiteTheme ? tintColor(g_pl_colors.background, 4) :
			pref.blackTheme ? tintColor(g_pl_colors.background, 3) :
			pref.rebornTheme || pref.randomTheme ? tintColor(g_pl_colors.background, 5) :
			pref.blueTheme ? RGB(20, 120, 205) :
			pref.darkblueTheme ? RGB(18, 42, 70) :
			pref.redTheme ? RGB(120, 22, 22) :
			pref.creamTheme ? RGB(255, 255, 255) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? tintColor(g_pl_colors.background, 6) : '';

		g_pl_colors.playlist_mgr_text_normal = g_pl_colors.background;
		// g_pl_colors.line_normal = tintColor(g_pl_colors.line_normal, 3);
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		// g_theme.colors.panel_line = tintColor(g_theme.colors.panel_line, 3);

		g_pl_colors.header_nowplaying_bg =
			pref.rebornTheme || pref.randomTheme ? pref.themeStyleBlend ? RGBtoRGBA(col.darkAccent, 60) : RGBtoRGBA(col.darkAccent, 40) :
			pref.redTheme ? RGB(140, 25, 25) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? tintColor(g_pl_colors.header_nowplaying_bg, 6) : tintColor(g_pl_colors.header_nowplaying_bg, 6) :
			g_pl_colors.header_nowplaying_bg;
		g_pl_colors.header_compact_nowplaying_bg =
			pref.rebornTheme || pref.randomTheme ? pref.themeStyleBlend ? RGBtoRGBA(col.darkAccent, 60) : RGBtoRGBA(col.darkAccent, 40) :
			pref.redTheme ? RGB(140, 25, 25) :
			g_pl_colors.header_nowplaying_bg;
		g_pl_colors.row_nowplaying_bg =
			pref.rebornTheme || pref.randomTheme ? pref.themeStyleBlend ? RGBtoRGBA(col.darkAccent, 60) : RGBtoRGBA(col.darkAccent, 40) :
			pref.redTheme ? RGB(140, 25, 25) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? pref.themeStyleBlend || pref.themeStyleBlend2 ? tintColor(g_pl_colors.row_nowplaying_bg, 6) : tintColor(g_pl_colors.row_nowplaying_bg, 6) :
			g_pl_colors.row_nowplaying_bg;

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

		// Biography
		uiBio.col.bg = g_pl_colors.background;

		// Main
		col.info_text = col.now_playing;
		col.bg =
			pref.whiteTheme ? shadeColor(col.bg, 6) :
			pref.blackTheme ? tintColor(col.bg, 10) :
			pref.rebornTheme || pref.randomTheme ? shadeColor(col.bg, 8) :
			pref.blueTheme ? RGB(8, 102, 180) :
			pref.darkblueTheme ? RGB(17, 35, 57) :
			pref.redTheme ? RGB(95, 15, 15) :
			pref.creamTheme ? RGB(255, 247, 240) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : '';
		col.detailsBg = g_pl_colors.background;
		col.uiHackFrame = col.bg;

		// Transport Buttons
		col.transportEllipseNormal =
			pref.blackTheme ? shadeColor(col.transportEllipseNormal, 60) :
			tintColor(col.transportEllipseNormal, 6);
		col.transportEllipseHovered = tintColor(col.transportEllipseHovered, 6);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg =
			pref.whiteTheme ? tintColor(col.transportEllipseBg, 100) :
			pref.blackTheme ? shadeColor(col.transportEllipseBg, 6) :
			pref.darkblueTheme ? tintColor(col.transportEllipseBg, 0) :
			pref.redTheme ? RGB(140, 25, 25) :
			tintColor(col.transportEllipseBg, 6);
		col.transportThemeStyleBg =
			pref.whiteTheme ? pref.themeStyleBevel ? shadeColor(col.transportThemeStyleBg, 10) : shadeColor(col.transportThemeStyleBg, 7) :
			pref.darkblueTheme ? tintColor(col.transportThemeStyleBg, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleBg, 2) :
			pref.creamTheme ? RGB(230, 230, 230) :
			tintColor(col.transportThemeStyleBg, 6);
		col.transportThemeStyleTop =
			pref.whiteTheme ? shadeColor(col.transportThemeStyleTop, 6) :
			pref.blueTheme ? tintColor(col.transportThemeStyleTop, 12) :
			pref.darkblueTheme ? tintColor(col.transportThemeStyleTop, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleTop, 2) :
			tintColor(col.transportThemeStyleTop, 6);
		col.transportThemeStyleBottom =
			pref.whiteTheme ? shadeColor(col.transportThemeStyleBottom, 6) :
			pref.blueTheme ? shadeColor(col.transportThemeStyleBottom, 10) :
			pref.darkblueTheme ? tintColor(col.transportThemeStyleBottom, 0) :
			pref.redTheme ? tintColor(col.transportThemeStyleBottom, 2) :
			tintColor(col.transportThemeStyleBottom, 6);

		// Progress bar
		col.progressBar =
			pref.whiteTheme ? pref.themeStyleBevel ? tintColor(col.progressBar, 60) : tintColor(col.progressBar, 100) :
			pref.blackTheme ? shadeColor(col.progressBar, 16) :
			pref.rebornTheme || pref.randomTheme ? g_pl_colors.background :
			pref.blueTheme ? g_pl_colors.background :
			pref.darkblueTheme ? g_pl_colors.row_nowplaying_bg :
			pref.redTheme ? tintColor(col.progressBar, 0) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? tintColor(col.progressBar, 3) :
			g_pl_colors.background;

		// Volume bar
		col.volumeBar = col.progressBar;
		col.volumeBarFill = col.progressBarFill;

		col.shadow =
			pref.blackTheme ? col.shadow - RGBA(0, 0, 0, 80) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? col.shadow :
			col.shadow + RGBA(0, 0, 0, 5);

	}
	// Theme style Black And White
	if (pref.themeStyleBlackAndWhite) {
		// Setup col.primary
		col.primary = RGB(255, 255, 255);
		// Playlist
		g_pl_colors.background = RGB(20, 20, 20);
		g_pl_colors.playlist_mgr_text_normal = pref.autoHidePLM ? g_pl_colors.background : RGB(180, 180, 180);
		g_pl_colors.playlist_mgr_text_hovered = pref.autoHidePLM ? RGB(200, 200, 200) : RGB(240, 240, 240);
		g_pl_colors.playlist_mgr_text_pressed = pref.autoHidePLM ? RGB(240, 240, 240) : RGB(180, 180, 180);
		g_pl_colors.group_title = RGB(220, 220, 220);
		g_pl_colors.group_title_selected = g_pl_colors.group_title;
		g_pl_colors.artist_normal = g_pl_colors.group_title;
		g_pl_colors.artist_playing = RGB(25, 25, 25);
		g_pl_colors.album_normal = RGB(200, 200, 200);
		g_pl_colors.album_playing = RGB(25, 25, 25);
		g_pl_colors.info_normal = RGB(200, 200, 200);
		g_pl_colors.info_playing = RGB(25, 25, 25);
		g_pl_colors.date_normal = RGB(220, 220, 220);
		g_pl_colors.date_playing = RGB(25, 25, 25);
		g_pl_colors.line_normal = pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
		g_pl_colors.line_playing = RGB(25, 25, 25);
		g_pl_colors.header_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255);
		g_pl_colors.header_nowplaying_bg = pref.themeStyleBlend ? RGBA(230, 230, 230, 200) : RGB(230, 230, 230);
		g_pl_colors.header_compact_marker = g_pl_colors.header_sideMarker;
		g_pl_colors.header_compact_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
		g_pl_colors.title_selected = RGB(255, 255, 255);
		g_pl_colors.title_playing = RGB(25, 25, 25);
		g_pl_colors.title_normal = RGB(200, 200, 200);
		g_pl_colors.title_hovered = g_pl_colors.title_selected;
		g_pl_colors.rating_color = RGB(255, 190, 0);
		g_pl_colors.count_normal = RGB(200, 200, 200);
		g_pl_colors.count_selected = g_pl_colors.title_selected;
		g_pl_colors.count_playing = g_pl_colors.title_playing;
		g_pl_colors.row_alternate = pref.themeStyleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
		g_pl_colors.row_focus_selected = pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
		g_pl_colors.row_focus_normal = RGB(80, 80, 80);
		g_pl_colors.row_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255);
		g_pl_colors.row_selection_frame = g_pl_colors.row_focus_selected;
		g_pl_colors.row_selection_frame_cropped = g_pl_colors.row_focus_selected;
		g_pl_colors.row_nowplaying_bg = pref.themeStyleBlend ? RGBA(230, 230, 230, 200) : RGB(230, 230, 230);
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		g_theme.colors.panel_line = pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
		g_theme.colors.panel_line_selected = RGB(0, 0, 0);
		g_theme.colors.panel_text_normal = RGB(200, 200, 200);
		g_pl_colors.ico_fore_colors_normal = RGB(200, 200, 200);
		g_pl_colors.ico_fore_colors_hovered = RGB(255, 255, 255);
		g_pl_colors.thumb_colors_normal = RGB(180, 180, 180);
		g_pl_colors.thumb_colors_hovered = RGB(255, 255, 255);
		g_pl_colors.thumb_colors_down = g_pl_colors.thumb_colors_hovered;

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
		ui.col.iconPlus = RGB(220, 220, 220);
		ui.col.iconPlus_h = RGB(255, 255, 255);
		ui.col.iconMinus_e = RGB(220, 220, 220);
		ui.col.iconMinus_c = ui.col.iconMinus_e;
		ui.col.iconMinus_h = RGB(255, 255, 255);
		ui.col.iconPlusbg = RGB(45, 45, 45);
		ui.col.iconPlusSel = RGB(255, 255, 255);
		ui.col.nowpBgSel = RGB(255, 255, 255);
		ui.col.text = RGB(200, 200, 200);
		ui.col.text_h = RGB(255, 255, 255);
		ui.col.textSel = RGB(255, 255, 255);
		ui.col.txt = ui.col.text;
		ui.col.txt_h = ui.col.text_h;
		ui.col.txt_box = RGB(200, 200, 200);
		ui.col.count = ui.col.text;
		ui.col.selBlend = ui.col.text;
		ui.col.lotBlend = ui.col.selBlend;
		ui.col.search = RGB(200, 200, 200);
		ui.col.searchBtn = RGB(255, 255, 255);
		ui.col.crossBtn = RGB(255, 255, 255);
		ui.col.filterBtn = RGB(220, 220, 220);
		ui.col.settingsBtn = RGB(220, 220, 220);
		ui.col.line = pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
		ui.col.s_line = ui.col.line;
		ui.col.nowPlayingBg = pref.themeStyleBlend ? RGBA(255, 255, 255, 200) : RGB(255, 255, 255);
		ui.col.sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(255, 255, 255);
		ui.col.selectionFrame = pref.themeStyleBlend ? RGB(80, 80, 80) : RGB(45, 45, 45);
		ui.col.selectionFrame2 = ui.col.sideMarker;
		ui.col.hoverFrame = ui.col.sideMarker;
		ui.col.sbarBtns = RGB(200, 200, 200);
		ui.col.sbarNormal = RGB(255, 255, 255);
		ui.col.sbarNormalR = getRed(ui.col.sbarNormal);
		ui.col.sbarNormalG = getGreen(ui.col.sbarNormal);
		ui.col.sbarNormalB = getBlue(ui.col.sbarNormal);
		ui.col.sbarHovered = RGB(255, 255, 255);
		ui.col.sbarHoveredR = getRed(ui.col.sbarHovered);
		ui.col.sbarHoveredG = getGreen(ui.col.sbarHovered);
		ui.col.sbarHoveredB = getBlue(ui.col.sbarHovered);
		ui.col.sbarDrag = RGB(255, 255, 255);
		ui.col.sbarDragR = getRed(ui.col.sbarDrag);
		ui.col.sbarDragG = getGreen(ui.col.sbarDrag);
		ui.col.sbarDragB = getBlue(ui.col.sbarDrag);

		// Biography
		uiBio.col.bg = g_pl_colors.background;

		uiBio.col.head =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? g_pl_colors.artist_playing :
			uiBio.blur.light ? RGB(65, 65, 65) :
			RGB(230, 230, 230);

		uiBio.col.text =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? g_pl_colors.title_normal :
			uiBio.blur.light ? RGB(60, 60, 60) :
			g_pl_colors.title_normal;

		uiBio.col.source =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? RGB(230, 230, 230) :
			uiBio.blur.light ? RGB(60, 60, 60) :
			g_pl_colors.title_normal;

		uiBio.col.bottomLine =
			uiBio.blur.dark ? col.extraDarkAccent :
			uiBio.blur.blend || uiBio.blur.light ? RGB(120, 120, 120) :
			g_pl_colors.line_normal;

		uiBio.col.centerLine = uiBio.col.bottomLine;
		uiBio.col.sbarBtns = ui.col.sbarBtns;
		uiBio.col.noPhotoStubText = pref.creamTheme ? RGB(120, 170, 130) : g_pl_colors.artist_playing;
		uiBio.col.noPhotoStubBg = RGB(25, 25, 25);

		// Main
		col.artist = RGB(80, 80, 80);
		col.now_playing = RGB(80, 80, 80);
		col.info_text = RGB(220, 220, 220);
		col.bg = pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(230, 230, 230);
		col.detailsBg = g_pl_colors.background;
		col.tl_added = isStreaming ? RGB(207, 0, 5) : RGB(230, 230, 230);
		col.tl_played = isStreaming ? RGB(207, 0, 5) : RGB(180, 180, 180);
		col.tl_unplayed = isStreaming ? RGB(207, 0, 5) : RGB(160, 160, 160);

		if (str.timeline) {
			str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
		}

		// Top menu buttons
		col.menuTextNormal = RGB(80, 80, 80);
		col.menuTextHovered = RGB(40, 40, 40);
		col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal =
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);
		col.menuRectHovered =
			pref.themeStyleTopMenuButtons === 'filled' ? RGB(200, 200, 200) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(205, 205, 205) :
			pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(140, 140, 140) : RGB(150, 150, 150) :
			pref.themeStyleBevel ? RGB(170, 170, 170) : RGB(180, 180, 180);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor =
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			RGB(255, 255, 255);

		col.menuThemeStyleBg =
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(210, 210, 210) : RGB(210, 210, 210) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(235, 235, 235) : RGB(235, 235, 235) :
			pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(220, 220, 220);

		col.menuRectThemeStyleTop =
			pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255);

		col.menuRectThemeStyleBottom =
			pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(195, 195, 195);

		// Transport buttons
		col.transportThemeStyleBg =
			pref.themeStyleTransportButtons === 'bevel' ? pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(205, 205, 205) :
			pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(205, 205, 205) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(230, 230, 230) : RGB(215, 215, 215) :
			RGB(225, 225, 225);

		col.transportThemeStyleTop =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(255, 255, 255) : RGB(255, 255, 255) :
			RGB(255, 255, 255);

		col.transportThemeStyleBottom =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(180, 180, 180) : pref.themeStyleBevel ? RGB(200, 200, 200) : RGB(220, 220, 220) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(180, 180, 180) : pref.themeStyleBevel ? RGB(215, 215, 215) : RGB(210, 210, 210) :
			RGB(230, 230, 230);

		// Progress bar
		col.progressBar = pref.themeStyleBlend || pref.themeStyleBlend2 ? pref.themeStyleBevel ? RGB(205, 205, 205) : RGB(215, 215, 215) : pref.themeStyleBevel ? RGB(195, 195, 195) : RGB(210, 210, 210);

		col.themeStyleProgressBar =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 30) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 35) : RGBA(0, 0, 0, 40) : '';

		col.themeStyleProgressBarLineTop =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 40) : RGBA(0, 0, 0, 40) : pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(0, 0, 0, 0) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 50) : RGBA(0, 0, 0, 50) : pref.themeStyleBevel ? RGBA(0, 0, 0, 20) : RGBA(0, 0, 0, 20) : '';

		col.themeStyleProgressBarLineBottom =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 180) : RGBA(255, 255, 255, 255) : pref.themeStyleBevel ? RGBA(255, 255, 255, 160) : RGBA(255, 255, 255, 220) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 150) : RGBA(255, 255, 255, 255) : pref.themeStyleBevel ? RGBA(255, 255, 255, 150) : RGBA(255, 255, 255, 255) : '';

		col.progressBarFill = RGB(255, 255, 255);

		// Volume bar
		col.volumeBar = RGB(255, 255, 255);

		col.themeStyleVolumeBar =
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 25) : RGBA(0, 0, 0, 30) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 30) : RGBA(0, 0, 0, 30) : '';

		col.volumeBarFill = RGB(120, 120, 120);
		col.themeStyleVolumeBarFill = pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxLightAccent, 90) : '';
		col.volumeBarFrame = RGB(210, 210, 210);
	}
	// Theme style Black And White 2
	if (pref.themeStyleBlackAndWhite2) {
		// Setup col.primary
		col.primary = RGB(255, 255, 255);
		// Playlist
		g_pl_colors.background = RGB(245, 245, 245);
		g_pl_colors.playlist_mgr_text_normal = pref.autoHidePLM ? g_pl_colors.background : RGB(180, 180, 180);
		g_pl_colors.playlist_mgr_text_hovered = pref.autoHidePLM ? RGB(100, 100, 100) : RGB(240, 240, 240);
		g_pl_colors.playlist_mgr_text_pressed = pref.autoHidePLM ? RGB(100, 100, 100) : RGB(180, 180, 180);
		g_pl_colors.group_title = RGB(80, 80, 80);
		g_pl_colors.group_title_selected = g_pl_colors.group_title;
		g_pl_colors.artist_normal = g_pl_colors.group_title;
		g_pl_colors.artist_playing = RGB(60, 60, 60);
		g_pl_colors.album_normal = RGB(80, 80, 80);
		g_pl_colors.album_playing = RGB(60, 60, 60);
		g_pl_colors.info_normal = RGB(60, 60, 60);
		g_pl_colors.info_playing = RGB(60, 60, 60);
		g_pl_colors.date_normal = RGB(60, 60, 60);
		g_pl_colors.date_playing = RGB(60, 60, 60);
		g_pl_colors.line_normal = pref.themeStyleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
		g_pl_colors.line_playing = pref.themeStyleBlend ? RGB(200, 200, 200) : RGB(215, 215, 215);
		g_pl_colors.header_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
		g_pl_colors.header_nowplaying_bg = pref.themeStyleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
		g_pl_colors.header_compact_marker = g_pl_colors.header_sideMarker;
		g_pl_colors.header_compact_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
		g_pl_colors.title_selected = RGB(0, 0, 0);
		g_pl_colors.title_playing = RGB(60, 60, 60);
		g_pl_colors.title_normal = RGB(80, 80, 80);
		g_pl_colors.title_hovered = g_pl_colors.title_selected;
		g_pl_colors.rating_color = RGB(255, 190, 0);
		g_pl_colors.count_normal = RGB(80, 80, 80);
		g_pl_colors.count_selected = g_pl_colors.title_selected;
		g_pl_colors.count_playing = g_pl_colors.title_playing;
		g_pl_colors.row_alternate = pref.themeStyleBlend ? RGBA(25, 25, 25, 130) : RGB(25, 25, 25);
		g_pl_colors.row_focus_selected = pref.themeStyleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
		g_pl_colors.row_focus_normal = RGB(80, 80, 80);
		g_pl_colors.row_sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
		g_pl_colors.row_selection_frame = pref.themeStyleBlend ? RGB(190, 190, 190) : g_pl_colors.row_focus_selected;
		g_pl_colors.row_selection_frame_cropped = pref.themeStyleBlend ? RGB(190, 190, 190) : g_pl_colors.row_focus_selected;
		g_pl_colors.row_nowplaying_bg = pref.themeStyleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		g_theme.colors.panel_line = pref.themeStyleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
		g_theme.colors.panel_line_selected = RGB(100, 100, 100);
		g_theme.colors.panel_text_normal = RGB(100, 100, 100);
		g_pl_colors.ico_fore_colors_normal = RGB(100, 100, 100);
		g_pl_colors.ico_fore_colors_hovered = RGB(0, 0, 0);
		g_pl_colors.thumb_colors_normal = RGB(100, 100, 100);
		g_pl_colors.thumb_colors_hovered = RGB(40, 40, 40);
		g_pl_colors.thumb_colors_down = g_pl_colors.thumb_colors_hovered;

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;
		ui.col.iconPlus = RGB(80, 80, 80);
		ui.col.iconPlus_h = RGB(0, 0, 0);
		ui.col.iconMinus_e = RGB(80, 80, 80);
		ui.col.iconMinus_c = ui.col.iconMinus_e;
		ui.col.iconMinus_h = RGB(0, 0, 0);
		ui.col.iconPlusbg = RGB(45, 45, 45);
		ui.col.iconPlusSel = RGB(255, 255, 255);
		ui.col.nowpBgSel = RGB(255, 255, 255);
		ui.col.text = RGB(80, 80, 80);
		ui.col.text_h = RGB(0, 0, 0);
		ui.col.textSel = RGB(0, 0, 0);
		ui.col.txt = ui.col.text;
		ui.col.txt_h = ui.col.text_h;
		ui.col.txt_box = RGB(80, 80, 80);
		ui.col.count = ui.col.text;
		ui.col.selBlend = ui.col.text;
		ui.col.lotBlend = ui.col.selBlend;
		ui.col.search = RGB(80, 80, 80);
		ui.col.searchBtn = RGB(0, 0, 0);
		ui.col.crossBtn = RGB(0, 0, 0);
		ui.col.filterBtn = RGB(80, 80, 80);
		ui.col.settingsBtn = RGB(80, 80, 80);
		ui.col.line = pref.themeStyleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
		ui.col.s_line = ui.col.line;
		ui.col.nowPlayingBg = pref.themeStyleBlend ? RGBA(255, 255, 255, 130) : RGB(255, 255, 255);
		ui.col.sideMarker = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
		ui.col.selectionFrame = pref.themeStyleBlend ? RGB(190, 190, 190) : RGB(215, 215, 215);
		ui.col.selectionFrame2 = ui.col.sideMarker;
		ui.col.hoverFrame = ui.col.sideMarker;
		ui.col.sbarBtns = RGB(60, 60, 60);
		ui.col.sbarNormal = RGB(0, 0, 0);
		ui.col.sbarNormalR = getRed(ui.col.sbarNormal);
		ui.col.sbarNormalG = getGreen(ui.col.sbarNormal);
		ui.col.sbarNormalB = getBlue(ui.col.sbarNormal);
		ui.col.sbarHovered = RGB(40, 40, 40);
		ui.col.sbarHoveredR = getRed(ui.col.sbarHovered);
		ui.col.sbarHoveredG = getGreen(ui.col.sbarHovered);
		ui.col.sbarHoveredB = getBlue(ui.col.sbarHovered);
		ui.col.sbarDrag = RGB(40, 40, 40);
		ui.col.sbarDragR = getRed(ui.col.sbarDrag);
		ui.col.sbarDragG = getGreen(ui.col.sbarDrag);
		ui.col.sbarDragB = getBlue(ui.col.sbarDrag);

		// Biography
		uiBio.col.bg = g_pl_colors.background;

		uiBio.col.head =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? g_pl_colors.artist_playing :
			uiBio.blur.light ? RGB(65, 65, 65) :
			RGB(60, 60, 60);

		uiBio.col.text =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? g_pl_colors.title_normal :
			uiBio.blur.light ? RGB(60, 60, 60) :
			g_pl_colors.title_normal;

		uiBio.col.source =
			uiBio.blur.dark ? RGB(230, 230, 230) :
			uiBio.blur.blend ? RGB(230, 230, 230) :
			uiBio.blur.light ? RGB(60, 60, 60) :
			g_pl_colors.title_normal;

		uiBio.col.bottomLine =
			uiBio.blur.dark ? col.extraDarkAccent :
			uiBio.blur.blend || uiBio.blur.light ? RGB(120, 120, 120) :
			g_pl_colors.line_normal;

		uiBio.col.centerLine = uiBio.col.bottomLine;
		uiBio.col.sbarBtns = ui.col.sbarBtns;
		uiBio.col.noPhotoStubText = pref.creamTheme ? RGB(120, 170, 130) : g_pl_colors.artist_playing;
		uiBio.col.noPhotoStubBg = RGB(25, 25, 25);

		// Main
		col.artist = RGB(240, 240, 240);
		col.now_playing = RGB(220, 220, 220);
		col.info_text = RGB(60, 60, 60);
		col.bg = pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(25, 25, 25);
		col.detailsBg = g_pl_colors.background;
		col.tl_added = isStreaming ? RGB(207, 0, 5) : RGB(40, 40, 40);
		col.tl_played = isStreaming ? RGB(207, 0, 5) : RGB(80, 80, 80);
		col.tl_unplayed = isStreaming ? RGB(207, 0, 5) : RGB(120, 120, 120);

		if (str.timeline) {
			str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
		}

		// Top menu buttons
		col.menuTextNormal = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(200, 200, 200) : RGB(180, 180, 180);
		col.menuTextHovered = RGB(255, 255, 255);
		col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal =
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(60, 60, 60, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' ? RGB(0, 0, 0) :
			RGB(60, 60, 60);
		col.menuRectHovered =
			pref.themeStyleTopMenuButtons === 'filled' ? RGBA(120, 120, 120, 100) :
			pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? RGB(0, 0, 0) :
			RGB(100, 100, 100);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor =
			pref.themeStyleTopMenuButtons === 'bevel' ? pref.themeStyleBevel ? RGB(40, 40, 40) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(55, 55, 55) : RGB(50, 50, 50) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(45, 45, 45) :
			RGB(35, 35, 35);

		col.menuThemeStyleBg =
			pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
			pref.themeStyleTopMenuButtons === 'emboss' ? pref.themeStyleBevel ? RGB(45, 45, 45) : RGB(50, 50, 50) :
			pref.themeStyleBevel ? RGB(30, 30, 30) : RGB(20, 20, 20);

		col.menuRectThemeStyleTop =
			pref.themeStyleBevel ? RGB(60, 60, 60) : RGB(70, 70, 70);

		col.menuRectThemeStyleBottom =
			pref.themeStyleBevel ? RGB(0, 0, 0) : RGB(0, 0, 0);

		// Transport Buttons
		col.transportIconNormal = RGB(200, 200, 200);
		col.transportIconHovered = RGB(255, 255, 255);
		col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = RGB(50, 50, 50);
		col.transportEllipseHovered = RGB(100, 100, 100);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(60, 60, 60) : RGB(40, 40, 40);
		col.transportThemeStyleBg =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) : '';
		col.transportThemeStyleTop =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(50, 50, 50) : RGB(50, 50, 50) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 40) : '';
		col.transportThemeStyleBottom =
			pref.themeStyleTransportButtons === 'bevel' || pref.themeStyleTransportButtons === 'inner' ? pref.themeStyleBevel ? RGB(10, 10, 10) : RGB(10, 10, 10) :
			pref.themeStyleTransportButtons === 'emboss' ? pref.themeStyleBevel ? RGB(20, 20, 20) : RGB(20, 20, 20) : '';

		// Progress bar
		col.progressBar = RGB(50, 50, 50);

		col.themeStyleProgressBar =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 80) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 100) : RGBA(0, 0, 0, 100) : '';

		col.themeStyleProgressBarLineTop =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 60) : RGBA(0, 0, 0, 255) : pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 255) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 150) : pref.themeStyleBevel ? RGBA(0, 0, 0, 255) : RGBA(0, 0, 0, 100) : '';

		col.themeStyleProgressBarLineBottom =
			pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 40) : RGBA(255, 255, 255, 30) : pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 25) :
			pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 30) : pref.themeStyleBevel ? RGBA(255, 255, 255, 45) : RGBA(255, 255, 255, 40) : '';

		col.progressBarFill = RGB(210, 210, 210);
		col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 70) : '';

		// Volume bar
		col.volumeBar = col.progressBar;
		col.themeStyleVolumeBar =
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 70) : RGBA(0, 0, 0, 80) : '';
		col.volumeBarFill = col.progressBarFill;
		col.volumeBarFrame = RGB(50, 50, 50);
		col.shadow = isPlayingCD ? RGBA(0, 0, 0, 30) : col.shadow;
	}

	// Theme style Black Reborn
	if (pref.themeStyleBlackReborn && (fb.IsPlaying && !isStreaming && !isPlayingCD)) {
		if (!fb.IsPlaying || !albumart && !noAlbumArtStub) col.primary = RGB(25, 25, 25);
		else if (colBrightness < 25) col.primary = tintColor(col.primary, 5);

		// Playlist
		g_pl_colors.background = colBrightness < 35 ? RGB(0, 0, 0) : RGB(20, 20, 20);
		g_pl_colors.playlist_mgr_text_normal = g_pl_colors.background;
		g_pl_colors.line_normal = pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);
		g_pl_colors.line_playing = RGB(25, 25, 25);
		g_pl_colors.header_nowplaying_bg = pref.themeStyleBevel ? shadeColor(col.primary, 10) : col.primary;
		g_pl_colors.header_compact_marker = g_pl_colors.header_sideMarker;
		g_pl_colors.header_compact_nowplaying_bg = g_pl_colors.header_nowplaying_bg;
		g_pl_colors.row_nowplaying_bg = pref.themeStyleBevel ? shadeColor(col.primary, 10) : col.primary;
		g_theme.colors.pss_back = g_pl_colors.background;
		g_theme.colors.panel_back = g_pl_colors.background;
		g_theme.colors.panel_front = g_pl_colors.background;
		g_theme.colors.panel_line = pref.themeStyleBlend ? RGB(65, 65, 65) : RGB(45, 45, 45);
		g_theme.colors.panel_line_selected = RGB(0, 0, 0);

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		ui.col.nowPlayingBg = g_pl_colors.row_nowplaying_bg;

		// Biography
		uiBio.col.bg = g_pl_colors.background;

		// Main
		col.info_text = RGB(220, 220, 220);
		col.bg = col.primary;
		col.detailsBg = g_pl_colors.background;
		col.themeStyleBevel = col.primary === RGB(165, 195, 215) ? RGB(70, 90, 105) : col.extraDarkAccent;

		if (colBrightness > 130) {
			// Playlist
			g_pl_colors.title_playing = col.maxDarkAccent;

			// Main
			col.artist = col.superDarkAccent;
			col.now_playing = col.superDarkAccent;

			// Top menu buttons
			col.menuTextNormal = col.superDarkAccent;
			col.menuTextHovered = col.maxDarkAccent;
			col.menuTextDown = col.menuTextHovered;
			col.menuRectNormal =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 30) :
				col.darkAccent;
			col.menuRectHovered =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 40) : RGBtoRGBA(col.superDarkAccent, 30) :
				col.darkAccent;
			col.menuRectDown = col.menuRectHovered;
			col.menuBgColor =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 50) :
				pref.themeStyleTopMenuButtons !== 'default' ? col.middleAccent : col.extraLightAccent;

			// Transport buttons
			col.transportIconNormal = pref.themeStyleTransportButtons === 'minimal' ? RGB(20, 20, 20) : RGB(180, 180, 180);

			col.menuThemeStyleBg = col.primary === RGB(165, 195, 215) ? RGB(130, 153, 168) : col.accent;
			col.menuRectThemeStyleTop = col.lightAccent;
			col.menuRectThemeStyleBottom = col.darkAccent;
		}
		else if (colBrightness < 131) {
			// Playlist
			g_pl_colors.title_playing = col.maxLightAccent;

			// Main
			col.artist = col.maxLightAccent;
			col.now_playing = col.maxLightAccent;

			// Top menu buttons
			col.menuTextNormal = col.superLightAccent;
			col.menuTextHovered = col.maxLightAccent;
			col.menuTextDown = col.menuTextHovered;
			col.menuRectNormal =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 50) :
				col.extraLightAccent;
			col.menuRectHovered =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 50) :
				col.extraLightAccent;
			col.menuRectDown = col.menuRectHovered;
			col.menuBgColor =
				pref.themeStyleTopMenuButtons === 'bevel' || pref.themeStyleTopMenuButtons === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 50) :
				pref.themeStyleTopMenuButtons !== 'default' ? col.middleAccent : col.extraDarkAccent;

			// Transport buttons
			col.transportIconNormal = pref.themeStyleTransportButtons === 'minimal' ? RGB(220, 220, 220) : RGB(180, 180, 180);

			col.menuThemeStyleBg = col.primary === RGB(165, 195, 215) ? RGB(130, 153, 168) : col.accent;
			col.menuRectThemeStyleTop = col.lightAccent;
			col.menuRectThemeStyleBottom = col.darkAccent;
		}

		// Transport buttons
		col.transportIconHovered = RGB(255, 255, 255);
		col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = col.transportEllipseBg;
		col.transportEllipseHovered = RGB(120, 120, 120);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = g_pl_colors.background;

		// Dynamically adjust transport buttons theme styles progress bar and lines
		if (fb.IsPlaying && !isStreaming && !isPlayingCD) {
			switch (true) {
				case colBrightness > 150:
					// col.transportIconNormal = pref.themeStyleTransportButtons === 'minimal' ? col.superDarkAccent : col.transportIconNormal;
					col.transportEllipseBg = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportEllipseBg, 10) : col.transportEllipseBg;
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportThemeStyleTop, 30) : tintColor(col.transportThemeStyleTop, 10);
					col.transportThemeStyleBottom = tintColor(col.transportThemeStyleBottom, 6);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 10) : shadeColor(col.progressBarFill, 15);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 80) : RGBtoRGBA(col.maxDarkAccent, 60) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 45) : RGBA(255, 255, 255, 65) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 40) : RGBA(255, 255, 255, 60) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superDarkAccent, 0) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 0) : RGBtoRGBA(col.superDarkAccent, 0) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 95) : RGBtoRGBA(col.superDarkAccent, 90) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 45) : RGBtoRGBA(col.superDarkAccent, 40) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 65) : RGBtoRGBA(col.superLightAccent, 70) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 50) : RGBtoRGBA(col.superLightAccent, 55) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 60) : RGBtoRGBA(col.superLightAccent, 60) : '';
					col.shadow = RGBA(0, 0, 0, 35);
					break;
				case colBrightness > 125:
					col.transportEllipseBg = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportEllipseBg, 8) : col.transportEllipseBg;
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportThemeStyleTop, 30) : tintColor(col.transportThemeStyleTop, 15);
					col.transportThemeStyleBottom = tintColor(col.transportThemeStyleBottom, 6);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 15) : shadeColor(col.progressBarFill, 20);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 90) : RGBtoRGBA(col.maxDarkAccent, 70) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 35) : RGBA(255, 255, 255, 55) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 30) : RGBA(255, 255, 255, 50) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 70) : RGBtoRGBA(col.superDarkAccent, 60) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 15) : RGBtoRGBA(col.superDarkAccent, 15) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 90) : RGBtoRGBA(col.superDarkAccent, 85) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 50) : RGBtoRGBA(col.superDarkAccent, 45) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 55) : RGBtoRGBA(col.superLightAccent, 65) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 40) : RGBtoRGBA(col.superLightAccent, 45) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 45) : '';
					col.shadow = RGBA(0, 0, 0, 40);
					break;
				case colBrightness > 100:
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportThemeStyleTop, 40) : shadeColor(col.transportThemeStyleTop, 10);
					col.transportThemeStyleBottom = shadeColor(col.transportThemeStyleBottom, 6);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 20) : shadeColor(col.progressBarFill, 25);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 100) : RGBtoRGBA(col.maxDarkAccent, 85) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 25) : RGBA(255, 255, 255, 40) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 20) : RGBA(255, 255, 255, 40) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 80) : RGBtoRGBA(col.superDarkAccent, 70) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 25) : RGBtoRGBA(col.superDarkAccent, 20) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 100) : RGBtoRGBA(col.superDarkAccent, 90) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 55) : RGBtoRGBA(col.superDarkAccent, 50) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 45) : RGBtoRGBA(col.superLightAccent, 50) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 35) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 45) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 40) : '';
					col.shadow = RGBA(0, 0, 0, 45);
					break;
				case colBrightness > 75:
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? tintColor(col.transportThemeStyleTop, 40) : shadeColor(col.transportThemeStyleTop, 8);
					col.transportThemeStyleBottom = shadeColor(col.transportThemeStyleBottom, 12);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 25) : tintColor(col.progressBarFill, 30);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 100) : RGBtoRGBA(col.maxDarkAccent, 90) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 15) : RGBA(255, 255, 255, 25) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 15) : RGBA(255, 255, 255, 20) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 90) : RGBtoRGBA(col.superDarkAccent, 80) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 35) : RGBtoRGBA(col.superDarkAccent, 30) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 60) : RGBtoRGBA(col.superDarkAccent, 55) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 35) : RGBtoRGBA(col.superLightAccent, 40) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 20) : RGBtoRGBA(col.superLightAccent, 30) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 30) : RGBtoRGBA(col.superLightAccent, 35) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : '';
					col.shadow = RGBA(0, 0, 0, 50);
					break;
				case colBrightness > 50:
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? shadeColor(col.transportThemeStyleTop, 10) : tintColor(col.transportThemeStyleTop, 6);
					col.transportThemeStyleBottom = tintColor(col.transportThemeStyleBottom, 6);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 30) : tintColor(col.progressBarFill, 35);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 110) : RGBtoRGBA(col.maxDarkAccent, 100) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 10) : RGBA(255, 255, 255, 15) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 10) : RGBA(255, 255, 255, 15) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 80) : RGBtoRGBA(col.superDarkAccent, 70) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 130) : RGBtoRGBA(col.superDarkAccent, 120) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 110) : RGBtoRGBA(col.superDarkAccent, 100) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) : '';
					col.shadow = RGBA(0, 0, 0, 55);
					break;
				case colBrightness > 0:
					col.transportThemeStyleTop = pref.themeStyleTransportButtons === 'emboss' ? shadeColor(col.transportThemeStyleTop, 20) : tintColor(col.transportThemeStyleTop, 4);
					col.transportThemeStyleBottom = tintColor(col.transportThemeStyleBottom, 4);
					col.progressBarFill = pref.themeStyleBevel ? tintColor(col.progressBarFill, 35) : tintColor(col.progressBarFill, 40);
					col.themeStyleProgressBarFill = pref.themeStyleProgressBarFill === 'bevel' || pref.themeStyleProgressBarFill === 'inner' ? pref.themeStyleBevel ? RGBtoRGBA(col.maxDarkAccent, 130) : RGBtoRGBA(col.maxDarkAccent, 120) : '';
					col.themeStyleProgressBar =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 10) : RGBA(255, 255, 255, 10) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleBevel ? RGBA(255, 255, 255, 10) : RGBA(255, 255, 255, 10) : '';
					col.themeStyleProgressBarLineTop =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 170) : RGBtoRGBA(col.superDarkAccent, 160) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 160) : RGBtoRGBA(col.superDarkAccent, 140) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 160) : RGBtoRGBA(col.superDarkAccent, 150) : pref.themeStyleBevel ? RGBtoRGBA(col.superDarkAccent, 150) : RGBtoRGBA(col.superDarkAccent, 140) : '';
					col.themeStyleProgressBarLineBottom =
						pref.themeStyleProgressBar === 'bevel' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 25) : RGBtoRGBA(col.superLightAccent, 30) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 20) :
						pref.themeStyleProgressBar === 'inner' ? pref.themeStyleProgressBarRounded ? pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 15) : pref.themeStyleBevel ? RGBtoRGBA(col.superLightAccent, 15) : RGBtoRGBA(col.superLightAccent, 15) : '';
					col.shadow = RGBA(0, 0, 0, 70);
					break;
			}
		}
		col.progressBar = g_pl_colors.background;
		if (col.primary === RGB(165, 195, 215)) col.progressBarFill = pref.themeStyleBlend || pref.themeStyleBlend2 ? RGB(155, 185, 205) : RGB(145, 170, 190);

		// Volume bar
		col.volumeBar = g_pl_colors.background;
		col.themeStyleVolumeBar =
			pref.themeStyleVolumeBar === 'bevel' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) :
			pref.themeStyleVolumeBar === 'inner' ? pref.themeStyleBevel ? RGBA(0, 0, 0, 120) : RGBA(0, 0, 0, 100) : '';
		col.volumeBarFill = col.primary;
		col.themeStyleVolumeBarFill = pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner' ? RGBtoRGBA(col.maxDarkAccent, 100)  : '';
	}
}


const whiteTheme = {
	name: 'white',
	colors: {
		primary: rgb(25, 160, 240),
		darkAccent: rgb(12, 144, 245),
		accent: rgb(12, 137, 232),
		lightAccent: rgb(10, 130, 220),
	},
	hint: [rgb(207, 0, 5), rgb(220, 220, 220)]
};

const blackTheme = {
	name: 'black',
	colors: {
		primary: rgb(165, 195, 215),
		darkAccent: rgb(160, 160, 160),
		accent: rgb(180, 180, 180),
		lightAccent: rgb(220, 220, 220),
	},
	hint: [rgb(207, 0, 5), rgb(50, 50, 50)]
};

const rebornTheme = {
	name: 'reborn',
	colors: {
		primary: rgb(90, 90, 90),
		darkAccent: rgb(60, 60, 60),
		accent: rgb(80, 80, 80),
		lightAccent: rgb(100, 100, 100),
	},
	hint: [rgb(250, 150, 50), rgb(220, 220, 220)]
};

const randomTheme = {
	name: 'random',
	colors: {
		primary: rgb(65, 65, 65),
		darkAccent: rgb(60, 60, 60),
		accent: rgb(80, 80, 80),
		lightAccent: rgb(100, 100, 100),
	},
	hint: [rgb(250, 150, 50), rgb(220, 220, 220)]
};

const blueTheme = {
	name: 'blue',
	colors: {
		primary: rgb(10, 115, 200),
		darkAccent: rgb(12, 144, 245),
		accent: rgb(12, 137, 232),
		lightAccent: rgb(10, 130, 220),
	},
	hint: [rgb(10, 115, 200)]
};

const darkblueTheme = {
	name: 'darkBlue',
	colors: {
		primary: rgb(21, 37, 56),
		darkAccent: rgb(31, 65, 107),
		accent: rgb(27, 58, 94),
		lightAccent: rgb(24, 50, 82),
	},
	hint: [rgb(27, 55, 90)]
};

const redTheme = {
	name: 'red',
	colors: {
		primary: rgb(110, 20, 20),
		darkAccent: rgb(156, 30, 30),
		accent: rgb(143, 27, 27),
		lightAccent: rgb(130, 25, 25),
	},
	hint: [rgb(140, 25, 25)]
};

const creamTheme = {
	name: 'cream',
	colors: {
		primary: rgb(255, 247, 240),
		darkAccent: rgb(120, 170, 130),
		accent: rgb(130, 184, 141),
		lightAccent: rgb(139, 196, 151),
	},
	hint: [rgb(255, 255, 255)]
};

const nblueTheme = {
	name: 'neon blue',
	colors: {
		primary: rgb(12, 12, 12),
		darkAccent: rgb(30, 30, 30),
		accent: rgb(40, 40, 40),
		lightAccent: rgb(50, 50, 50),
	},
	hint: [rgb(35, 35, 35)]
};

const ngreenTheme = {
	name: 'neon green',
	colors: {
		primary: rgb(12, 12, 12),
		darkAccent: rgb(30, 30, 30),
		accent: rgb(40, 40, 40),
		lightAccent: rgb(50, 50, 50),
	},
	hint: [rgb(35, 35, 35)]
};

const nredTheme = {
	name: 'neon red',
	colors: {
		primary: rgb(12, 12, 12),
		darkAccent: rgb(30, 30, 30),
		accent: rgb(40, 40, 40),
		lightAccent: rgb(50, 50, 50),
	},
	hint: [rgb(35, 35, 35)]
};

const ngoldTheme = {
	name: 'neon gold',
	colors: {
		primary: rgb(12, 12, 12),
		darkAccent: rgb(30, 30, 30),
		accent: rgb(40, 40, 40),
		lightAccent: rgb(50, 50, 50),
	},
	hint: [rgb(35, 35, 35)]
};


function setTheme(theme) {
	var themeCol = new Color(theme.primary);
	if (colorDistance(theme.primary, col.bg, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		if (pref.blackTheme && !pref.themeStyleBlackReborn) {
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
			theme.primary = tintColor(theme.primary, 20);
			themeCol = new Color(theme.primary);
		} else {
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Shading theme color.');
			theme.primary = shadeColor(theme.primary, 5);
			themeCol = new Color(theme.primary);
		}
	}
	col.primary = theme.primary;

	if (colorDistance(theme.primary, col.progressBar, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		// progress fill is too close in color to bg
		if (settings.showThemeLog) console.log('>>> Theme primary color is too close to progress bar. Adjusting progressBar');
		if (pref.whiteTheme && themeCol.brightness < 125) {
			col.progressBar = rgb(180, 180, 180);
		}
	}

	if (str.timeline) {
		str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
	}

	col.primary = theme.primary;
	col.accent = theme.accent;

	// Reborn theme main tone palette
	col.maxDarkAccent = shadeColor(theme.primary, 100);
	col.superDarkAccent = shadeColor(theme.primary, 75);
	col.veryDarkAccent = shadeColor(theme.primary, 60);
	col.extraDarkAccent = shadeColor(theme.primary, 50);
	col.darkAccent = theme.darkAccent;

	col.altBG = tintColor(theme.primary, 2);
	col.darkMiddleAccent = tintColor(theme.primary, 7);
	col.middleAccent = tintColor(theme.primary, 10);
	col.lightMiddleAccent = tintColor(theme.primary, 35);

	col.lightAccent = theme.lightAccent;
	col.extraLightAccent = tintColor(theme.primary, 50);
	col.veryLightAccent = tintColor(theme.primary, 65);
	col.superLightAccent = tintColor(theme.primary, 80);
	col.maxLightAccent = tintColor(theme.primary, 100);

	// Change col.primary if too bright or too dark
	if (pref.whiteTheme && (colorDistance(col.primary, col.progressBar)) < 60) {
		col.primary = col.darkAccent;
	}
	// else if (pref.blackTheme && !pref.themeStyleBlackReborn && (colorDistance(col.primary, col.bg)) < 50) {
	// 	col.primary = rgb(165, 195, 215);
	// }
	// else if (colorDistance(col.primary, col.bg) < 60) {
	// 	col.primary = col.darkAccent;
	// }
}

function setThemeColors() {
	pref.whiteTheme ? setTheme(whiteTheme.colors) :
	pref.blackTheme ? setTheme(blackTheme.colors) :
	pref.rebornTheme ? setTheme(rebornTheme.colors) :
	pref.randomTheme ? setTheme(randomTheme.colors) :
	pref.blueTheme ? setTheme(blueTheme.colors) :
	pref.darkblueTheme ? setTheme(darkblueTheme.colors) :
	pref.redTheme ? setTheme(redTheme.colors) :
	pref.creamTheme ? setTheme(creamTheme.colors) :
	pref.nblueTheme ? setTheme(nblueTheme.colors) :
	pref.ngreenTheme ? setTheme(ngreenTheme.colors) :
	pref.nredTheme ? setTheme(nredTheme.colors) :
	pref.ngoldTheme ? setTheme(ngoldTheme.colors) : '';
}

// Change col.primary when streaming, reset to default when playing from CD or using noAlbumArtStub
function noAlbumArtColors() {
	if (isStreaming && (pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme)) {
		col.primary = RGB(207, 0, 5);
	}
	if (isPlayingCD || noAlbumArtStub) {
		if (!isStreaming) setThemeColors();
		uiBio.updateProp(1); // Needed to update color for NO PHOTO/COVER stub in Biography when changing themes
	}
}

// Theme style Black And White Reborn - Dynamically change between theme style Black and white 1 and 2
function initBlackAndWhiteReborn() {
	const imgBrightness = calcImageBrightness(albumart);
	if (imgBrightness > 130) {
		pref.themeStyleBlackAndWhite2 = true; // White background
		pref.themeStyleBlackAndWhite = false;
	}
	else if (imgBrightness < 131) {
		pref.themeStyleBlackAndWhite = true; // Black background
		pref.themeStyleBlackAndWhite2 = false;
	}
	initPlaylistColors();
	initMainColors();
	initTheme();
}

// Theme style Blend
function setThemeStyleBlend() {
	const imgBrightness = calcImageBrightness(albumart);

	let setThemeStyleBlendProfiler = null;
	if (timings.showDebugTiming) setThemeStyleBlendProfiler = fb.CreateProfiler('setThemeStyleBlend');

	function blurImage(image, blurLevel) {
		blurLevel =	pref.whiteTheme ? 100 :	pref.blackTheme ? 150 : 250;

		if (pref.rebornTheme || pref.randomTheme) {
			switch (true) {
				case imgBrightness > 125: blurLevel = 250; break;
				case imgBrightness > 100: blurLevel = 220; break;
				case imgBrightness >  75: blurLevel = 200; break;
				case imgBrightness >  50: blurLevel = 220; break;
				case imgBrightness >   0: blurLevel = 200; break;
			}
		}

		image.StackBlur(blurLevel);

		if (settings.showThemeLog) console.log(`Blended image blur: ${blurLevel}`);

		return image;
	};

	function formatBlendedImg(image, imgW, imgH, angle, alpha) {
		if (!image || !imgW || !imgH) return image;

		let tempImg = gdi.CreateImage(imgW, imgH);
		let g = tempImg.GetGraphics();

		angle = 0;
		alpha =
		pref.whiteTheme ? 70 :
		pref.blackTheme ? 50 :
		pref.blueTheme ? 80 :
		pref.darkblueTheme ? 70 :
		pref.redTheme ? 50 :
		pref.creamTheme ? 70 :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? 50 : 120;

		if (pref.rebornTheme || pref.randomTheme) {
			switch (true) {
				case imgBrightness > 200: alpha = 150; break;
				case imgBrightness > 150: alpha = 130; break;
				case imgBrightness > 125: alpha = 120; break;
				case imgBrightness > 100: alpha = 110; break;
				case imgBrightness >  75: alpha = 100; break;
				case imgBrightness >  50: alpha =  90; break;
				case imgBrightness >   0: alpha =  80; break;
			}
		}
		try { // Prevent crash if album art is corrupt, file format is not supported or has a unusual ICC profile embedded
			g.DrawImage(image, 0, 0, ww, wh, 0, 0, image.Width, image.Height, angle, alpha);
		} catch (e) {
			console.log('<Error: Image blending failed, album art could not be properly parsed! Maybe it is corrupt, file format is not supported or has a unusual ICC profile embedded>');
		}
		tempImg.ReleaseGraphics(g);
		tempImg = blurImage(tempImg, 0, 0, tempImg.Width, tempImg.Height, 0, 0, tempImg.Width, tempImg.Height);

		if (settings.showThemeLog) console.log(`Blended image alpha: ${alpha}\nTheme brightness: ${pref.themeBrightness}`);

		return tempImg;
	};

	function setBlendedImg() {
		let img = formatBlendedImg(albumart, ww, wh, 100);
		return img;
	};

	blendedImg = setBlendedImg(albumart, fb.GetNowPlaying());

	if (timings.showDebugTiming) setThemeStyleBlendProfiler.Print();
}

// Random theme color generator
function randomThemeColor() {
	let generateRandomColor = function() {
		let R = Math.floor((Math.random() * (pref.themeStyleRandomPastel ? 127 : 27)) + (pref.themeStyleRandomPastel ? 127 : 27));
		let G = Math.floor((Math.random() * (pref.themeStyleRandomPastel ? 127 : 27)) + (pref.themeStyleRandomPastel ? 127 : 27));
		let B = Math.floor((Math.random() * (pref.themeStyleRandomPastel ? 127 : 27)) + (pref.themeStyleRandomPastel ? 127 : 27));
		let rgb = pref.themeStyleRandomPastel || pref.themeStyleRandomDark ? (R << 16) + (G << 8) + B : ((1 << 24) * Math.random() | 0);
		return rgb;
	}

	color = new Color(generateRandomColor());
	const tObj = createThemeColorObject(color);
	setTheme(tObj);

	if (settings.showThemeLog) console.log('Random generated color:', color.getRGB(true));
}

// Theme style Random theme auto color
let randomThemeAutoColorTimer;
function randomThemeAutoColor() {
	clearInterval(randomThemeAutoColorTimer);
	randomThemeAutoColorTimer = null;

	if (pref.themeStyleRandomAutoColor !== 'off' && pref.themeStyleRandomAutoColor !== 'track') {
		randomThemeAutoColorTimer = setInterval(() => {
			initTheme();
		}, pref.themeStyleRandomAutoColor);
	}
	else if (pref.themeStyleRandomAutoColor === 'track') {
		initTheme();
	}
}

function adjustThemeBrightness(percent) {
	switch(percent) {
		case  -5: case  5: percent =  5; break;
		case -10: case 10: percent = 10; break;
		case -15: case 15: percent = 15; break;
		case -20: case 20: percent = 20; break;
		case -25: case 25: percent = 25; break;
		case -30: case 30: percent = 30; break;
		case -40: case 40: percent = 40; break;
		case -50: case 50: percent = 50; break;
	}

	if (pref.themeBrightness < 0) { // Darken
		// Playlist
		g_pl_colors.background = shadeColor(g_pl_colors.background, percent);
		g_pl_colors.playlist_mgr_text_normal = shadeColor(g_pl_colors.playlist_mgr_text_normal, percent);
		g_pl_colors.group_title = shadeColor(g_pl_colors.group_title, percent);
		g_pl_colors.group_title_selected = shadeColor(g_pl_colors.group_title_selected, percent);
		g_pl_colors.line_normal = shadeColor(g_pl_colors.line_normal, percent);
		g_pl_colors.line_playing = shadeColor(g_pl_colors.line_playing, percent);
		// g_pl_colors.header_sideMarker = shadeColor(g_pl_colors.header_sideMarker, percent);
		g_pl_colors.header_nowplaying_bg = shadeColor(g_pl_colors.header_nowplaying_bg, percent - 3);
		// g_pl_colors.header_compact_marker = shadeColor(g_pl_colors.header_compact_marker, percent);
		g_pl_colors.header_compact_nowplaying_bg = shadeColor(g_pl_colors.header_compact_nowplaying_bg, percent);
		g_pl_colors.row_alternate = shadeColor(g_pl_colors.row_alternate, percent);
		g_pl_colors.row_focus_selected = shadeColor(g_pl_colors.row_focus_selected, percent);
		g_pl_colors.row_focus_normal = shadeColor(g_pl_colors.row_focus_normal, percent);
		// g_pl_colors.row_sideMarker = shadeColor(g_pl_colors.row_sideMarker, percent);
		g_pl_colors.row_selection_frame = shadeColor(g_pl_colors.row_selection_frame, percent);
		g_pl_colors.row_selection_frame_cropped = shadeColor(g_pl_colors.row_selection_frame_cropped, percent);
		g_pl_colors.row_nowplaying_bg = shadeColor(g_pl_colors.row_nowplaying_bg, percent - 3);
		g_theme.colors.pss_back = shadeColor(g_theme.colors.pss_back, percent);
		g_theme.colors.panel_back = shadeColor(g_theme.colors.panel_back, percent);
		g_theme.colors.panel_front = shadeColor(g_theme.colors.panel_front, percent);
		g_theme.colors.panel_line = shadeColor(g_theme.colors.panel_line, percent);
		g_theme.colors.panel_line_selected = shadeColor(g_theme.colors.panel_line_selected, percent);
		g_theme.colors.panel_text_normal = shadeColor(g_theme.colors.panel_text_normal, percent);
		g_pl_colors.ico_fore_colors_normal = shadeColor(g_pl_colors.ico_fore_colors_normal, percent);
		g_pl_colors.ico_fore_colors_hovered = shadeColor(g_pl_colors.ico_fore_colors_hovered, percent);
		g_pl_colors.thumb_colors_normal = shadeColor(g_pl_colors.thumb_colors_normal, percent - 3);
		g_pl_colors.thumb_colors_hovered = shadeColor(g_pl_colors.thumb_colors_hovered, percent - 3);
		g_pl_colors.thumb_colors_down = shadeColor(g_pl_colors.thumb_colors_down, percent - 3);

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		// ui.col.iconPlus = shadeColor(ui.col.iconPlus, percent);
		// ui.col.iconPlus_h = shadeColor(ui.col.iconPlus_h, percent);
		// ui.col.iconMinus_e = shadeColor(ui.col.iconMinus_e, percent);
		// ui.col.iconMinus_h = shadeColor(ui.col.iconMinus_h, percent);
		// ui.col.iconPlusbg = shadeColor(ui.col.iconPlusbg, percent);
		// ui.col.iconPlusSel = shadeColor(ui.col.iconPlusSel, percent);
		ui.col.nowpBgSel = shadeColor(ui.col.nowpBgSel, percent - 5);
		// ui.col.text = shadeColor(ui.col.text, percent);
		// ui.col.text_h = shadeColor(ui.col.text_h, percent);
		// ui.col.textSel = shadeColor(ui.col.textSel, percent);
		// ui.col.txt_box = shadeColor(ui.col.txt_box, percent);
		// ui.col.search = shadeColor(ui.col.search, percent);
		// ui.col.searchBtn = shadeColor(ui.col.searchBtn, percent);
		// ui.col.crossBtn = shadeColor(ui.col.crossBtn, percent);
		// ui.col.filterBtn = shadeColor(ui.col.filterBtn, percent);
		// ui.col.settingsBtn = shadeColor(ui.col.settingsBtn, percent);
		ui.col.line = shadeColor(ui.col.line, percent);
		ui.col.s_line = shadeColor(ui.col.s_line, percent);
		ui.col.nowPlayingBg = shadeColor(ui.col.nowPlayingBg, percent - 5);
		// ui.col.sideMarker = shadeColor(ui.col.sideMarker, percent);
		// ui.col.sideMarker_nobw = shadeColor(ui.col.sideMarker_nobw, percent);
		ui.col.selectionFrame = shadeColor(ui.col.selectionFrame, percent - 10);
		ui.col.sbarBtns = shadeColor(ui.col.sbarBtns, percent - 10);
		ui.col.sbarNormal = shadeColor(ui.col.sbarNormal, percent - 10);
		ui.col.sbarHovered = shadeColor(ui.col.sbarHovered, percent - 10);
		ui.col.sbarDrag = shadeColor(ui.col.sbarDrag, percent - 10);
		ui.col.sbarNormalR = shadeColor(ui.col.sbarNormalR, percent - 10);
		ui.col.sbarNormalG = shadeColor(ui.col.sbarNormalG, percent - 10);
		ui.col.sbarNormalB = shadeColor(ui.col.sbarNormalB, percent - 10);

		// Biography
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.bottomLine = g_pl_colors.line_normal;
		uiBio.col.centerLine = g_pl_colors.line_normal;

		// Main
		// col.artist = shadeColor(col.artist , percent);
		// col.now_playing = shadeColor(col.now_playing, percent);
		col.bg = shadeColor(col.bg, percent);
		col.detailsBg = shadeColor(col.detailsBg, percent);
		col.uiHackFrame = shadeColor(col.uiHackFrame, percent);
		col.tl_added = shadeColor(col.tl_added, percent);
		col.tl_played = shadeColor(col.tl_played, percent);
		col.tl_unplayed = shadeColor(col.tl_unplayed, percent);
		// Top menu buttons
		// col.menuTextNormal = shadeColor(col.menuTextNormal, percent);
		// col.menuTextHovered = shadeColor(col.menuTextHovered, percent);
		// col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal = shadeColor(col.menuRectNormal, percent);
		col.menuRectHovered = shadeColor(col.menuRectHovered, percent);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor = shadeColor(col.menuBgColor, percent);
		col.menuThemeStyleBg = shadeColor(col.menuThemeStyleBg, percent);
		col.menuRectThemeStyleTop = shadeColor(col.menuRectThemeStyleTop, percent);
		col.menuRectThemeStyleBottom = shadeColor(col.menuRectThemeStyleBottom, percent);
		// Transport buttons
		// col.transportIconNormal = shadeColor(col.transportIconNormal, percent);
		// col.transportIconHovered = shadeColor(col.transportIconHovered, percent);
		// col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = shadeColor(col.transportEllipseNormal, percent);
		col.transportEllipseHovered = shadeColor(col.transportEllipseHovered, percent);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = shadeColor(col.transportEllipseBg, percent);
		col.transportThemeStyleBg = shadeColor(col.transportThemeStyleBg, percent);
		col.transportThemeStyleTop = shadeColor(col.transportThemeStyleTop, percent);
		col.transportThemeStyleBottom = shadeColor(col.transportThemeStyleBottom, percent);
		// Progress bar
		col.progressBar = shadeColor(col.progressBar, percent);
		col.progressBarStreaming = shadeColor(col.progressBarStreaming, percent);
		col.themeStyleProgressBar = shadeColor(col.themeStyleProgressBar, percent);
		col.themeStyleProgressBarLineTop = shadeColor(col.themeStyleProgressBarLineTop, percent);
		col.themeStyleProgressBarLineBottom = shadeColor(col.themeStyleProgressBarLineBottom, percent);
		col.progressBarFrame = shadeColor(col.progressBarFrame, percent);
		if (pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ) col.progressBarFill = shadeColor(col.progressBarFill, percent - 3);
		// col.themeStyleProgressBarFill = shadeColor(col.themeStyleProgressBarFill, percent);
		// Volume bar
		col.volumeBar = shadeColor(col.volumeBar, percent);
		col.themeStyleVolumeBar = shadeColor(col.themeStyleVolumeBar, percent);
		if (pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ) col.volumeBarFill = shadeColor(col.volumeBarFill, percent - 3);
		// col.themeStyleVolumeBarFill = shadeColor(col.themeStyleVolumeBarFill, percent);
		col.volumeBarFrame = shadeColor(col.volumeBarFrame, percent);

		col.shadow = shadeColor(col.shadow, percent);
	}
	else if (pref.themeBrightness > 0) { // Lighten
		// Playlist
		g_pl_colors.background = tintColor(g_pl_colors.background, percent);
		g_pl_colors.playlist_mgr_text_normal = tintColor(g_pl_colors.playlist_mgr_text_normal, percent);
		g_pl_colors.group_title = tintColor(g_pl_colors.group_title, percent);
		g_pl_colors.group_title_selected = tintColor(g_pl_colors.group_title_selected, percent);
		g_pl_colors.line_normal = tintColor(g_pl_colors.line_normal, percent);
		g_pl_colors.line_playing = tintColor(g_pl_colors.line_playing, percent);
		// g_pl_colors.header_sideMarker = tintColor(g_pl_colors.header_sideMarker, percent);
		g_pl_colors.header_nowplaying_bg = tintColor(g_pl_colors.header_nowplaying_bg, percent - 3);
		// g_pl_colors.header_compact_marker = tintColor(g_pl_colors.header_compact_marker, percent);
		g_pl_colors.header_compact_nowplaying_bg = tintColor(g_pl_colors.header_compact_nowplaying_bg, percent);
		g_pl_colors.row_alternate = tintColor(g_pl_colors.row_alternate, percent);
		g_pl_colors.row_focus_selected = tintColor(g_pl_colors.row_focus_selected, percent);
		g_pl_colors.row_focus_normal = tintColor(g_pl_colors.row_focus_normal, percent);
		// g_pl_colors.row_sideMarker = tintColor(g_pl_colors.row_sideMarker, percent);
		g_pl_colors.row_selection_frame = tintColor(g_pl_colors.row_selection_frame, percent);
		g_pl_colors.row_selection_frame_cropped = tintColor(g_pl_colors.row_selection_frame_cropped, percent);
		g_pl_colors.row_nowplaying_bg = tintColor(g_pl_colors.row_nowplaying_bg, percent - 3);
		g_theme.colors.pss_back = tintColor(g_theme.colors.pss_back, percent);
		g_theme.colors.panel_back = tintColor(g_theme.colors.panel_back, percent);
		g_theme.colors.panel_front = tintColor(g_theme.colors.panel_front, percent);
		g_theme.colors.panel_line = tintColor(g_theme.colors.panel_line, percent);
		g_theme.colors.panel_line_selected = tintColor(g_theme.colors.panel_line_selected, percent);
		g_theme.colors.panel_text_normal = tintColor(g_theme.colors.panel_text_normal, percent);
		g_pl_colors.ico_fore_colors_normal = tintColor(g_pl_colors.ico_fore_colors_normal, percent);
		g_pl_colors.ico_fore_colors_hovered = tintColor(g_pl_colors.ico_fore_colors_hovered, percent);
		g_pl_colors.thumb_colors_normal = tintColor(g_pl_colors.thumb_colors_normal, percent - 3);
		g_pl_colors.thumb_colors_hovered = tintColor(g_pl_colors.thumb_colors_hovered, percent - 3);
		g_pl_colors.thumb_colors_down = tintColor(g_pl_colors.thumb_colors_down, percent - 3);

		// Library
		ui.col.bg = g_pl_colors.background;
		ui.col.topBarUnderlay = g_pl_colors.background;
		// ui.col.iconPlus = tintColor(ui.col.iconPlus, percent);
		// ui.col.iconPlus_h = tintColor(ui.col.iconPlus_h, percent);
		// ui.col.iconMinus_e = tintColor(ui.col.iconMinus_e, percent);
		// ui.col.iconMinus_h = tintColor(ui.col.iconMinus_h, percent);
		// ui.col.iconPlusbg = tintColor(ui.col.iconPlusbg, percent);
		// ui.col.iconPlusSel = tintColor(ui.col.iconPlusSel, percent);
		ui.col.nowpBgSel = tintColor(ui.col.nowpBgSel, percent - 3);
		// ui.col.text = tintColor(ui.col.text, percent);
		// ui.col.text_h = tintColor(ui.col.text_h, percent);
		// ui.col.textSel = tintColor(ui.col.textSel, percent);
		// ui.col.txt_box = tintColor(ui.col.txt_box, percent);
		// ui.col.search = tintColor(ui.col.search, percent);
		// ui.col.searchBtn = tintColor(ui.col.searchBtn, percent);
		// ui.col.crossBtn = tintColor(ui.col.crossBtn, percent);
		// ui.col.filterBtn = tintColor(ui.col.filterBtn, percent);
		// ui.col.settingsBtn = tintColor(ui.col.settingsBtn, percent);
		ui.col.line = tintColor(ui.col.line, percent);
		ui.col.s_line = tintColor(ui.col.s_line, percent);
		ui.col.nowPlayingBg = tintColor(ui.col.nowPlayingBg, percent - 3);
		// ui.col.sideMarker = tintColor(ui.col.sideMarker, percent);
		// ui.col.sideMarker_nobw = tintColor(ui.col.sideMarker_nobw, percent);
		ui.col.selectionFrame = tintColor(ui.col.selectionFrame, percent);
		ui.col.sbarBtns = tintColor(ui.col.sbarBtns, percent - 5);
		ui.col.sbarNormal = tintColor(ui.col.sbarNormal, percent - 5);
		ui.col.sbarHovered = tintColor(ui.col.sbarHovered, percent - 5);
		ui.col.sbarDrag = tintColor(ui.col.sbarDrag, percent - 5);
		ui.col.sbarNormalR = tintColor(ui.col.sbarNormalR, percent - 5);
		ui.col.sbarNormalG = tintColor(ui.col.sbarNormalG, percent - 5);
		ui.col.sbarNormalB = tintColor(ui.col.sbarNormalB, percent - 5);

		// Biography
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.bottomLine = g_pl_colors.line_normal;
		uiBio.col.centerLine = g_pl_colors.line_normal;

		// Main
		// col.artist = tintColor(col.artist , percent);
		// col.now_playing = tintColor(col.now_playing, percent);
		col.bg = tintColor(col.bg, percent);
		col.detailsBg = tintColor(col.detailsBg, percent);
		col.uiHackFrame = tintColor(col.uiHackFrame, percent);
		col.tl_added = tintColor(col.tl_added, percent);
		col.tl_played = tintColor(col.tl_played, percent);
		col.tl_unplayed = tintColor(col.tl_unplayed, percent);
		// Top menu buttons
		// col.menuTextNormal = tintColor(col.menuTextNormal, percent);
		// col.menuTextHovered = tintColor(col.menuTextHovered, percent);
		// col.menuTextDown = col.menuTextHovered;
		col.menuRectNormal = tintColor(col.menuRectNormal, percent);
		col.menuRectHovered = tintColor(col.menuRectHovered, percent);
		col.menuRectDown = col.menuRectHovered;
		col.menuBgColor = tintColor(col.menuBgColor, percent);
		col.menuThemeStyleBg = tintColor(col.menuThemeStyleBg, percent);
		col.menuRectThemeStyleTop = tintColor(col.menuRectThemeStyleTop, percent);
		col.menuRectThemeStyleBottom = tintColor(col.menuRectThemeStyleBottom, percent);
		// Transport buttons
		// col.transportIconNormal = tintColor(col.transportIconNormal, percent);
		// col.transportIconHovered = tintColor(col.transportIconHovered, percent);
		// col.transportIconDown = col.transportIconHovered;
		col.transportEllipseNormal = tintColor(col.transportEllipseNormal, percent);
		col.transportEllipseHovered = tintColor(col.transportEllipseHovered, percent);
		col.transportEllipseDown = col.transportEllipseHovered;
		col.transportEllipseBg = tintColor(col.transportEllipseBg, percent);
		col.transportThemeStyleBg = tintColor(col.transportThemeStyleBg, percent);
		col.transportThemeStyleTop = tintColor(col.transportThemeStyleTop, percent);
		col.transportThemeStyleBottom = tintColor(col.transportThemeStyleBottom, percent);
		// Progress bar
		col.progressBar = tintColor(col.progressBar, percent);
		col.progressBarStreaming = tintColor(col.progressBarStreaming, percent);
		col.themeStyleProgressBar = tintColor(col.themeStyleProgressBar, percent);
		col.themeStyleProgressBarLineTop = tintColor(col.themeStyleProgressBarLineTop, percent);
		col.themeStyleProgressBarLineBottom = tintColor(col.themeStyleProgressBarLineBottom, percent);
		col.progressBarFrame = tintColor(col.progressBarFrame, percent);
		if (pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ) col.progressBarFill = tintColor(col.progressBarFill, percent - 3);
		// col.themeStyleProgressBarFill = tintColor(col.themeStyleProgressBarFill, percent);
		// Volume bar
		col.volumeBar = tintColor(col.volumeBar, percent);
		col.themeStyleVolumeBar = tintColor(col.themeStyleVolumeBar, percent);
		if (pref.whiteTheme || pref.blackTheme || pref.rebornTheme || pref.randomTheme ) col.volumeBarFill = tintColor(col.volumeBarFill, percent - 3);
		// col.themeStyleVolumeBarFill = tintColor(col.themeStyleVolumeBarFill, percent);
		col.volumeBarFrame = tintColor(col.volumeBarFrame, percent);

		col.shadow = tintColor(col.shadow, percent);
	}

	// Update all colors
	if (pref.themeBrightness !== 'default') {
		// Update timeline
		if (str.timeline) {
			str.timeline.setColors(col.tl_added, col.tl_played, col.tl_unplayed);
		}
		// Update Playlist scrollbar buttons
		playlist.on_size(ww, wh);
		// Update Library buttons
		pop.createImages();
		but.createImages();
		but.refresh(true);
		// Update Biography buttons
		alb_scrollbar.setCol();
		art_scrollbar.setCol();
		butBio.createImages('all');
		imgBio.createImages();
		// Update main buttons
		createButtonImages();
		createButtonObjects(ww, wh);
		initButtonState();
		window.Repaint();
	}
}

function initThemeBrightness() {
	if      (pref.themeBrightness === -25) adjustThemeBrightness(-25);
	else if (pref.themeBrightness === -20) adjustThemeBrightness(-20);
	else if (pref.themeBrightness === -15) adjustThemeBrightness(-15);
	else if (pref.themeBrightness === -10) adjustThemeBrightness(-10);
	else if (pref.themeBrightness ===  -5) adjustThemeBrightness( -5);
	else if (pref.themeBrightness ===   5) adjustThemeBrightness(  5);
	else if (pref.themeBrightness ===  10) adjustThemeBrightness( 10);
	else if (pref.themeBrightness ===  15) adjustThemeBrightness( 15);
	else if (pref.themeBrightness ===  20) adjustThemeBrightness( 20);
	else if (pref.themeBrightness ===  25) adjustThemeBrightness( 25);
}


/**
 * @param {GdiBitmap} image
 * @param {number} maxColorsToPull
 */
function getThemeColorsJson(image, maxColorsToPull) {
	let selectedColor;
	const minFrequency = 0.015;
	const maxBrightness = pref.blackTheme || pref.themeStyleBlend ? 255 : 212;

	try {
		let colorsWeighted = JSON.parse(image.GetColourSchemeJSON(maxColorsToPull));
		colorsWeighted.map(c => {
			c.col = new Color(c.col);
		});

		if (settings.showThemeLog) console.log('idx      color        bright  freq   weight');
		let maxWeight = 0;
		selectedColor = colorsWeighted[0].col;  // choose first color in case no color selected below
		colorsWeighted.forEach((c, i) => {
			const col = c.col;
			const midBrightness = 127 - Math.abs(127 - col.brightness);   // favors colors with a brightness around 127
			c.weight = c.freq * midBrightness * 10; // multiply by 10 so numbers are easier to compare

			if (c.freq >= minFrequency && !col.isCloseToGreyscale && col.brightness < maxBrightness) {
				if (settings.showThemeLog) console.log(leftPad(i, 2), col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%', leftPad(c.weight.toFixed(2), 7));
				if (c.weight > maxWeight) {
					maxWeight = c.weight;
					selectedColor = col;
				}
			} else if (col.isCloseToGreyscale) {
				if (settings.showThemeLog) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%', '   grey');
			} else {
				if (settings.showThemeLog) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%',
					(c.freq < minFrequency) ? '   freq' : ' bright');
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
					c.freq > .01) {
						maxWeight = c.weight;
						brightest = c.col;
					}
			});
			selectedColor = brightest;
		}
		if (settings.showThemeLog) console.log('Selected Color:', selectedColor.getRGB(true));
		return selectedColor.val;
	} catch (e) {
		console.log('<Error: GetColourSchemeJSON failed.>');
	}
}

function getThemeColors(image) {
	let calculatedColor;
	const val = $('[%THEMECOLOR%]');

	if (val.length) {	// color hardcoded
		var themeRgb = val.match(/\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		if (themeRgb) {
			calculatedColor = rgb(parseInt(themeRgb[1]), parseInt(themeRgb[2]), parseInt(themeRgb[3]));
		} else {
			calculatedColor = 0xff000000 | parseInt(val, 16);
		}
	} else {
		calculatedColor = getThemeColorsJson(image, 14);
	}
	if (!isNaN(calculatedColor)) {
		let color = new Color(calculatedColor);
		while (!pref.blackTheme && color.brightness > 220) {
			calculatedColor = shadeColor(calculatedColor, pref.whiteTheme ? 12 : 3);
			if (settings.showThemeLog) console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		while (!color.isGreyscale && color.brightness <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		const tObj = createThemeColorObject(color);
		setTheme(tObj);
	}

	// Create new theme style Blend
	if ((pref.themeStyleBlend || pref.themeStyleBlend2 || pref.themeStyleProgressBarFill === 'blend') && albumart) setThemeStyleBlend();
	// Update Black and White Reborn colors
	if (pref.themeStyleBlackAndWhiteReborn) initBlackAndWhiteReborn();
	// Update White/Black theme colors linked to col.primary
	if (pref.whiteTheme && !pref.themeStyleBlackAndWhiteReborn || pref.blackTheme && !pref.themeStyleBlackReborn) initPlaylistColors(); initMainColors();
	// Update Reborn/Random theme and theme style Black Reborn colors on new album art
	if (pref.rebornTheme || pref.randomTheme && pref.themeStyleRandomAutoColor !== 'track' || pref.whiteTheme && (pref.themeStyleBlend || pref.themeStyleBlend2) || pref.themeStyleBlackReborn) initTheme();
	// Update theme brightness colors if it's not default
	if (pref.themeBrightness !== 'default') initTheme(); initThemeBrightness();
}

function createThemeColorObject(color) {
	const themeObj = {
		primary: color.val,
		darkAccent: shadeColor(color.val, 30),
		accent: shadeColor(color.val, 15),
		lightAccent: tintColor(color.val, 20),
	};
	if (color.brightness < 18) {
		// hard code these values otherwise darkAccent and accent can be very hard to see on background
		themeObj.darkAccent = rgb(32, 32, 32);
		themeObj.accent = rgb(56, 56, 56);
		themeObj.lightAccent = rgb(78, 78, 78);
	} else if (color.brightness < 40) {
		themeObj.darkAccent = shadeColor(color.val, 35);
		themeObj.accent = tintColor(color.val, 10);
		themeObj.lightAccent = tintColor(color.val, 20);
	} else if (color.brightness > 210) {
		themeObj.darkAccent = shadeColor(color.val, 30);
		themeObj.accent = shadeColor(color.val, 20);
		themeObj.lightAccent = shadeColor(color.val, 10);
	}
	return themeObj;
}

function shadeColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return rgba(darkenColorVal(red, percent), darkenColorVal(green, percent), darkenColorVal(blue, percent), getAlpha(color));
}

function tintColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return rgba(lightenColorVal(red, percent), lightenColorVal(green, percent), lightenColorVal(blue, percent), getAlpha(color));
}

function darkenColorVal(color, percent) {
	const shift = Math.max(color * percent / 100, percent / 2);
	const val = Math.round(color - shift);
	return Math.max(val, 0);
}

function lightenColorVal(color, percent) {
	const val = Math.round(color + ((255-color) * (percent / 100)));
	return Math.min(val, 255);
}

/**
 * Calculates the color "distance" between two colors. Currently uses the more naive color weighted
 * calculation from https://en.wikipedia.org/wiki/Color_difference.
 * @param {number} a The first color in numeric form (i.e. rgb(150,250,255))
 * @param {number} b The second color in numeric form (i.e. rgb(150,250,255))
 * @param {boolean=} log Whether to print the distance in the console. Also requires that settings.showThemeLog is true
 */
function colorDistance(a, b, log) {
	const aCol = new Color(a);
	const bCol = new Color(b);

	const rho = (aCol.r + bCol.r) / 2;
	const deltaR = Math.pow(aCol.r - bCol.r, 2);
	const deltaG = Math.pow(aCol.g - bCol.g, 2);
	const deltaB = Math.pow(aCol.b - bCol.b, 2);

	// TODO: Convert this to use "redmean" approximation from above link and then retest colorDistance checks
	const distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256);
	if (log) {
		if (settings.showThemeLog) console.log('distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}
