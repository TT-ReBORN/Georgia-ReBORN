/** @type ColorsObj */
var col = {}; // colors
var themeArray = [];


// PLAYLIST COLORS
function initPlaylistColors() {
		//---> Common
		g_pl_colors.background =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(20, 20, 20) :
		pref.blueTheme ?  RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(255, 249, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

		//---> Playlist Manager
		if (pref.autoHidePLM) {
			g_pl_colors.playlist_mgr_text_normal =
			pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
			g_pl_colors.background : g_pl_colors.background;

			g_pl_colors.playlist_mgr_text_hovered =
			pref.whiteTheme ? RGB(120, 120, 120) :
			pref.blackTheme ? RGB(200, 200, 200) :
			pref.blueTheme ? RGB(230, 230, 230) :
			pref.darkblueTheme ? RGB(220, 220, 220) :
			pref.redTheme ? RGB(220, 220, 220) :
			pref.creamTheme ? RGB(110, 110, 110) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

			g_pl_colors.playlist_mgr_text_pressed =
			pref.whiteTheme ? RGB(80, 80, 80) :
			pref.blackTheme ? RGB(240, 240, 240) :
			pref.blueTheme ? RGB(255, 255, 255) :
			pref.darkblueTheme ? RGB(255, 255, 255) :
			pref.redTheme ? RGB(255, 255, 255) :
			pref.creamTheme ? RGB(80, 80, 80) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		} else {
			g_pl_colors.playlist_mgr_text_normal =
			pref.whiteTheme ? RGB(140, 140, 140) :
			pref.blackTheme ? RGB(180, 180, 180) :
			pref.blueTheme ? RGB(220, 220, 220) :
			pref.darkblueTheme ? RGB(220, 220, 220) :
			pref.redTheme ? RGB(220, 220, 220) :
			pref.creamTheme ? RGB(220, 220, 220) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

			g_pl_colors.playlist_mgr_text_hovered =
			pref.whiteTheme ? RGB(80, 80, 80) :
			pref.blackTheme ? RGB(240, 240, 240) :
			pref.blueTheme ? RGB(255, 255, 255) :
			pref.darkblueTheme ? RGB(255, 255, 255) :
			pref.redTheme ? RGB(255, 255, 255) :
			pref.creamTheme ? RGB(80, 80, 80) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

			g_pl_colors.playlist_mgr_text_pressed =
			pref.whiteTheme ? RGB(140, 140, 140) :
			pref.blackTheme ? RGB(180, 160, 180) :
			pref.blueTheme ? RGB(220, 220, 220) :
			pref.darkblueTheme ? RGB(220, 220, 220) :
			pref.redTheme ? RGB(220, 220, 220) :
			pref.creamTheme ? RGB(130, 130, 130) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';
		}
		//---> Header
		g_pl_colors.group_title =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		g_pl_colors.group_title_selected =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? g_pl_colors.group_title : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) :
		pref.blackTheme ? g_pl_colors.group_title :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(240, 240, 240) :
		pref.redTheme ? RGB(240, 240, 240) :
		pref.creamTheme ? g_pl_colors.group_title :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

		g_pl_colors.artist_normal =
		pref.whiteTheme ? g_pl_colors.group_title :
		pref.blackTheme ? g_pl_colors.group_title :
		pref.blueTheme ? RGB(240, 240, 240) :
		pref.darkblueTheme ? RGB(240, 240, 240) :
		pref.redTheme ? RGB(240, 240, 240) :
		pref.creamTheme ? RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

		g_pl_colors.artist_playing =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? RGB(120, 120, 120) : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

		g_pl_colors.album_normal =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		g_pl_colors.album_playing =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? RGB(120, 120, 120) : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(245, 245, 245) :
		pref.redTheme ? RGB(245, 245, 245) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

		g_pl_colors.info_normal =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		g_pl_colors.info_playing =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? g_pl_colors.info_normal : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(245, 245, 245) :
		pref.redTheme ? RGB(245, 245, 245) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(240, 240, 240) : '';

		g_pl_colors.date_normal =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(240, 240, 240) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		g_pl_colors.date_playing =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? g_pl_colors.date_normal : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(245, 245, 245) :
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
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		g_pl_colors.line_playing =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(220, 220, 220) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(50, 50, 50) : '';

		g_pl_colors.line_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		//---> Row
		g_pl_colors.title_selected =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		g_pl_colors.title_playing =
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(245, 245, 245) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(245, 245, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		g_pl_colors.title_normal =
		pref.whiteTheme && pref.layout_mode === 'default_mode' ? RGB(100, 100, 100) : pref.whiteTheme && pref.layout_mode === 'compact_mode' ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

		g_pl_colors.title_hover =
		pref.whiteTheme ? RGB(250, 0, 0) : RGB(100, 100, 100);

		g_pl_colors.rating_color =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGB(255, 190, 0) : RGB(255, 190, 0);

		g_pl_colors.count_normal =
		pref.whiteTheme ? RGB(120, 122, 124) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(120, 122, 124) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		g_pl_colors.count_selected =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		g_pl_colors.title_selected : g_pl_colors.title_selected;

		g_pl_colors.count_playing =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		g_pl_colors.title_playing : g_pl_colors.title_playing;

		g_pl_colors.row_selected =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(20, 20, 20) :
		pref.blueTheme ? RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(255, 249, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

		g_pl_colors.row_alternate =
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.blueTheme ? RGB(5, 110, 195) :
		pref.darkblueTheme ? RGB(22, 40, 63) :
		pref.redTheme ? RGB(100, 20, 20) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(20, 20, 20) : '';

		g_pl_colors.row_focus_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.blueTheme ? RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

		g_pl_colors.row_focus_normal =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGB(80, 80, 80) : RGB(80, 80, 80);

		//---> Common.js Settings Override
		g_theme.colors.pss_back =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(20, 20, 20) :
		pref.blueTheme ? RGB(10, 115, 200) :
		pref.darkblueTheme ? RGB(21, 37, 56) :
		pref.redTheme ? RGB(110, 20, 20) :
		pref.creamTheme ? RGB(255, 249, 245) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(12, 12, 12) : '';

		g_theme.colors.panel_back =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		g_theme.colors.pss_back : g_theme.colors.pss_back;

		g_theme.colors.panel_front =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		g_theme.colors.pss_back : g_theme.colors.pss_back;

		g_theme.colors.panel_line =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		g_theme.colors.panel_line_selected =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(0, 0, 0) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		g_theme.colors.panel_text_normal =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(220, 220, 220) :
		pref.darkblueTheme ? RGB(220, 220, 220) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(110, 110, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

}		initPlaylistColors();


// LIBRARY COLORS
function initLibraryColors() {
	ui = new userinterface();

		ui.col.bg =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		g_theme.colors.pss_back : g_theme.colors.pss_back;

		ui.iconcol_h =
		pref.whiteTheme ? RGB(0, 0, 0) : '';

		ui.col.iconPlus =
		pref.whiteTheme ? RGB(80, 80, 80) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

		ui.col.iconPlus_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		ui.col.iconMinus_e =
		pref.whiteTheme ? RGB(80, 80, 80) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(255, 202, 128) :
		pref.creamTheme ? RGB(100, 150, 110) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

		ui.col.iconMinus_c =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		ui.col.iconMinus_e : ui.col.iconMinus_e;

		ui.col.iconMinus_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		ui.col.iconPlussel =
		pref.whiteTheme ? RGB(255, 255, 255) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		ui.col.iconPlusbg =
		pref.whiteTheme ? RGB(240, 240, 240) :
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(24, 50, 82) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		ui.col.txt_box =
		pref.whiteTheme ? RGB(80, 80, 80) :
		pref.blackTheme ? g_pl_colors.artist_playing :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

		ui.col.text =
		pref.whiteTheme ? RGB(100, 100, 100) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

		ui.col.text_h =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(255, 255, 255) :
		pref.darkblueTheme ? RGB(255, 255, 255) :
		pref.redTheme ? RGB(255, 255, 255) :
		pref.creamTheme ? RGB(0, 0, 0) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(255, 255, 255) : '';

		ui.col.textsel =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGB(255, 255, 255) : RGB(255, 255, 255);

		ui.col.search =
		pref.whiteTheme ? RGB(100, 100, 100) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

		ui.col.searchBtn =
		pref.whiteTheme ? RGB(0, 0, 0) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

		ui.col.crossBtn =
		pref.whiteTheme ? RGB(80, 80, 80) :
		pref.blackTheme ? RGB(255, 255, 255) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

		ui.col.filter =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(120, 120, 120) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(200, 200, 200) : '';

		ui.col.filterBtn =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(220, 220, 220) :
		pref.blueTheme ? RGB(230, 230, 230) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? g_pl_colors.artist_playing : '';

		ui.selcol =
		pref.whiteTheme ? g_pl_colors.artist_playing :
		pref.blackTheme ? g_pl_colors.artist_playing :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(242, 230, 170) :
		pref.redTheme ? RGB(230, 230, 230) :
		pref.creamTheme ? RGB(90, 90, 90) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(25, 25, 25) : '';

		ui.col.line =
		pref.whiteTheme ? RGB(200, 200, 200) :
		pref.blackTheme ? RGB(45, 45, 45) :
		pref.blueTheme ? RGB(17, 100, 182) :
		pref.darkblueTheme ? RGB(12, 21, 31) :
		pref.redTheme ? RGB(75, 18, 18) :
		pref.creamTheme ? RGB(200, 200, 200) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(45, 45, 45) : '';

		ui.s_linecol =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		ui.col.line : ui.col.line;

}		initLibraryColors();


// BIOGRAPHY COLORS
function initBiographyColors() {

	if ((pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) && !ppt.blurDark && !ppt.blurBlend && !ppt.blurLight) {
		ppt.headFontStyle = 1;                            // Artist/Album Type Style 0 = Normal, 1 = Bold, 2 = Italic, 3 = Bold Italic, 16 = Semibold, 18 = Semibold Italic
		uiBio.col.bg = g_pl_colors.background;            // Background Color
		uiBio.col.head = g_pl_colors.artist_playing;      // Artist/Album Color
		uiBio.col.text = g_pl_colors.title_normal;        // Text Color
		uiBio.col.bottomLine = g_pl_colors.line_normal;   // Line Color
		uiBio.col.centerLine = g_pl_colors.line_normal;   // Line Color
	}
	else if (pref.creamTheme && !ppt.blurDark && !ppt.blurBlend && !ppt.blurLight) {
		ppt.headFontStyle = 1;
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.head = rgb(120, 170, 130);
		uiBio.col.text = g_pl_colors.title_normal;
		uiBio.col.bottomLine = g_pl_colors.line_normal;
		uiBio.col.centerLine = g_pl_colors.line_normal;
	}
	else if (ppt.blurDark) {
		ppt.headFontStyle = 1;
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.head = rgb(230, 230, 230);
		uiBio.col.text = rgb(230, 230, 230);
		uiBio.col.bottomLine = rgb(200, 200, 200);
		uiBio.col.centerLine = rgb(200, 200, 200);
		if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		uiBio.col.head = g_pl_colors.artist_playing;
		}
	}
	else if (ppt.blurBlend) {
		ppt.headFontStyle = 1;
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.head = rgb(65, 65, 65);
		uiBio.col.text = rgb(60, 60, 60);
		uiBio.col.bottomLine = rgb(120, 120, 120);
		uiBio.col.centerLine = rgb(120, 120, 120);
		if (pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme) {
		uiBio.col.head = g_pl_colors.artist_playing;
		uiBio.col.text = rgb(230, 230, 230);
		}
		if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		uiBio.col.head = g_pl_colors.artist_playing;
		uiBio.col.text = rgb(230, 230, 230);
		}
	}
	else if (ppt.blurLight) {
		ppt.headFontStyle = 1;
		uiBio.col.bg = g_pl_colors.background;
		uiBio.col.head = rgb(65, 65, 65);
		uiBio.col.text = rgb(60, 60, 60);
		uiBio.col.bottomLine = rgb(120, 120, 120);
		uiBio.col.centerLine = rgb(120, 120, 120);
		if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		uiBio.col.head = g_pl_colors.artist_playing;
		}
	}

	if (pref.blackTheme) {
		uiBio.col.bottomLine = rgb(55, 55, 55);
		uiBio.col.centerLine = rgb(55, 55, 55);
	}
	else if (pref.blueTheme) {
		uiBio.col.bottomLine = rgb(10, 135, 225);
		uiBio.col.centerLine = rgb(10, 135, 225);
	}
	else if (pref.darkblueTheme) {
		uiBio.col.bottomLine = rgb(38, 70, 112);
		uiBio.col.centerLine = rgb(38, 70, 112);
	}
	else if (pref.redTheme) {
		uiBio.col.bottomLine = rgb(150, 25, 25);
		uiBio.col.centerLine = rgb(150, 25, 25);
	}
	else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		uiBio.col.bottomLine = rgb(55, 55, 55);
		uiBio.col.centerLine = rgb(55, 55, 55);
	}

}	initBiographyColors();


// Georgia-ReBORN MAIN COLORS
function initColors() {

		col.artist =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(240, 240, 240) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(100, 150, 110) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

		col.bg =
		pref.whiteTheme ? RGB(245, 245, 245) :
		pref.blackTheme ? RGB(25, 25, 25) :
		pref.blueTheme ? RGB(5, 110, 195) :
		pref.darkblueTheme ? RGB(22, 40, 63) :
		pref.redTheme ? RGB(100, 20, 20) :
		pref.creamTheme ? RGB(255, 247, 240) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(20, 20, 20) : '';

		col.progress_fill =
		pref.whiteTheme ? RGB(180, 180, 180) :
		pref.blackTheme ? RGB(100, 100, 100) :
		pref.blueTheme ? RGB(242, 230, 170) :
		pref.darkblueTheme ? RGB(255, 202, 128) :
		pref.redTheme ? RGB(245, 212, 165) :
		pref.creamTheme ? RGB(120, 170, 130) :
		pref.nblueTheme ? RGB(0, 200, 255) :
		pref.ngreenTheme ? RGB(0, 200, 0) :
		pref.nredTheme ? RGB(229, 7, 44) :
		pref.ngoldTheme ? RGB(254, 204, 3) : '';

		col.progress_bar =
		pref.whiteTheme ? RGB(220, 220, 220) :
		pref.blackTheme ? RGB(50, 50, 50) :
		pref.blueTheme ? RGB(10, 130, 220) :
		pref.darkblueTheme ? RGB(27, 55, 90) :
		pref.redTheme ? RGB(140, 25, 25) :
		pref.creamTheme ? RGB(255, 255, 255) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(35, 35, 35) : '';

		col.now_playing =
		pref.whiteTheme ? RGB(120, 120, 120) :
		pref.blackTheme ? RGB(200, 200, 200) :
		pref.blueTheme ? RGB(245, 245, 245) :
		pref.darkblueTheme ? RGB(230, 230, 230) :
		pref.redTheme ? RGB(220, 220, 220) :
		pref.creamTheme ? RGB(100, 100, 100) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(220, 220, 220) : '';

		col.aa_border =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGBA(60, 60, 60, 128) : RGBA(60, 60, 60, 128);

		col.shadow =
		pref.whiteTheme ? RGBA(0, 0, 0, 60) :
		pref.blackTheme ? RGBA(0, 0, 0, 255) :
		pref.blueTheme ? RGBA(0, 0, 0, 90) :
		pref.darkblueTheme ? RGBA(0, 0, 0, 140) :
		pref.redTheme ? RGBA(0, 0, 0, 140) :
		pref.creamTheme ? RGBA(0, 0, 0, 60) :
		pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBA(0, 0, 0, 140) : '';

		col.rating =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGB(255, 170, 32) : RGB(255, 170, 32);

		col.hotness =
		pref.whiteTheme || pref.blackTheme || pref.blueTheme || pref.darkblueTheme || pref.redTheme || pref.creamTheme || pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ?
		RGB(192, 192, 0) : RGB(192, 192, 0);

}		initColors();


const whiteTheme = {
	name: 'white',
	colors: {
		primary: rgb(5, 110, 195),
		darkAccent: rgb(12, 144, 245),
		accent: rgb(12, 137, 232),
		lightAccent: rgb(10, 130, 220),
	},
	hint: [rgb(207, 0, 5), rgb(220, 220, 220)]
};

const blackTheme = {
	name: 'black',
	colors: {
		primary: rgb(207, 0, 5),
		darkAccent: rgb(207, 0, 5),
		accent: rgb(207, 41, 44),
		lightAccent: rgb(207, 72, 75),
	},
	hint: [rgb(207, 0, 5), rgb(50, 50, 50)]
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
		primary: rgb(255, 249, 245),
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function setTheme(theme) {
	var themeCol = new Color(theme.primary);
	if (colorDistance(theme.primary, col.bg, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		if (pref.blackTheme) {
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
			theme.primary = tintColor(theme.primary, 5);
			themeCol = new Color(theme.primary);
		} else if (pref.blackTheme) {
			if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Shading theme color.');
			theme.primary = shadeColor(theme.primary, 5);
			themeCol = new Color(theme.primary);
		}
	}
	col.primary = theme.primary;

	if (pref.whiteTheme) {
		col.progress_bar = isStreaming ? rgb(207, 0, 5) : rgb(220, 220, 220);
		col.tl_added = isStreaming ? theme.darkAccent = rgb(207, 0, 5) : theme.darkAccent;
		col.tl_played = isStreaming ? theme.accent = rgb(207, 41, 44) : theme.accent;
		col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(207, 72, 75) : theme.lightAccent;
		col.primary = isStreaming ? theme.primary = rgb(207, 0, 5) : theme.primary;
	}
	else if (pref.blackTheme) {
		col.progress_bar = isStreaming ? rgb(207, 0, 5) : rgb(50, 50, 50);
		col.tl_added = isStreaming ? theme.darkAccent = rgb(207, 0, 5) : theme.darkAccent;
		col.tl_played = isStreaming ? theme.accent = rgb(207, 41, 44) : theme.accent;
		col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(207, 72, 75) : theme.lightAccent;
		col.primary = isStreaming ? theme.primary = rgb(207, 0, 5) : theme.primary;
	}
	else if (pref.blueTheme) {
		col.progress_bar = rgb(10, 130, 220);
		col.tl_added = isStreaming ? theme.darkAccent = rgb(12, 144, 245) : theme.darkAccent;
		col.tl_played = isStreaming ? theme.accent = rgb(12, 137, 232) : theme.accent;
		col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(10, 130, 220) : theme.lightAccent;
	}
	else if (pref.darkblueTheme) {
		col.progress_bar = rgb(27, 55, 90);
		if (isStreaming) {
			col.tl_added = isStreaming ? theme.darkAccent = rgb(31, 65, 107) : theme.darkAccent;
			col.tl_played = isStreaming ? theme.accent = rgb(27, 58, 94) : theme.accent;
			col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(24, 50, 82) : theme.lightAccent;
		}
	}
	else if (pref.redTheme) {
		col.progress_bar = rgb(140, 25, 25);
		if (isStreaming) {
			col.tl_added = isStreaming ? theme.darkAccent = rgb(156, 30, 30) : theme.darkAccent;
			col.tl_played = isStreaming ? theme.accent = rgb(143, 27, 27) : theme.accent;
			col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(130, 25, 25) : theme.lightAccent;
		}
	}
	else if (pref.creamTheme) {
		col.progress_bar = rgb(255, 255, 255);
		if (isStreaming) {
			col.tl_added = isStreaming ? theme.darkAccent = rgb(120, 170, 130) : theme.darkAccent;
			col.tl_played = isStreaming ? theme.accent = rgb(130, 184, 141) : theme.accent;
			col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(139, 196, 151) : theme.lightAccent;
		}
	}
	else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		col.progress_bar = rgb(35, 35, 35);
		if (isStreaming) {
			col.tl_added = isStreaming ? theme.darkAccent = rgb(30, 30, 30) : theme.darkAccent;
			col.tl_played = isStreaming ? theme.accent = rgb(40, 40, 40) : theme.accent;
			col.tl_unplayed = isStreaming ? theme.lightAccent = rgb(50, 50, 50) : theme.lightAccent;
		}
	}

	if (colorDistance(theme.primary, col.progress_bar, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		// progress fill is too close in color to bg
		if (settings.showThemeLog) console.log('>>> Theme primary color is too close to progress bar. Adjusting progress_bar');
		if (pref.whiteTheme && themeCol.brightness < 125) {
			col.progress_bar = isStreaming ? rgb(207, 0, 5) : rgb(180, 180, 180);
		} if (pref.blackTheme && themeCol.brightness < 125) {
			col.progress_bar = isStreaming ? rgb(207, 0, 5) : rgb(100, 100, 100);
		}
	}
	if (str.timeline) {
		str.timeline.setColors(theme.darkAccent, theme.accent, theme.lightAccent);
	}
	col.tl_added = theme.darkAccent;
	col.tl_played = theme.accent;
	col.tl_unplayed = theme.lightAccent;

	col.primary = theme.primary;
	col.extraDarkAccent = shadeColor(theme.primary, 50);
	col.darkAccent = theme.darkAccent;
	col.accent = theme.accent;
	col.lightAccent = theme.lightAccent;
}

/**
 * @param {GdiBitmap} image
 * @param {number} maxColorsToPull
 */
function getThemeColorsJson(image, maxColorsToPull) {
	let selectedColor;
	const minFrequency = 0.015;
	const maxBrightness = pref.blackTheme ? 255 : 212;

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
		while (!pref.blackTheme && color.brightness > 200) {
			calculatedColor = shadeColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		while (!color.isGreyscale && color.brightness <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		const tObj = createThemeColorObject(color)
		setTheme(tObj);
	}
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

	//TODO: Convert this to use "redmean" approximation from above link and then retest colorDistance checks
	const distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256);
	if (log) {
		if (settings.showThemeLog) console.log('distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}
