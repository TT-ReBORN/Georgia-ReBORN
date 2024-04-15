/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Initialization                           * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    15-04-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////
// * MAIN INSTANCES * //
////////////////////////
grm.utils    = new Utilities();

grm.ui       = new MainUI();
grm.settings = new ThemeSettingsManager();
grm.display  = new Display();
grm.color    = new ColorMethods();
grm.theme    = new ThemeColors();
grm.style    = new StyleColors();
grm.preset   = new ThemePreset();

grm.topMenu  = new TopMenu();
grm.options  = new TopMenuOptions();
grm.ctxMenu  = new ContextMenus();
grm.inputBox = new InputBox();
grm.cusMenu  = new CustomMenu();
grm.cthMenu  = new CustomThemeMenu();
grm.gridMenu = new MetadataGridMenu();

grm.artCache = new ArtCache();
grm.scaling  = new Scaling();
grm.button   = new Button();
grm.pseBtn   = new PauseButton();
grm.volBtn   = new VolumeButton();
grm.ttip     = new TooltipHandler();
grm.lowerTip = new LowerBarTooltip();
grm.gridTip  = new MetadataGridTooltip();

grm.timeline = new Timeline();
grm.jSearch  = new JumpSearch();
grm.progBar  = new ProgressBar();
grm.peakBar  = new PeakmeterBar();
grm.waveBar  = new WaveformBar();

grm.lyrics   = new Lyrics();


/////////////////////////////
// ! MAIN INITIALIZATION ! //
/////////////////////////////
if (grSet.systemFirstLaunch) {
	grm.ui.initFonts();
	grm.ui.systemFirstLaunch();
} else {
	grm.ui.initFonts();
	grm.ui.initMain();
}

/**
 * Called when drawing graphics.
 * Draws the main user interface.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 */
function on_paint(gr) {
	grm.ui.drawMain(gr);
}
