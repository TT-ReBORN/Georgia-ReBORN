/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Preloader                                * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
window.DefineScript('Georgia-ReBORN', {
	author: 'TT',
	version: window.GetProperty('Georgia-ReBORN - #Version: Do not hand edit!', '3.0-DEV'),
	features: { drag_n_drop: true }
});

/** @global @type {{ loading: string; fileName: string; fileIndex: number }} */
const loadStr = { loading: 'Loading:', fileName: '', fileIndex: 0 };
/** @global @type {number} */
const startTime = Date.now();


////////////////////////////
// * SYSTEM FILE LOADER * //
////////////////////////////
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-helpers.js`);
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-common.js`);
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-config.js`);
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-config-defaults.js`);
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-settings.js`);
include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-setup.js`);


///////////////////////////
// * ASYNC FILE LOADER * //
///////////////////////////
/** @global @type {string} */
const fileList = [
	'playlist\\pl-main.js',
	'playlist\\scripts\\pl-helpers.js',
	'playlist\\scripts\\pl-setup.js',
	'playlist\\scripts\\pl-properties.js',
	'playlist\\scripts\\pl-components.js',
	'playlist\\scripts\\pl-controls.js',
	'playlist\\scripts\\pl-list.js',
	'playlist\\scripts\\pl-list-content.js',
	'playlist\\scripts\\pl-list-header.js',
	'playlist\\scripts\\pl-list-row.js',
	'playlist\\scripts\\pl-callbacks.js',
	'playlist\\scripts\\pl-playlist.js',
	'library\\lib-main.js',
	'library\\scripts\\lib-helpers.js',
	'library\\scripts\\lib-properties.js',
	'library\\scripts\\lib-interface.js',
	'library\\scripts\\lib-panel.js',
	'library\\scripts\\lib-scrollbar.js',
	'library\\scripts\\lib-library.js',
	'library\\scripts\\lib-populate.js',
	'library\\scripts\\lib-search.js',
	'library\\scripts\\lib-buttons.js',
	'library\\scripts\\lib-popupbox.js',
	'library\\scripts\\lib-timers.js',
	'library\\scripts\\lib-menu.js',
	'library\\scripts\\lib-initialise.js',
	'library\\scripts\\lib-images.js',
	'library\\scripts\\lib-callbacks.js',
	'biography\\bio-main.js',
	'biography\\scripts\\bio-helpers.js',
	'biography\\scripts\\bio-properties.js',
	'biography\\scripts\\bio-settings.js',
	'biography\\scripts\\bio-interface.js',
	'biography\\scripts\\bio-language.js',
	'biography\\scripts\\bio-panel.js',
	'biography\\scripts\\bio-server.js',
	'biography\\scripts\\bio-allmusic.js',
	'biography\\scripts\\bio-lastfm.js',
	'biography\\scripts\\bio-wikipedia.js',
	'biography\\scripts\\bio-names.js',
	'biography\\scripts\\bio-scrollbar.js',
	'biography\\scripts\\bio-buttons.js',
	'biography\\scripts\\bio-menu.js',
	'biography\\scripts\\bio-text.js',
	'biography\\scripts\\bio-lyrics.js',
	'biography\\scripts\\bio-tagger.js',
	'biography\\scripts\\bio-resize.js',
	'biography\\scripts\\bio-library.js',
	'biography\\scripts\\bio-images.js',
	'biography\\scripts\\bio-filmstrip.js',
	'biography\\scripts\\bio-timers.js',
	'biography\\scripts\\bio-popupbox.js',
	'biography\\scripts\\bio-initialise.js',
	'biography\\scripts\\bio-callbacks.js',
	'base\\gr-display.js',
	'base\\gr-color.js',
	'base\\gr-theme-colors.js',
	'base\\gr-theme-presets.js',
	'base\\gr-menu-context.js',
	'base\\gr-menu-custom.js',
	'base\\gr-menu.js',
	'base\\gr-buttons.js',
	'base\\gr-main.js',
	'base\\gr-main-components.js',
	'base\\gr-lyrics.js',
	'base\\gr-callbacks.js',
	'base\\gr-initialize.js'
];


/**
 * Loads script files asynchronously on foobar startup or reload.
 * @global
 * @param {string} filePath - The path to the file to load.
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
 * @global
 * @param {string[]} fileList - The list of files to load.
 * @param {number} startTime - The timestamp marking the start of the operation, used for calculating total load time and UI update intervals.
 */
async function includeFiles(fileList, startTime) {
	if (grSet.asyncThemePreloader) {
		const refreshTime = 16; // ~60Hz
		let lastRepaintTime = startTime;
		for (let i = 0; i < fileList.length; i++) {
			loadStr.fileName = `${fileList[i]} ...`;
			loadStr.fileIndex = i;
			const currentTime = Date.now();
			if (currentTime - lastRepaintTime > refreshTime) {
				lastRepaintTime = currentTime;
				window.Repaint();
			}
			await loadAsyncFile(`${fb.ProfilePath}georgia-reborn\\scripts\\${fileList[i]}`);
		}
		return;
	}
	for (const filePath of fileList) {
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\${filePath}`);
	}
}


/**
 * Start loading all Georgia-ReBORN scripts from fileList and schedule an update check.
 */
includeFiles(fileList, startTime).then(() => {
	console.log(`Georgia-ReBORN loaded in ${Date.now() - startTime}ms`);

	if (grSet.checkForUpdates) {
		grCfg.scheduleUpdateCheck(0);
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
 * @global
 * @param {Date} date - The `Date` object that represents the current date and time.
 * @returns {string|null} The current time in the format "hours:minutes AM/PM" or null.
 */
function initThemeDayNightMode(date) {
	if (!grSet.themeDayNightMode) return null;

	// * Safeguard to handle number values and convert them to string with default end hour
	if (typeof grSet.themeDayNightMode === 'number') {
		grSet.themeDayNightMode = `${grSet.themeDayNightMode}-18`; // Defaulting end hour to 18 (6 PM)
	} else if (typeof grSet.themeDayNightMode === 'string' && !grSet.themeDayNightMode.includes('-')) {
		grSet.themeDayNightMode = `${grSet.themeDayNightMode}-${grSet.themeDayNightMode}`; // Same start and end hour
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();

	// * Parse the start and end times from the themeDayNightMode string
	const [startHourStr, endHourStr] = grSet.themeDayNightMode.split('-').map(Number);
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
	grSet.themeDayNightTime = isDayTime ? 'day' : 'night';
	setThemeDayNightTheme(isDayTime);

	return `${formattedHours}:${formattedMinutes} ${timeSuffix}`;
}


/**
 * Sets the theme based on the time of day.
 * Used to switch between day and night mode by applying the corresponding theme settings.
 * @global
 * @param {boolean} isDaytime - When true, the daytime theme is applied; otherwise, the nighttime theme is applied.
 */
function setThemeDayNightTheme(isDaytime) {
	const _day_night = isDaytime ? '_day' : '_night';

	grSet.theme = grSet[`theme${_day_night}`];
	grSet.styleNighttime = grSet[`styleNighttime${_day_night}`];
	grSet.styleBevel = grSet[`styleBevel${_day_night}`];
	grSet.styleBlend = grSet[`styleBlend${_day_night}`];
	grSet.styleBlend2 = grSet[`styleBlend2${_day_night}`];
	grSet.styleGradient = grSet[`styleGradient${_day_night}`];
	grSet.styleGradient2 = grSet[`styleGradient2${_day_night}`];
	grSet.styleAlternative = grSet[`styleAlternative${_day_night}`];
	grSet.styleAlternative2 = grSet[`styleAlternative2${_day_night}`];
	grSet.styleBlackAndWhite = grSet[`styleBlackAndWhite${_day_night}`];
	grSet.styleBlackAndWhite2 = grSet[`styleBlackAndWhite2${_day_night}`];
	grSet.styleBlackAndWhiteReborn = grSet[`styleBlackAndWhiteReborn${_day_night}`];
	grSet.styleBlackReborn = grSet[`styleBlackReborn${_day_night}`];
	grSet.styleRebornWhite = grSet[`styleRebornWhite${_day_night}`];
	grSet.styleRebornBlack = grSet[`styleRebornBlack${_day_night}`];
	grSet.styleRebornFusion = grSet[`styleRebornFusion${_day_night}`];
	grSet.styleRebornFusion2 = grSet[`styleRebornFusion2${_day_night}`];
	grSet.styleRebornFusionAccent = grSet[`styleRebornFusionAccent${_day_night}`];
	grSet.styleRandomPastel = grSet[`styleRandomPastel${_day_night}`];
	grSet.styleRandomDark = grSet[`styleRandomDark${_day_night}`];
	grSet.styleRandomAutoColor = grSet[`styleRandomAutoColor${_day_night}`];
	grSet.styleTopMenuButtons = grSet[`styleTopMenuButtons${_day_night}`];
	grSet.styleTransportButtons = grSet[`styleTransportButtons${_day_night}`];
	grSet.styleProgressBarDesign = grSet[`styleProgressBarDesign${_day_night}`];
	grSet.styleProgressBar = grSet[`styleProgressBar${_day_night}`];
	grSet.styleProgressBarFill = grSet[`styleProgressBarFill${_day_night}`];
	grSet.styleVolumeBarDesign = grSet[`styleVolumeBarDesign${_day_night}`];
	grSet.styleVolumeBar = grSet[`styleVolumeBar${_day_night}`];
	grSet.styleVolumeBarFill = grSet[`styleVolumeBarFill${_day_night}`];
	grSet.themeBrightness = grSet[`themeBrightness${_day_night}`];
	grSet.preset = grSet[`preset${_day_night}`];
}


/**
 * Sets and updates the theme style to the daytime or nighttime theme when selecting a theme style in top menu Options > Style.
 * Used when daytime or nighttime theme setup is active.
 * @global
 */
function setThemeDayNightStyle() {
	const _day_night = grSet.themeSetupDay ? '_day' : '_night';

	grSet[`theme${_day_night}`] = grSet.theme;
	grSet[`styleNighttime${_day_night}`] = grSet.styleNighttime;
	grSet[`styleBevel${_day_night}`] = grSet.styleBevel;
	grSet[`styleBlend${_day_night}`] = grSet.styleBlend;
	grSet[`styleBlend2${_day_night}`] = grSet.styleBlend2;
	grSet[`styleGradient${_day_night}`] = grSet.styleGradient;
	grSet[`styleGradient2${_day_night}`] = grSet.styleGradient2;
	grSet[`styleAlternative${_day_night}`] = grSet.styleAlternative;
	grSet[`styleAlternative2${_day_night}`] = grSet.styleAlternative2;
	grSet[`styleBlackAndWhite${_day_night}`] = grSet.styleBlackAndWhite;
	grSet[`styleBlackAndWhite2${_day_night}`] = grSet.styleBlackAndWhite2;
	grSet[`styleBlackAndWhiteReborn${_day_night}`] = grSet.styleBlackAndWhiteReborn;
	grSet[`styleBlackReborn${_day_night}`] = grSet.styleBlackReborn;
	grSet[`styleRebornWhite${_day_night}`] = grSet.styleRebornWhite;
	grSet[`styleRebornBlack${_day_night}`] = grSet.styleRebornBlack;
	grSet[`styleRebornFusion${_day_night}`] = grSet.styleRebornFusion;
	grSet[`styleRebornFusion2${_day_night}`] = grSet.styleRebornFusion2;
	grSet[`styleRebornFusionAccent${_day_night}`] = grSet.styleRebornFusionAccent;
	grSet[`styleRandomPastel${_day_night}`] = grSet.styleRandomPastel;
	grSet[`styleRandomDark${_day_night}`] = grSet.styleRandomDark;
	grSet[`styleRandomAutoColor${_day_night}`] = grSet.styleRandomAutoColor;
	grSet[`styleTopMenuButtons${_day_night}`] = grSet.styleTopMenuButtons;
	grSet[`styleTransportButtons${_day_night}`] = grSet.styleTransportButtons;
	grSet[`styleProgressBarDesign${_day_night}`] = grSet.styleProgressBarDesign;
	grSet[`styleProgressBar${_day_night}`] = grSet.styleProgressBar;
	grSet[`styleProgressBarFill${_day_night}`] = grSet.styleProgressBarFill;
	grSet[`styleVolumeBarDesign${_day_night}`] = grSet.styleVolumeBarDesign;
	grSet[`styleVolumeBar${_day_night}`] = grSet.styleVolumeBar;
	grSet[`styleVolumeBarFill${_day_night}`] = grSet.styleVolumeBarFill;
	grSet[`themeBrightness${_day_night}`] = grSet.themeBrightness;
	grSet[`preset${_day_night}`] = grSet.preset;
}


/**
 * Start the theme day/night mode initialization before drawing the preloader.
 */
if (grSet.themeDayNightMode) {
	initThemeDayNightMode(new Date());
	const [dayStart, nightStart] = grSet.themeDayNightMode.split('-');
	console.log(`Theme day/night mode is active, current time is: ${initThemeDayNightMode(new Date())}. The schedule has been set to ${To12HourTimeFormat(dayStart)} (day) - ${To12HourTimeFormat(nightStart)} (night).`);
}


///////////////////
// * PRELOADER * //
///////////////////
/**
 * Draws the preloader on foobar startup or reload.
 *
 * This callback will be overridden by the main UI once the theme loads.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 */
function on_paint(gr) {
	// * SYSTEM * //
	const col = {};
	const ww = window.Width;
	const wh = window.Height;
	const RES_4K = grSet.displayRes === '4K' || ww > 2560 && wh > 1600;
	const SCALE = (val) => RES_4K ? val * 2 : val;

	// * FONTS * //
	const fontLowerBarBold  = grSet.customThemeFonts ? grCfg.customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md';
	const fontLowerBarLight = grSet.customThemeFonts ? grCfg.customFont.fontLowerBarTitle  : 'HelveticaNeueLT Pro 45 Lt';

	const ft_lower_bar_bold = Font(fontLowerBarBold,
		grSet.layout === 'compact' ? SCALE(grSet.lowerBarFontSize_compact) || SCALE(16) :
		grSet.layout === 'artwork' ? SCALE(grSet.lowerBarFontSize_artwork) || SCALE(16) :
									 SCALE(grSet.lowerBarFontSize_default) || SCALE(18), 0);

	const ft_lower_bar_light = Font(fontLowerBarLight,
		grSet.layout === 'compact' ? SCALE(grSet.lowerBarFontSize_compact) || SCALE(16) :
		grSet.layout === 'artwork' ? SCALE(grSet.lowerBarFontSize_artwork) || SCALE(16) :
									 SCALE(grSet.lowerBarFontSize_default) || SCALE(18), 0);

	// * GEOMETRY * //
	const layoutNotDefault = grSet.layout !== 'default';
	const correction = layoutNotDefault ? (RES_4K ? 33 : 18) : (RES_4K ? 65 : 35);
	const lowerBarHeight = SCALE(120);
	const lowerBarTop = wh - lowerBarHeight + correction;
	const loadingWidth = Math.ceil(gr.MeasureString(loadStr.loading, ft_lower_bar_light, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStr.fileName, ft_lower_bar_light, 0, 0, 0, 0);

	const progressBar = {
		x: SCALE(layoutNotDefault ? 20 : 40),
		y: Math.round(lowerBarTop + titleMeasurements.Height + SCALE(layoutNotDefault ? 10 : 12) + (ww > 1920 ? 2 : 0)),
		w: ww - SCALE(layoutNotDefault ? 40 : 80),
		h: SCALE(layoutNotDefault ? 10 : 12) + (ww > 1920 ? 2 : 0)
	};

	// * COLORS * //
	const themeNight = grSet.themeDayNightMode && grSet.themeDayNightTime === 'night' && !grSet.styleRebornWhite;
	const styleNight = grSet.styleNighttime && !grSet.styleRebornWhite;
	const pref_theme_neon = ['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme);
	const pref_theme_custom = grSet.theme && grSet.theme.startsWith('custom');
	const customThemes = { custom01: grCfg.customTheme01, custom02: grCfg.customTheme02, custom03: grCfg.customTheme03, custom04: grCfg.customTheme04, custom05: grCfg.customTheme05, custom06: grCfg.customTheme06, custom07: grCfg.customTheme07, custom08: grCfg.customTheme08, custom09: grCfg.customTheme09, custom10: grCfg.customTheme10 };
	const customTheme = customThemes[grSet.theme];

	col.bg = ({
		white: grSet.styleBlackAndWhite ? RGB(230, 230, 230) : grSet.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245),
		black: RGB(25, 25, 25),
		reborn: (styleNight || grSet.styleRebornBlack || themeNight) ? RGB(25, 25, 25) : RGB(245, 245, 245),
		random: (styleNight || grSet.styleRebornBlack || themeNight) ? RGB(25, 25, 25) : RGB(245, 245, 245),
		blue: RGB(5, 110, 195),
		darkblue: RGB(22, 40, 63),
		red: RGB(100, 20, 20),
		cream: RGB(255, 247, 240)
	}[grSet.theme] ||
		(pref_theme_neon ? RGB(20, 20, 20) :
		(pref_theme_custom && customTheme.grCol_preloaderBg !== '' ? HEXtoRGB(customTheme.grCol_preloaderBg) : (styleNight || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245))))
	);

	col.lowerBarTitle = ({
		white: RGB(120, 120, 120),
		black: RGB(200, 200, 200),
		reborn: themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120),
		random: themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120),
		blue: RGB(255, 255, 255),
		darkblue: RGB(255, 255, 255),
		red: RGB(220, 220, 220),
		cream: RGB(100, 100, 100)
	}[grSet.theme] ||
		(pref_theme_neon ? RGB(200, 200, 200) :
		(pref_theme_custom && customTheme.grCol_preloaderLowerBarTitle !== '' ? HEXtoRGB(customTheme.grCol_preloaderLowerBarTitle) : (styleNight || themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120))))
	);

	col.progressBar = ({
		white: grSet.styleBlackAndWhite ? RGB(210, 210, 210) : grSet.styleBlackAndWhite2 ? RGB(40, 40, 40) : RGB(220, 220, 220),
		black: RGB(35, 35, 35),
		reborn: (styleNight || grSet.styleRebornBlack) ? RGB(50, 50, 50) : themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220),
		random: (styleNight || grSet.styleRebornBlack) ? RGB(50, 50, 50) : themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220),
		blue: RGB(10, 130, 220),
		darkblue: RGB(27, 55, 90),
		red: RGB(140, 25, 25),
		cream: RGB(255, 255, 255)
	}[grSet.theme] ||
		(pref_theme_neon ? RGB(35, 35, 35) :
		(pref_theme_custom && customTheme.grCol_preloaderProgressBar !== '' ? HEXtoRGB(customTheme.grCol_preloaderProgressBar) : (styleNight || themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220))))
	);

	col.progressBarFill = ({
		white: grSet.styleBlackAndWhite ? RGB(255, 255, 255) : grSet.styleBlackAndWhite2 ? RGB(210, 210, 210) : RGB(25, 160, 240),
		black: RGB(175, 205, 225),
		reborn: styleNight ? RGB(195, 225, 230) : (grSet.styleRebornBlack || themeNight) ? RGB(255, 255, 255) : RGB(90, 90, 90),
		random: styleNight ? RGB(140, 215, 215) : themeNight ? RGB(255, 255, 255) : RGB(70, 70, 70),
		blue: RGB(242, 230, 170),
		darkblue: RGB(255, 202, 128),
		red: RGB(245, 212, 165),
		cream: RGB(120, 170, 130),
		nblue: RGB(0, 200, 255),
		ngreen: RGB(0, 200, 0),
		nred: RGB(240, 10, 60),
		ngold: RGB(255, 205, 5)
	}[grSet.theme] ||
		(pref_theme_custom && customTheme.grCol_preloaderProgressBarFill !== '' ? HEXtoRGB(customTheme.grCol_preloaderProgressBarFill) : (styleNight || themeNight ? RGB(225, 225, 195) : RGB(50, 25, 70)))
	);

	col.progressBarFrame = ({
		blue: RGB(22, 107, 186),
		darkblue: RGB(22, 37, 54),
		red: RGB(92, 21, 21),
		cream: RGB(230, 230, 230)
	}[grSet.theme] ||
		(pref_theme_custom && customTheme.grCol_preloaderProgressBarFrame !== '' ? HEXtoRGB(customTheme.grCol_preloaderProgressBarFrame) : (styleNight || themeNight ? RGB(25, 25, 25) : RGB(255, 255, 255)))
	);

	col.uiHacksFrame = ({
		white: grSet.styleBlackAndWhite ? RGB(230, 230, 230) : grSet.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245),
		black: RGB(35, 35, 35),
		reborn: (styleNight || grSet.styleRebornBlack || themeNight) ? RGB(25, 25, 25) : RGB(245, 245, 245),
		random: (styleNight || grSet.styleRebornBlack || themeNight) ? RGB(25, 25, 25) : RGB(245, 245, 245),
		blue: RGB(63, 155, 202),
		darkblue: RGB(27, 55, 90),
		red: RGB(125, 0, 0),
		cream: RGB(255, 247, 240)
	}[grSet.theme] ||
		(pref_theme_neon ? RGB(30, 30, 30) :
		(pref_theme_custom && customTheme.grCol_preloaderUIHacksFrame !== '' ? HEXtoRGB(customTheme.grCol_preloaderUIHacksFrame) : (styleNight || themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245))))
	);

	gr.SetSmoothingMode(3);

	// * BACKGROUND * //
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// * UIHacks aero glass shadow frame fix
	gr.DrawLine(0, 0, ww, 0, 1, col.uiHacksFrame);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, col.uiHacksFrame);

	// * LOGO/TEXT * //
	if (grSet.showPreloaderLogo) {
		drawLogo(gr);
	} else {
		gr.DrawString(loadStr.loading, ft_lower_bar_bold, col.lowerBarTitle, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
		gr.DrawString(loadStr.fileName, ft_lower_bar_light, col.lowerBarTitle, progressBar.x + loadingWidth + SCALE(20), lowerBarTop, progressBar.w - loadingWidth - SCALE(20), titleMeasurements.Height);
	}

	// * PROGRESS BAR * //
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.progressBar);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStr.fileIndex + 1) / fileList.length, progressBar.h, col.progressBarFill);
	if ((['blue', 'darkblue', 'red', 'cream'].includes(grSet.theme) || pref_theme_custom) && !grSet.systemFirstLaunch) {
		gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, col.progressBarFrame);
	}
}


/////////////////////////
// * PRELOADER LOGOS * //
/////////////////////////
/**
 * Draws the logo in the preloader.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 */
function drawLogo(gr) {
	// * SYSTEM * //
	const ww = window.Width;
	const wh = window.Height;
	const RES_4K = grSet.displayRes === '4K' || (ww > 3000 || wh > 1300);
	const plus4K = RES_4K ? '4K-' : '';
	const custom = grSet.theme && grSet.theme.startsWith('custom');

	// * CUSTOM LOGO * //
	const logoNight = grSet.styleNighttime ? '-night' : '';
	const customLogo = `custom-logo${logoNight}.png`;

	// * CUSTOM THEME LOGO * //
	const customThemes = { custom01: grCfg.customTheme01, custom02: grCfg.customTheme02, custom03: grCfg.customTheme03, custom04: grCfg.customTheme04, custom05: grCfg.customTheme05, custom06: grCfg.customTheme06, custom07: grCfg.customTheme07, custom08: grCfg.customTheme08, custom09: grCfg.customTheme09, custom10: grCfg.customTheme10 };
	const customTheme = customThemes[grSet.theme];
	const customThemeLogoConfig = customTheme && customTheme.grCol_preloaderLogo !== '';
	const cThemeLogo = customTheme && customTheme.grCol_preloaderLogo;

	// * NIGHTTIME LOGOS * //
	const nighttime = (grSet.styleNighttime || grSet.themeDayNightMode && grSet.themeDayNightTime === 'night') && !grSet.styleRebornWhite;
	const nighttimeReborn = nighttime && grSet.theme === 'reborn';
	const nighttimeRandom = nighttime && grSet.theme === 'random';
	const nighttimeCustom = nighttime && custom;

	// * PATHS * //
	const paths = {};
	const logoPath = `${fb.ProfilePath}georgia-reborn\\images\\logo\\`;
	const logoPathCustom = `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\`;

	const logoName = {
		// Standard logos
		[grSet.theme === 'white']:    'logo-white.png',
		[grSet.theme === 'black']:    'logo-black.png',
		[grSet.theme === 'reborn']:   'logo-reborn.png',
		[grSet.theme === 'random']:   'logo-random.png',
		[grSet.theme === 'blue']:     'logo-blue.png',
		[grSet.theme === 'darkblue']: 'logo-dark-blue.png',
		[grSet.theme === 'red']:      'logo-red.png',
		[grSet.theme === 'cream']:    'logo-cream.png',
		[grSet.theme === 'nblue']:    'logo-neon-blue.png',
		[grSet.theme === 'ngreen']:   'logo-neon-green.png',
		[grSet.theme === 'nred']:     'logo-neon-red.png',
		[grSet.theme === 'ngold']:    'logo-neon-gold.png',
		[custom]:                     'logo-custom.png',
		// Style logos
		[grSet.styleBlackAndWhite]:  'logo-black-white.png',
		[grSet.styleBlackAndWhite2]: 'logo-black-white2.png',
		[grSet.styleBlackReborn]:    'logo-black-reborn.png',
		[grSet.styleRebornBlack]:    'logo-reborn-night.png',
		// Nighttime logos
		[nighttimeReborn]: 'logo-reborn-night.png',
		[nighttimeRandom]: 'logo-random-night.png',
		[nighttimeCustom]: 'logo-custom-night.png'
	};

	if (grSet.customPreloaderLogo) {
		paths.logo = `${logoPathCustom}_${plus4K}${customLogo}`;
	} else if (customThemeLogoConfig) {
		paths.logo = `${logoPathCustom}${plus4K}${cThemeLogo}`;
	} else {
		paths.logo = `${logoPath}${plus4K}${logoName.true}`;
	}

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
