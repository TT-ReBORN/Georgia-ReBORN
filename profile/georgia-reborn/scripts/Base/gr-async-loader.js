/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Preloader                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2024-01-09                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
window.DefineScript('Georgia-ReBORN', {
	author: 'TT',
	version: window.GetProperty('Georgia-ReBORN - #Version: Do not hand edit!', '3.0-DEV'),
	features: { drag_n_drop: true }
});

/** @type {string} */
const basePath = `${fb.ProfilePath}georgia-reborn\\`;
/** @type {{ loading: string; fileName: string; fileIndex: number }} */
const loadStrs = { loading: 'Loading:', fileName: '', fileIndex: 0 };
/** @type {number} */
const startTime = Date.now();


////////////////////////////
// * SYSTEM FILE LOADER * //
////////////////////////////
include(`${basePath}scripts\\base\\gr-helpers.js`);
include(`${basePath}scripts\\base\\gr-common.js`);
include(`${basePath}scripts\\base\\gr-configuration.js`);
include(`${basePath}scripts\\base\\gr-display.js`);
include(`${basePath}scripts\\base\\gr-defaults.js`);
include(`${basePath}scripts\\base\\gr-settings.js`);
include(`${basePath}scripts\\base\\gr-setup.js`);


///////////////////////////
// * ASYNC FILE LOADER * //
///////////////////////////
/** @type {string} */
const fileList = [
	'scripts\\playlist\\pl-control-scrollbar.js',
	'scripts\\playlist\\pl-control-list.js',
	'scripts\\playlist\\pl-linked-list.js',
	'scripts\\playlist\\pl-main.js',
	'scripts\\library\\lib-main.js',
	'scripts\\library\\scripts\\lib-helpers.js',
	'scripts\\library\\scripts\\lib-properties.js',
	'scripts\\library\\scripts\\lib-interface.js',
	'scripts\\library\\scripts\\lib-panel.js',
	'scripts\\library\\scripts\\lib-scrollbar.js',
	'scripts\\library\\scripts\\lib-library.js',
	'scripts\\library\\scripts\\lib-populate.js',
	'scripts\\library\\scripts\\lib-search.js',
	'scripts\\library\\scripts\\lib-buttons.js',
	'scripts\\library\\scripts\\lib-popupbox.js',
	'scripts\\library\\scripts\\lib-timers.js',
	'scripts\\library\\scripts\\lib-menu.js',
	'scripts\\library\\scripts\\lib-initialise.js',
	'scripts\\library\\scripts\\lib-images.js',
	'scripts\\library\\scripts\\lib-callbacks.js',
	'scripts\\biography\\bio-main.js',
	'scripts\\biography\\scripts\\bio-helpers.js',
	'scripts\\biography\\scripts\\bio-properties.js',
	'scripts\\biography\\scripts\\bio-settings.js',
	'scripts\\biography\\scripts\\bio-interface.js',
	'scripts\\biography\\scripts\\bio-language.js',
	'scripts\\biography\\scripts\\bio-panel.js',
	'scripts\\biography\\scripts\\bio-server.js',
	'scripts\\biography\\scripts\\bio-allmusic.js',
	'scripts\\biography\\scripts\\bio-lastfm.js',
	'scripts\\biography\\scripts\\bio-wikipedia.js',
	'scripts\\biography\\scripts\\bio-names.js',
	'scripts\\biography\\scripts\\bio-scrollbar.js',
	'scripts\\biography\\scripts\\bio-buttons.js',
	'scripts\\biography\\scripts\\bio-menu.js',
	'scripts\\biography\\scripts\\bio-text.js',
	'scripts\\biography\\scripts\\bio-lyrics.js',
	'scripts\\biography\\scripts\\bio-tagger.js',
	'scripts\\biography\\scripts\\bio-resize.js',
	'scripts\\biography\\scripts\\bio-library.js',
	'scripts\\biography\\scripts\\bio-images.js',
	'scripts\\biography\\scripts\\bio-filmstrip.js',
	'scripts\\biography\\scripts\\bio-timers.js',
	'scripts\\biography\\scripts\\bio-popupbox.js',
	'scripts\\biography\\scripts\\bio-initialise.js',
	'scripts\\biography\\scripts\\bio-callbacks.js',
	'scripts\\base\\gr-color.js',
	'scripts\\base\\gr-themes.js',
	'scripts\\base\\gr-theme-presets.js',
	'scripts\\base\\gr-buttons.js',
	'scripts\\base\\gr-main-components.js',
	'scripts\\base\\gr-lyrics.js',
	'scripts\\base\\gr-callbacks.js',
	'scripts\\base\\gr-main-functions.js',
	'scripts\\base\\gr-context-menu.js',
	'scripts\\base\\gr-menu.js',
	'scripts\\base\\gr-menu-custom.js',
	'scripts\\base\\gr-main.js'
];


/**
 * Loads script files asynchronously on foobar startup or reload.
 * @param {string} filePath The path to the file to load.
 * @returns {Promise} A promise that resolves when the file has been loaded.
 */
function loadAsyncFile(filePath) {
	return new Promise(resolve => {
		setTimeout(() => {
			include(filePath);
			resolve();
		}, 0);
	});
}


/**
 * Loads a list of files asynchronously if pref.asyncThemePreloader is true, otherwise synchronously.
 * Throttles UI updates approximately every 16 milliseconds during async loading.
 * @param {string[]} fileList The list of files to load.
 * @param {number} startTime The timestamp marking the start of the operation, used for calculating total load time and UI update intervals.
 */
async function includeFiles(fileList, startTime) {
	if (pref.asyncThemePreloader) {
		const refreshTime = 16; // ~60Hz
		let lastRepaintTime = startTime;
		for (let i = 0; i < fileList.length; i++) {
			loadStrs.fileName = `${fileList[i]} ...`;
			loadStrs.fileIndex = i;
			const currentTime = Date.now();
			if (currentTime - lastRepaintTime > refreshTime) {
				lastRepaintTime = currentTime;
				window.Repaint();
			}
			await loadAsyncFile(`${basePath}${fileList[i]}`);
		}
		return;
	}
	fileList.forEach(filePath => include(`${basePath}${filePath}`));
}


/**
 * Start loading all Georgia-ReBORN scripts from fileList and schedule an update check.
 */
includeFiles(fileList, startTime).then(() => {
	console.log(`Georgia-ReBORN loaded in ${Date.now() - startTime}ms`);

	if (pref.checkForUpdates) {
		scheduleUpdateCheck(0);
	}
});


//////////////////////////////
// * THEME DAY/NIGHT MODE * //
//////////////////////////////
/**
 * Initializes the current time and changes the theme to day or night based on the OS clock and pref.themeDayNightMode value.
 * The pref.themeDayNightMode can be a string in the format 'startHour-endHour', which represents custom starting and ending hours for the day theme.
 * For example, '6-18' indicates day theme from 6 AM to 6 PM. This range can wrap around midnight.
 * The value 'false' disables the day/night theme feature, which is the default setting.
 * If the feature is disabled or if other theme-related preferences are set, the function exits without changing the theme.
 * This function has a side effect of modifying pref.theme.
 * @param {Date} date The `Date` object that represents the current date and time.
 * @returns {string} The current time in the format "hours:minutes AM/PM".
 */
function initThemeDayNightMode(date) {
	if (!pref.themeDayNightMode) return;

	// * Safeguard to handle number values and convert them to string with default end hour
	if (typeof pref.themeDayNightMode === 'number') {
		pref.themeDayNightMode = `${pref.themeDayNightMode}-18`; // Defaulting end hour to 18 (6 PM)
	} else if (typeof pref.themeDayNightMode === 'string' && !pref.themeDayNightMode.includes('-')) {
		pref.themeDayNightMode = `${pref.themeDayNightMode}-${pref.themeDayNightMode}`; // Same start and end hour
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();

	// * Parse the start and end times from the themeDayNightMode string
	const [startHourStr, endHourStr] = pref.themeDayNightMode.split('-').map(Number);
	const startHour = parseInt(startHourStr, 10);
	const rawEndHour = parseInt(endHourStr, 10);
	const endHour = rawEndHour === 0 ? 24 : rawEndHour;

	// * Determine if the current time is within the day range, the day range can wrap around midnight (e.g '23-6' means 23:00 to 06:00).
	const isDayRange = hours >= startHour && hours < endHour;
	const isNightRange = hours >= startHour || hours < endHour;
	const isDayTime = startHour < endHour ? isDayRange : isNightRange;

	// * Formatting time
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
	const formattedHours = hours % 12 || 12;
	const timeSuffix = hours >= 12 ? 'PM' : 'AM';

	// * Set theme based on day time
	pref.themeDayNightTime = isDayTime ? 'day' : 'night';
	setThemeDayNightTheme(isDayTime);

	return `${formattedHours}:${formattedMinutes} ${timeSuffix}`;
}


/**
 * Sets the theme based on the time of day.
 * Used to switch between day and night mode by applying the corresponding theme settings.
 * @param {boolean} isDaytime When true, the daytime theme is applied; otherwise, the nighttime theme is applied.
 */
function setThemeDayNightTheme(isDaytime) {
	const _day_night = isDaytime ? '_day' : '_night';

	pref.theme = pref[`theme${_day_night}`];
	pref.styleNighttime = pref[`styleNighttime${_day_night}`];
	pref.styleBevel = pref[`styleBevel${_day_night}`];
	pref.styleBlend = pref[`styleBlend${_day_night}`];
	pref.styleBlend2 = pref[`styleBlend2${_day_night}`];
	pref.styleGradient = pref[`styleGradient${_day_night}`];
	pref.styleGradient2 = pref[`styleGradient2${_day_night}`];
	pref.styleAlternative = pref[`styleAlternative${_day_night}`];
	pref.styleAlternative2 = pref[`styleAlternative2${_day_night}`];
	pref.styleBlackAndWhite = pref[`styleBlackAndWhite${_day_night}`];
	pref.styleBlackAndWhite2 = pref[`styleBlackAndWhite2${_day_night}`];
	pref.styleBlackAndWhiteReborn = pref[`styleBlackAndWhiteReborn${_day_night}`];
	pref.styleBlackReborn = pref[`styleBlackReborn${_day_night}`];
	pref.styleRebornWhite = pref[`styleRebornWhite${_day_night}`];
	pref.styleRebornBlack = pref[`styleRebornBlack${_day_night}`];
	pref.styleRebornFusion = pref[`styleRebornFusion${_day_night}`];
	pref.styleRebornFusion2 = pref[`styleRebornFusion2${_day_night}`];
	pref.styleRebornFusionAccent = pref[`styleRebornFusionAccent${_day_night}`];
	pref.styleRandomPastel = pref[`styleRandomPastel${_day_night}`];
	pref.styleRandomDark = pref[`styleRandomDark${_day_night}`];
	pref.styleRandomAutoColor = pref[`styleRandomAutoColor${_day_night}`];
	pref.styleTopMenuButtons = pref[`styleTopMenuButtons${_day_night}`];
	pref.styleTransportButtons = pref[`styleTransportButtons${_day_night}`];
	pref.styleProgressBarDesign = pref[`styleProgressBarDesign${_day_night}`];
	pref.styleProgressBar = pref[`styleProgressBar${_day_night}`];
	pref.styleProgressBarFill = pref[`styleProgressBarFill${_day_night}`];
	pref.styleVolumeBarDesign = pref[`styleVolumeBarDesign${_day_night}`];
	pref.styleVolumeBar = pref[`styleVolumeBar${_day_night}`];
	pref.styleVolumeBarFill = pref[`styleVolumeBarFill${_day_night}`];
	pref.themeBrightness = pref[`themeBrightness${_day_night}`];
	pref.preset = pref[`preset${_day_night}`];
}


/**
 * Sets and updates the theme style to the daytime or nighttime theme when selecting a theme style in top menu Options > Style.
 * Used when daytime or nighttime theme setup is active.
 */
function setThemeDayNightStyle() {
	const _day_night = pref.themeSetupDay ? '_day' : '_night';

	pref[`theme${_day_night}`] = pref.theme;
	pref[`styleNighttime${_day_night}`] = pref.styleNighttime;
	pref[`styleBevel${_day_night}`] = pref.styleBevel;
	pref[`styleBlend${_day_night}`] = pref.styleBlend;
	pref[`styleBlend2${_day_night}`] = pref.styleBlend2;
	pref[`styleGradient${_day_night}`] = pref.styleGradient;
	pref[`styleGradient2${_day_night}`] = pref.styleGradient2;
	pref[`styleAlternative${_day_night}`] = pref.styleAlternative;
	pref[`styleAlternative2${_day_night}`] = pref.styleAlternative2;
	pref[`styleBlackAndWhite${_day_night}`] = pref.styleBlackAndWhite;
	pref[`styleBlackAndWhite2${_day_night}`] = pref.styleBlackAndWhite2;
	pref[`styleBlackAndWhiteReborn${_day_night}`] = pref.styleBlackAndWhiteReborn;
	pref[`styleBlackReborn${_day_night}`] = pref.styleBlackReborn;
	pref[`styleRebornWhite${_day_night}`] = pref.styleRebornWhite;
	pref[`styleRebornBlack${_day_night}`] = pref.styleRebornBlack;
	pref[`styleRebornFusion${_day_night}`] = pref.styleRebornFusion;
	pref[`styleRebornFusion2${_day_night}`] = pref.styleRebornFusion2;
	pref[`styleRebornFusionAccent${_day_night}`] = pref.styleRebornFusionAccent;
	pref[`styleRandomPastel${_day_night}`] = pref.styleRandomPastel;
	pref[`styleRandomDark${_day_night}`] = pref.styleRandomDark;
	pref[`styleRandomAutoColor${_day_night}`] = pref.styleRandomAutoColor;
	pref[`styleTopMenuButtons${_day_night}`] = pref.styleTopMenuButtons;
	pref[`styleTransportButtons${_day_night}`] = pref.styleTransportButtons;
	pref[`styleProgressBarDesign${_day_night}`] = pref.styleProgressBarDesign;
	pref[`styleProgressBar${_day_night}`] = pref.styleProgressBar;
	pref[`styleProgressBarFill${_day_night}`] = pref.styleProgressBarFill;
	pref[`styleVolumeBarDesign${_day_night}`] = pref.styleVolumeBarDesign;
	pref[`styleVolumeBar${_day_night}`] = pref.styleVolumeBar;
	pref[`styleVolumeBarFill${_day_night}`] = pref.styleVolumeBarFill;
	pref[`themeBrightness${_day_night}`] = pref.themeBrightness;
	pref[`preset${_day_night}`] = pref.preset;
}


/**
 * Start the theme day/night mode initialization before drawing the preloader.
 */
if (pref.themeDayNightMode) {
	initThemeDayNightMode(new Date());
	const [dayStart, nightStart] = pref.themeDayNightMode.split('-');
	console.log(`Theme day/night mode is active, current time is: ${initThemeDayNightMode(new Date())}. The schedule has been set to ${To12HourTimeFormat(dayStart)} (day) - ${To12HourTimeFormat(nightStart)} (night).`);
}


///////////////////
// * PRELOADER * //
///////////////////
/**
 * Draws the preloader on foobar startup or reload.
 *
 * This callback will be overridden by the main UI once the theme loads.
 * @param {GdiGraphics} gr
 */
function on_paint(gr) {
	// * SYSTEM * //
	const ww = window.Width;
	const wh = window.Height;
	const col = {};
	const RES_4K = pref.displayRes === '4K' || (ww > 3000 || wh > 1300);

	// * FONTS * //
	const fontLowerBarBold  = pref.customThemeFonts ? customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md';
	const fontLowerBarLight = pref.customThemeFonts ? customFont.fontLowerBarTitle  : 'HelveticaNeueLT Pro 45 Lt';

	const ft_lower_bar_bold = Font(fontLowerBarBold,
		pref.layout === 'compact' ? pref.lowerBarFontSize_compact || 16 :
		pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork || 16 :
		pref.lowerBarFontSize_default || 18, 0);

	const ft_lower_bar_light = Font(fontLowerBarLight,
		pref.layout === 'compact' ? pref.lowerBarFontSize_compact || 16 :
		pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork || 16 :
		pref.lowerBarFontSize_default || 18, 0);

	// * GEOMETRY * //
	const lowerBarHeight = SCALE(120);
	const lowerBarTop = pref.layout !== 'default' ? wh - lowerBarHeight + (RES_4K ? 33 : 18) : wh - lowerBarHeight + (RES_4K ? 65 : 35);
	const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower_bar_light, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower_bar_light, 0, 0, 0, 0);

	const progressBar = {
		x: pref.layout !== 'default' ? SCALE(20) : SCALE(40),
		y: pref.layout !== 'default' ? Math.round(lowerBarTop + titleMeasurements.Height + SCALE(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + SCALE(12) + (ww > 1920 ? 2 : 0)),
		w: pref.layout !== 'default' ? ww - SCALE(40) : ww - SCALE(80),
		h: pref.layout !== 'default' ? SCALE(10) + (ww > 1920 ? 2 : 0) : SCALE(12) + (ww > 1920 ? 2 : 0)
	};

	// * COLORS * //
	const themeNight = pref.themeDayNightMode && pref.themeDayNightTime === 'night' && !pref.styleRebornWhite;
	const styleNight = pref.styleNighttime && !pref.styleRebornWhite;
	const pref_theme_neon = ['nblue', 'ngreen', 'nred', 'ngold'].includes(pref.theme);
	const pref_theme_custom = pref.theme && pref.theme.startsWith('custom');
	const customThemes = { custom01: customTheme01, custom02: customTheme02, custom03: customTheme03, custom04: customTheme04,	custom05: customTheme05, custom06: customTheme06, custom07: customTheme07, custom08: customTheme08, custom09: customTheme09, custom10: customTheme10 };
	const customTheme = customThemes[pref.theme];

	col.bg =
		pref.theme === 'white' ? pref.styleBlackAndWhite ? RGB(230, 230, 230) : pref.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref.theme === 'black' ? RGB(25, 25, 25) :
		pref.theme === 'reborn' || pref.theme === 'random' ? styleNight || pref.styleRebornBlack || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref.theme === 'blue' ? RGB(5, 110, 195) :
		pref.theme === 'darkblue' ? RGB(22, 40, 63) :
		pref.theme === 'red' ? RGB(100, 20, 20) :
		pref.theme === 'cream' ? RGB(255, 247, 240) :
		pref_theme_neon ? RGB(20, 20, 20) :
		pref_theme_custom ? customTheme.preloaderBg !== '' ? HEXtoRGB(customTheme.preloaderBg) : styleNight || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245) : '';

	col.lowerBarTitle =
		pref.theme === 'white' ? RGB(120, 120, 120) :
		pref.theme === 'black' ? RGB(200, 200, 200) :
		pref.theme === 'reborn' || pref.theme === 'random' ? themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120) :
		pref.theme === 'blue' ? RGB(255, 255, 255) :
		pref.theme === 'darkblue' ? RGB(255, 255, 255) :
		pref.theme === 'red' ? RGB(220, 220, 220) :
		pref.theme === 'cream' ? RGB(100, 100, 100) :
		pref_theme_neon ? RGB(200, 200, 200) :
		pref_theme_custom ? customTheme.preloaderLowerBarTitle !== '' ? HEXtoRGB(customTheme.preloaderLowerBarTitle) : styleNight || themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120) : '';

	col.progressBar =
		pref.theme === 'white' ? pref.styleBlackAndWhite ? RGB(210, 210, 210) : pref.styleBlackAndWhite2 ? RGB(40, 40, 40) : RGB(220, 220, 220) :
		pref.theme === 'black' ? RGB(35, 35, 35) :
		pref.theme === 'reborn' || pref.theme === 'random' ? styleNight || pref.styleRebornBlack ? RGB(50, 50, 50) : themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220) :
		pref.theme === 'blue' ? RGB(10, 130, 220) :
		pref.theme === 'darkblue' ? RGB(27, 55, 90) :
		pref.theme === 'red' ? RGB(140, 25, 25) :
		pref.theme === 'cream' ? RGB(255, 255, 255) :
		pref_theme_neon ? RGB(35, 35, 35) :
		pref_theme_custom ? customTheme.preloaderProgressBar !== '' ? HEXtoRGB(customTheme.preloaderProgressBar) : styleNight || themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220) : '';

	col.progressBarFill =
		pref.theme === 'white' ? pref.styleBlackAndWhite ? RGB(255, 255, 255) : pref.styleBlackAndWhite2 ? RGB(210, 210, 210) : RGB(25, 160, 240) :
		pref.theme === 'black' ? RGB(175, 205, 225) :
		pref.theme === 'reborn' ? styleNight ? RGB(195, 225, 230) : pref.styleRebornBlack || themeNight ? RGB(255, 255, 255) : RGB(90, 90, 90) :
		pref.theme === 'random' ? styleNight ? RGB(140, 215, 215) : themeNight ? RGB(255, 255, 255) : RGB(70, 70, 70) :
		pref.theme === 'blue' ? RGB(242, 230, 170) :
		pref.theme === 'darkblue' ? RGB(255, 202, 128) :
		pref.theme === 'red' ? RGB(245, 212, 165) :
		pref.theme === 'cream' ? RGB(120, 170, 130) :
		pref.theme === 'nblue' ? RGB(0, 200, 255) :
		pref.theme === 'ngreen' ? RGB(0, 200, 0) :
		pref.theme === 'nred' ? RGB(240, 10, 60) :
		pref.theme === 'ngold' ? RGB(255, 205, 5) :
		pref_theme_custom ? customTheme.preloaderProgressBarFill !== '' ? HEXtoRGB(customTheme.preloaderProgressBarFill) : styleNight || themeNight ? RGB(225, 225, 195) : RGB(50, 25, 70) : '';

	col.progressBarFrame =
		pref.theme === 'blue' ? RGB(22, 107, 186) :
		pref.theme === 'darkblue' ? RGB(22, 37, 54) :
		pref.theme === 'red' ? RGB(92, 21, 21) :
		pref.theme === 'cream' ? RGB(230, 230, 230) :
		pref_theme_custom ? customTheme.preloaderProgressBarFrame !== '' ? HEXtoRGB(customTheme.preloaderProgressBarFrame) : styleNight || themeNight ? RGB(25, 25, 25) : RGB(255, 255, 255) : '';

	col.uiHacksFrame =
		pref.theme === 'white' ? pref.styleBlackAndWhite ? RGB(230, 230, 230) : pref.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref.theme === 'black' ? RGB(35, 35, 35) :
		pref.theme === 'reborn' || pref.theme === 'random' ? styleNight || pref.styleRebornBlack || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref.theme === 'blue' ? RGB(63, 155, 202) :
		pref.theme === 'darkblue' ? RGB(27, 55, 90) :
		pref.theme === 'red' ? RGB(125, 0, 0) :
		pref.theme === 'cream' ? RGB(255, 247, 240) :
		pref_theme_neon ? RGB(30, 30, 30) :
		pref_theme_custom ? customTheme.preloaderUIHacksFrame !== '' ? HEXtoRGB(customTheme.preloaderUIHacksFrame) : styleNight || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245) : '';

	gr.SetSmoothingMode(3);

	// * BACKGROUND * //
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// * UIHacks aero glass shadow frame fix
	gr.DrawLine(0, 0, ww, 0, 1, col.uiHacksFrame);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, col.uiHacksFrame);

	// * LOGO/TEXT * //
	if (pref.showPreloaderLogo) {
		drawLogo(gr);
	} else {
		gr.DrawString(loadStrs.loading, ft_lower_bar_bold, col.lowerBarTitle, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
		gr.DrawString(loadStrs.fileName, ft_lower_bar_light, col.lowerBarTitle, progressBar.x + loadingWidth + SCALE(20), lowerBarTop, progressBar.w - loadingWidth - SCALE(20), titleMeasurements.Height);
	}

	// * PROGRESS BAR * //
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.progressBar);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, col.progressBarFill);
	if ((['blue', 'darkblue', 'red', 'cream'].includes(pref.theme) || pref_theme_custom) && !pref.systemFirstLaunch) {
		gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, col.progressBarFrame);
	}
}


/////////////////////////
// * PRELOADER LOGOS * //
/////////////////////////
/**
 * Draws the logo in the preloader.
 * @param {GdiGraphics} gr
 */
function drawLogo(gr) {
	// * SYSTEM * //
	const ww = window.Width;
	const wh = window.Height;
	const RES_4K = pref.displayRes === '4K' || (ww > 3000 || wh > 1300);
	const plus4k = RES_4K ? '4K-' : '';
	const pref_theme_custom = pref.theme && pref.theme.startsWith('custom');

	// * CUSTOM LOGO * //
	const logoNight = pref.styleNighttime ? '-night' : '';
	const customLogo = `custom-logo${logoNight}.png`;

	// * CUSTOM THEME LOGO * //
	const customThemes = { custom01: customTheme01, custom02: customTheme02, custom03: customTheme03, custom04: customTheme04,	custom05: customTheme05, custom06: customTheme06, custom07: customTheme07, custom08: customTheme08, custom09: customTheme09, custom10: customTheme10 };
	const customTheme = customThemes[pref.theme];
	const customThemeLogoConfig = customTheme && customTheme.preloaderLogo !== '';
	const cThemeLogo = customTheme && customTheme.preloaderLogo;

	// * NIGHTTIME LOGOS * //
	const nighttime = (pref.styleNighttime || pref.themeDayNightMode && pref.themeDayNightTime === 'night') && !pref.styleRebornWhite;
	const nighttimeReborn = nighttime && pref.theme === 'reborn';
	const nighttimeRandom = nighttime && pref.theme === 'random';
	const nighttimeCustom = nighttime && pref_theme_custom;

	// * PATHS * //
	const paths = {};
	const logoPath = `${fb.ProfilePath}georgia-reborn\\images\\logo\\`;
	const logoPathCustom = `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\`;

	switch (true) {
		// Nighttime logos
		case nighttimeReborn:           paths.logo = `${logoPath}${plus4k}logo-reborn-night.png`; break;
		case nighttimeRandom:           paths.logo = `${logoPath}${plus4k}logo-random-night.png`; break;
		case nighttimeCustom:           paths.logo = `${logoPath}${plus4k}logo-custom-night.png`; break;
		// Style logos
		case pref.styleBlackAndWhite:   paths.logo = `${logoPath}${plus4k}logo-black-white.png`;  break;
		case pref.styleBlackAndWhite2:  paths.logo = `${logoPath}${plus4k}logo-black-white2.png`; break;
		case pref.styleBlackReborn:     paths.logo = `${logoPath}${plus4k}logo-black-reborn.png`; break;
		case pref.styleRebornBlack:     paths.logo = `${logoPath}${plus4k}logo-reborn-night.png`; break;
		// Standard logos
		case pref.theme === 'white':    paths.logo = `${logoPath}${plus4k}logo-white.png`;        break;
		case pref.theme === 'black':    paths.logo = `${logoPath}${plus4k}logo-black.png`;        break;
		case pref.theme === 'reborn':   paths.logo = `${logoPath}${plus4k}logo-reborn.png`;       break;
		case pref.theme === 'random':   paths.logo = `${logoPath}${plus4k}logo-random.png`;       break;
		case pref.theme === 'blue':     paths.logo = `${logoPath}${plus4k}logo-blue.png`;         break;
		case pref.theme === 'darkblue': paths.logo = `${logoPath}${plus4k}logo-dark-blue.png`;    break;
		case pref.theme === 'red':      paths.logo = `${logoPath}${plus4k}logo-red.png`;          break;
		case pref.theme === 'cream':    paths.logo = `${logoPath}${plus4k}logo-cream.png`;        break;
		case pref.theme === 'nblue':    paths.logo = `${logoPath}${plus4k}logo-neon-blue.png`;    break;
		case pref.theme === 'ngreen':   paths.logo = `${logoPath}${plus4k}logo-neon-green.png`;   break;
		case pref.theme === 'nred':     paths.logo = `${logoPath}${plus4k}logo-neon-red.png`;     break;
		case pref.theme === 'ngold':    paths.logo = `${logoPath}${plus4k}logo-neon-gold.png`;    break;
		case pref_theme_custom:         paths.logo = `${logoPath}${plus4k}logo-custom.png`;       break;
	}
	// Custom logos
	if (pref.customPreloaderLogo) paths.logo = `${logoPathCustom}_${plus4k}${customLogo}`;
	if (customThemeLogoConfig)    paths.logo = `${logoPathCustom}${plus4k}${cThemeLogo}`;

	// * LOGO * //
	if (typeof drawLogo.logoErrorShown === 'undefined') {
		drawLogo.logoErrorShown = false;
	}
	if (utils.IsFile(paths.logo)) {
		const logo = gdi.Image(paths.logo);
		gr.DrawImage(logo, window.Width * 0.5 - logo.Width * 0.5, window.Height * 0.5 - logo.Height * 0.5, logo.Width, logo.Height, 0, 0, logo.Width, logo.Height);
	}
	else if (!drawLogo.logoErrorShown) {
		const customLogoPath = `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\`;
		fb.ShowPopupMessage(`Logo file not found:\n\nIf you are using a custom logo, please ensure the file exists and has the correct name at the following location:\n\n${customLogoPath}\n\nImportant: Do not include the "4K-" prefix in your filename.\nThe script applies this prefix automatically, adding it manually will lead to naming issues such as "4K-4K-logoname.png".`, 'Logo error');
		drawLogo.logoErrorShown = true;
	}
}
