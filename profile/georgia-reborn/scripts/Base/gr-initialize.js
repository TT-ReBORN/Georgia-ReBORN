/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Initialization                           * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    17-01-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////
// * MAIN INSTANCES * //
////////////////////////
grm.utils    = new Utilities();

grm.ui       = new MainUI();
grm.details  = new Details();
grm.settings = new ThemeSettingsManager();
grm.display  = new Display();
grm.color    = new BaseColors();
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
grm.bgImg    = new BackgroundImage();
grm.cpuTrack = new CPUTracker();
grm.msg      = new MessageManager();
grm.button   = new Button();
grm.pseBtn   = new PauseButton();
grm.volBtn   = new VolumeButton();
grm.ttip     = new TooltipHandler();

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
	grm.ui.initSystemFirstLaunch();
} else {
	grm.ui.initFonts();
	grm.ui.initMain();
}
