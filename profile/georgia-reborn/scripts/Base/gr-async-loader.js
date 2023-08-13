/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Preloader                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-08-03                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {*} */
const panelVersion = window.GetProperty('Georgia-ReBORN - #Version: Do not hand edit!', '3.0-RC1');
/** @type {*} */
window.DefineScript('Georgia-ReBORN', { author: 'TT', version: panelVersion, features: { drag_n_drop: true } });

/** @type {string} */
const basePath = `${fb.ProfilePath}georgia-reborn\\`;
/** @type {*} */
const loadAsync = window.GetProperty('Georgia-ReBORN - 16. System: Load Theme Asynchronously', true);
/** @type {Object} */
const loadStrs = { loading: 'Loading:', fileName: '', fileIndex: 0 };
/** @type {number} */
const startTime = Date.now();

/** @type {string} */
const fileList = [
	'scripts\\base\\common\\Common.js',
	'scripts\\base\\common\\Control_ContextMenu.js',
	'scripts\\base\\common\\Control_Scrollbar.js',
	'scripts\\base\\common\\Control_List.js',
	'scripts\\base\\common\\Control_Button.js',
	'scripts\\base\\common\\Utility_LinkedList.js',
	'scripts\\base\\gr-helpers.js',
	'scripts\\base\\gr-configuration.js',
	'scripts\\base\\gr-display.js',
	'scripts\\base\\gr-defaults.js',
	'scripts\\base\\gr-settings.js',
	'scripts\\base\\gr-setup.js',
	'scripts\\playlist\\main.js',
	'scripts\\library\\main.js',
	'scripts\\library\\scripts\\helpers.js',
	'scripts\\library\\scripts\\properties.js',
	'scripts\\library\\scripts\\interface.js',
	'scripts\\library\\scripts\\panel.js',
	'scripts\\library\\scripts\\scrollbar.js',
	'scripts\\library\\scripts\\library.js',
	'scripts\\library\\scripts\\populate.js',
	'scripts\\library\\scripts\\search.js',
	'scripts\\library\\scripts\\buttons.js',
	'scripts\\library\\scripts\\popupbox.js',
	'scripts\\library\\scripts\\timers.js',
	'scripts\\library\\scripts\\menu.js',
	'scripts\\library\\scripts\\initialise.js',
	'scripts\\library\\scripts\\images.js',
	'scripts\\library\\scripts\\callbacks.js',
	'scripts\\biography\\main.js',
	'scripts\\biography\\scripts\\helpers.js',
	'scripts\\biography\\scripts\\properties.js',
	'scripts\\biography\\scripts\\settings.js',
	'scripts\\biography\\scripts\\interface.js',
	'scripts\\biography\\scripts\\language.js',
	'scripts\\biography\\scripts\\panel.js',
	'scripts\\biography\\scripts\\server.js',
	'scripts\\biography\\scripts\\allmusic.js',
	'scripts\\biography\\scripts\\lastfm.js',
	'scripts\\biography\\scripts\\wikipedia.js',
	'scripts\\biography\\scripts\\names.js',
	'scripts\\biography\\scripts\\scrollbar.js',
	'scripts\\biography\\scripts\\buttons.js',
	'scripts\\biography\\scripts\\menu.js',
	'scripts\\biography\\scripts\\text.js',
	'scripts\\biography\\scripts\\lyrics.js',
	'scripts\\biography\\scripts\\tagger.js',
	'scripts\\biography\\scripts\\resize.js',
	'scripts\\biography\\scripts\\library.js',
	'scripts\\biography\\scripts\\images.js',
	'scripts\\biography\\scripts\\filmstrip.js',
	'scripts\\biography\\scripts\\timers.js',
	'scripts\\biography\\scripts\\popupbox.js',
	'scripts\\biography\\scripts\\initialise.js',
	'scripts\\biography\\scripts\\callbacks.js',
	'scripts\\base\\gr-color.js',
	'scripts\\base\\gr-themes.js',
	'scripts\\base\\gr-theme-presets.js',
	'scripts\\base\\gr-main-components.js',
	'scripts\\base\\gr-lyrics.js',
	'scripts\\base\\gr-callbacks.js',
	'scripts\\base\\gr-main-functions.js',
	'scripts\\base\\gr-menu.js',
	'scripts\\base\\gr-menu-custom.js',
	'scripts\\base\\gr-main.js'
];


///////////////////////////
// * ASYNC FILE LOADER * //
///////////////////////////
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
 * Loads a list of files.
 *
 * If loadAsync is true, the files will be loaded asynchronously.
 * @param {string} fileList The list of files to load.
 */
async function includeFiles(fileList) {
	if (loadAsync) {
		let startTime = Date.now();
		const refreshTime = 16; // ~60Hz
		for (let i = 0; i < fileList.length; i++) {
			loadStrs.fileName = `${fileList[i]} ...`;
			loadStrs.fileIndex = i;
			const currentTime = Date.now();
			if (currentTime - startTime > refreshTime) {
				startTime = currentTime;
				window.Repaint();
			}
			await loadAsyncFile(basePath + fileList[i]);
		}
		return;
	}
	fileList.forEach(filePath => include(filePath));
}


/**
 * Start loading all Georgia-ReBORN scripts from fileList and schedule an update check.
 */
includeFiles(fileList).then(() => {
	console.log(`Georgia-ReBORN loaded in ${Date.now() - startTime}ms`);

	if (pref.checkForUpdates) {
		scheduleUpdateCheck(0);
	}
});


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
	// * PROPERTIES * //
	const pref_theme                    = window.GetProperty('Georgia-ReBORN - 01. Theme:');
	const pref_styleBlackAndWhite       = window.GetProperty('Georgia-ReBORN - 02. Style: Black and white');
	const pref_styleBlackAndWhite2      = window.GetProperty('Georgia-ReBORN - 02. Style: Black and white 2');
	const pref_layout                   = window.GetProperty('Georgia-ReBORN - 05. Layout');
	const pref_displayRes               = window.GetProperty('Georgia-ReBORN - 06. Display');
	const pref_lowerBarFontSize_default = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Default)');
	const pref_lowerBarFontSize_artwork = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Artwork)');
	const pref_lowerBarFontSize_compact = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Compact)');
	const pref_showLogoOnStartup        = window.GetProperty('Georgia-ReBORN - 09. Player controls: Show logo on startup');
	const pref_systemFirstLaunch        = window.GetProperty('Georgia-ReBORN - 16. System: System first launch');

	// * SYSTEM * //
	const RGB = (r, g, b) => (0xff000000 | (r << 16) | (g << 8) | (b));
	const SCALE = (number) => RES_4K ? number * 2 : number;
	const ww = window.Width;
	const wh = window.Height;
	const col = {};
	const RES_4K = pref_displayRes === '4K' || (ww > 3000 || wh > 1300);

	// * FONTS * //
	const Font = (name, size, style) => {
		let font;
		try {
			font = gdi.Font(name, Math.round(SCALE(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	};

	const fontLight = 'HelveticaNeueLT Pro 45 Lt';
	const fontBold  = 'HelveticaNeueLT Pro 65 Md';

	const ft_lower_bar = Font(fontLight,
		pref_layout === 'compact' ? pref_lowerBarFontSize_compact || 16 :
		pref_layout === 'artwork' ? pref_lowerBarFontSize_artwork || 16 :
		pref_lowerBarFontSize_default || 18, 0);

	const ft_lower_bar_bold = Font(fontBold,
		pref_layout === 'compact' ? pref_lowerBarFontSize_compact || 16 :
		pref_layout === 'artwork' ? pref_lowerBarFontSize_artwork || 16 :
		pref_lowerBarFontSize_default || 18, 0);

	// * GEOMETRY * //
	const lowerBarHeight = SCALE(120);
	const lowerBarTop = pref_layout !== 'default' ? wh - lowerBarHeight + (RES_4K ? 33 : 18) : wh - lowerBarHeight + (RES_4K ? 65 : 35);
	const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower_bar, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower_bar, 0, 0, 0, 0);

	const progressBar = {
		x: pref_layout !== 'default' ? SCALE(20) : SCALE(40),
		y: pref_layout !== 'default' ? Math.round(lowerBarTop + titleMeasurements.Height + SCALE(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + SCALE(12) + (ww > 1920 ? 2 : 0)),
		w: pref_layout !== 'default' ? ww - SCALE(40) : ww - SCALE(80),
		h: pref_layout !== 'default' ? SCALE(10) + (ww > 1920 ? 2 : 0) : SCALE(12) + (ww > 1920 ? 2 : 0)
	};

	// * COLORS * //
	col.bg =
		pref_theme === 'white' ? pref_styleBlackAndWhite ? RGB(230, 230, 230) : pref_styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref_theme === 'black' ? RGB(25, 25, 25) :
		pref_theme === 'reborn' || pref_theme === 'random' ? RGB(245, 245, 245) :
		pref_theme === 'blue' ? RGB(5, 110, 195) :
		pref_theme === 'darkblue' ? RGB(22, 40, 63) :
		pref_theme === 'red' ? RGB(100, 20, 20) :
		pref_theme === 'cream' ? RGB(255, 247, 240) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref_theme) ? RGB(20, 20, 20) : '';

	col.lowerBarTitle =
		pref_theme === 'white' ? RGB(120, 120, 120) :
		pref_theme === 'black' ? RGB(200, 200, 200) :
		pref_theme === 'reborn' || pref_theme === 'random' ? RGB(120, 120, 120) :
		pref_theme === 'blue' ? RGB(255, 255, 255) :
		pref_theme === 'darkblue' ? RGB(255, 255, 255) :
		pref_theme === 'red' ? RGB(220, 220, 220) :
		pref_theme === 'cream' ? RGB(100, 100, 100) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref_theme) ? RGB(200, 200, 200) : '';

	col.progressBar =
		pref_theme === 'white' ? pref_styleBlackAndWhite ? RGB(210, 210, 210) : pref_styleBlackAndWhite2 ? RGB(40, 40, 40) : RGB(220, 220, 220) :
		pref_theme === 'black' ? RGB(35, 35, 35) :
		pref_theme === 'reborn' || pref_theme === 'random' ? RGB(220, 220, 220) :
		pref_theme === 'blue' ? RGB(10, 130, 220) :
		pref_theme === 'darkblue' ? RGB(27, 55, 90) :
		pref_theme === 'red' ? RGB(140, 25, 25) :
		pref_theme === 'cream' ? RGB(255, 255, 255) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref_theme) ? RGB(35, 35, 35) : RGB(220, 220, 220);

	col.progressBarFill =
		pref_theme === 'white' ? pref_styleBlackAndWhite ? RGB(255, 255, 255) : pref_styleBlackAndWhite2 ? RGB(210, 210, 210) : RGB(25, 160, 240) :
		pref_theme === 'black' ? RGB(175, 205, 225) :
		pref_theme === 'reborn' ? RGB(90, 90, 90) :
		pref_theme === 'random' ? RGB(70, 70, 70) :
		pref_theme === 'blue' ? RGB(242, 230, 170) :
		pref_theme === 'darkblue' ? RGB(255, 202, 128) :
		pref_theme === 'red' ? RGB(245, 212, 165) :
		pref_theme === 'cream' ? RGB(120, 170, 130) :
		pref_theme === 'nblue' ? RGB(0, 200, 255) :
		pref_theme === 'ngreen' ? RGB(0, 200, 0) :
		pref_theme === 'nred' ? RGB(229, 7, 44) :
		pref_theme === 'ngold' ? RGB(254, 204, 3) :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref_theme) ? RGB(50, 25, 70) :
		RGB(90, 90, 90);

	col.progressBarFrame =
		pref_theme === 'blue' ? RGB(22, 107, 186) :
		pref_theme === 'darkblue' ? RGB(22, 37, 54) :
		pref_theme === 'red' ? RGB(92, 21, 21) :
		pref_theme === 'cream' ? RGB(230, 230, 230) : '';

	col.uiHacksFrame =
		pref_theme === 'white' ? pref_styleBlackAndWhite ? RGB(230, 230, 230) : pref_styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref_theme === 'black' ? RGB(35, 35, 35) :
		pref_theme === 'reborn' || pref_theme === 'random' ? RGB(245, 245, 245) :
		pref_theme === 'blue' ? RGB(63, 155, 202) :
		pref_theme === 'darkblue' ? RGB(27, 55, 90) :
		pref_theme === 'red' ? RGB(125, 0, 0) :
		pref_theme === 'cream' ? RGB(255, 247, 240) :
		['nblue', 'ngreen', 'nred', 'ngold'].includes(pref_theme) ? RGB(30, 30, 30) : '';

	gr.SetSmoothingMode(3);

	// * BACKGROUND * //
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// * UIHacks aero glass shadow frame fix
	gr.DrawLine(0, 0, ww, 0, 1, col.uiHacksFrame);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, col.uiHacksFrame);

	// * LOGO/TEXT * //
	if (pref_showLogoOnStartup) {
		drawLogo(gr);
	} else {
		gr.DrawString(loadStrs.loading, ft_lower_bar_bold, col.lowerBarTitle, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
		gr.DrawString(loadStrs.fileName, ft_lower_bar, col.lowerBarTitle, progressBar.x + loadingWidth + SCALE(20), lowerBarTop, progressBar.w - loadingWidth - SCALE(20), titleMeasurements.Height);
	}

	// * PROGRESS BAR * //
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.progressBar);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, col.progressBarFill);
	if ((['blue', 'darkblue', 'red', 'cream'].includes(pref_theme)) && !pref_systemFirstLaunch) {
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
	// * PROPERTIES * //
	const pref_theme               = window.GetProperty('Georgia-ReBORN - 01. Theme:');
	const pref_styleBlackAndWhite  = window.GetProperty('Georgia-ReBORN - 02. Style: Black and white');
	const pref_styleBlackAndWhite2 = window.GetProperty('Georgia-ReBORN - 02. Style: Black and white 2');
	const pref_styleBlackReborn    = window.GetProperty('Georgia-ReBORN - 02. Style: Black reborn');
	const pref_displayRes          = window.GetProperty('Georgia-ReBORN - 06. Display');
	const pref_theme_custom        = ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref_theme);

	// * SYSTEM * //
	const ww = window.Width;
	const wh = window.Height;
	const RES_4K = pref_displayRes === '4K' || (ww > 3000 || wh > 1300);
	const plus4k = RES_4K ? '4K-' : '';

	// * PATHS * //
	const paths = {};
	const logoPath = `${fb.ProfilePath}georgia-reborn/images/logo/`;
	switch (true) {
		case pref_styleBlackAndWhite:   paths.logo = `${logoPath}${plus4k}logo-black-white.png`;  break;
		case pref_styleBlackAndWhite2:  paths.logo = `${logoPath}${plus4k}logo-black-white2.png`; break;
		case pref_styleBlackReborn:     paths.logo = `${logoPath}${plus4k}logo-black-reborn.png`; break;
		case pref_theme === 'white':    paths.logo = `${logoPath}${plus4k}logo-white.png`;        break;
		case pref_theme === 'black':    paths.logo = `${logoPath}${plus4k}logo-black.png`;        break;
		case pref_theme === 'reborn':   paths.logo = `${logoPath}${plus4k}logo-reborn.png`;       break;
		case pref_theme === 'random':   paths.logo = `${logoPath}${plus4k}logo-random.png`;       break;
		case pref_theme === 'blue':     paths.logo = `${logoPath}${plus4k}logo-blue.png`;         break;
		case pref_theme === 'darkblue': paths.logo = `${logoPath}${plus4k}logo-dark-blue.png`;    break;
		case pref_theme === 'red':      paths.logo = `${logoPath}${plus4k}logo-red.png`;          break;
		case pref_theme === 'cream':    paths.logo = `${logoPath}${plus4k}logo-cream.png`;        break;
		case pref_theme === 'nblue':    paths.logo = `${logoPath}${plus4k}logo-neon-blue.png`;    break;
		case pref_theme === 'ngreen':   paths.logo = `${logoPath}${plus4k}logo-neon-green.png`;   break;
		case pref_theme === 'nred':     paths.logo = `${logoPath}${plus4k}logo-neon-red.png`;     break;
		case pref_theme === 'ngold':    paths.logo = `${logoPath}${plus4k}logo-neon-gold.png`;    break;
		case pref_theme_custom:         paths.logo = `${logoPath}${plus4k}logo-custom.png`;       break;
	}

	// * LOGO * //
	const logo = gdi.Image(paths.logo);
	gr.DrawImage(logo, window.Width * 0.5 - logo.Width * 0.5, window.Height * 0.5 - logo.Height * 0.5, logo.Width, logo.Height, 0, 0, logo.Width, logo.Height);
}
