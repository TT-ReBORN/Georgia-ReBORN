/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Preloader                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-01                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
const panelVersion = window.GetProperty('Georgia-ReBORN - #Version: Do not hand edit!', '3.0-RC1');
window.DefineScript('Georgia-ReBORN', { author: 'TT', version: panelVersion, features: { drag_n_drop: true } });

const basePath                 = `${fb.ProfilePath}georgia-reborn\\`;
const pref_theme               = window.GetProperty('Georgia-ReBORN - 01. Theme:');
const pref_styleBlackAndWhite  = window.GetProperty('Georgia-ReBORN - 02. Style: Black And White');
const pref_styleBlackAndWhite2 = window.GetProperty('Georgia-ReBORN - 02. Style: Black And White 2');
const pref_styleBlackReborn    = window.GetProperty('Georgia-ReBORN - 02. Style: Black Reborn');


////////////////////////
// * LAYOUT CHECKER * //
////////////////////////
function getThemeLayout() {
	const pref_layout = window.GetProperty('Georgia-ReBORN - 05. Layout', '<not_set>');
	if (pref_layout === '<not_set>') {
		window.SetProperty('Georgia-ReBORN - 05. Layout', 'default');
	}
	return pref_layout;
}
getThemeLayout(); // Check immediately


///////////////////////////
// * ASYNC FILE LOADER * //
///////////////////////////
function loadAsyncFile(filePath) {
	return new Promise(resolve => {
		setTimeout(() => {
			include(filePath);
			resolve();
		}, 0);
	});
}

const loadAsync = window.GetProperty('Georgia-ReBORN - 16. System: Load Theme Asynchronously', true);

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
	} else {
		fileList.forEach(filePath => include(filePath));
	}
}

const loadStrs = {
	loading: 'Loading:',
	fileName: '',
	fileIndex: 0
};

const startTime = Date.now();

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
	'scripts\\base\\gr-menu.js',
	'scripts\\base\\gr-menu-custom.js',
	'scripts\\base\\gr-main.js'
];

includeFiles(fileList).then(() => {
	console.log(`Georgia-ReBORN loaded in ${Date.now() - startTime}ms`);

	if (pref.checkForUpdates) {
		scheduleUpdateCheck(0);
	}
});


///////////////////////////////////////////////////////////////////////////
// * PRELOADER - THIS FUNCTION WILL BE OVERRIDDEN ONCE THE THEME LOADS * //
///////////////////////////////////////////////////////////////////////////
function on_paint(gr) {
	const RGB = (r, g, b)   => (0xff000000 | (r << 16) | (g << 8) | (b));
	const scaleForDisplay   = (number) => is_4k ? number * 2 : number;
	const displayRes        = window.GetProperty('Georgia-ReBORN - 06. Display', '<not_set>');
	const systemFirstLaunch = window.GetProperty('Georgia-ReBORN - 16. System: First launch', '<not_set>');
	const pref_layout       = window.GetProperty('Georgia-ReBORN - 05. Layout', ['default', 'artwork', 'compact']);
	const showLogoOnStartup = window.GetProperty('Georgia-ReBORN - 09. Player controls: Show logo on startup', true);
	const ww                = window.Width;
	const wh                = window.Height;
	const col               = {};
	const is_4k             = displayRes === '4k' || (ww > 3000 || wh > 1300);

	const font = (name, size, style) => {
		let font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	};

	const fontLight = 'HelveticaNeueLT Pro 45 Lt';
	const fontBold  = 'HelveticaNeueLT Pro 65 Md';
	const lowerBarFontSize_default = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Default)');
	const lowerBarFontSize_artwork = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Artwork)');
	const lowerBarFontSize_compact = window.GetProperty('Georgia-ReBORN - 08. Font size: Lower bar (Compact)');

	const ft_lower_bar = font(fontLight,
		pref_layout === 'compact' ? lowerBarFontSize_compact || 16 :
		pref_layout === 'artwork' ? lowerBarFontSize_artwork || 16 :
		lowerBarFontSize_default || 18, 0);

	const ft_lower_bar_bold = font(fontBold,
		pref_layout === 'compact' ? lowerBarFontSize_compact || 16 :
		pref_layout === 'artwork' ? lowerBarFontSize_artwork || 16 :
		lowerBarFontSize_default || 18, 0);

	const lowerBarHeight = scaleForDisplay(120);
	const lowerBarTop = pref_layout !== 'default' ? wh - lowerBarHeight + (is_4k ? 33 : 18) : wh - lowerBarHeight + (is_4k ? 65 : 35);
	const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower_bar, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower_bar, 0, 0, 0, 0);

	const progressBar = {
		x: pref_layout !== 'default' ? scaleForDisplay(20) : scaleForDisplay(40),
		y: pref_layout !== 'default' ? Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(12) + (ww > 1920 ? 2 : 0)),
		w: pref_layout !== 'default' ? ww - scaleForDisplay(40) : ww - scaleForDisplay(80),
		h: pref_layout !== 'default' ? scaleForDisplay(10) + (ww > 1920 ? 2 : 0) : scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
	};

	// * PRELOADER COLORS * //
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
	if (showLogoOnStartup) {
		drawLogo(gr);
	} else {
		gr.DrawString(loadStrs.loading, ft_lower_bar_bold, col.lowerBarTitle, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
		gr.DrawString(loadStrs.fileName, ft_lower_bar, col.lowerBarTitle, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop, progressBar.w - loadingWidth - scaleForDisplay(20), titleMeasurements.Height);
	}

	// * PROGRESS BAR * //
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.progressBar);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, col.progressBarFill);
	if ((['blue', 'darkblue', 'red', 'cream'].includes(pref_theme)) && !systemFirstLaunch) {
		gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, col.progressBarFrame);
	}
}


/////////////////////////
// * PRELOADER LOGOS * //
/////////////////////////
function drawLogo(gr) {
	const displayRes = window.GetProperty('Georgia-ReBORN - 06. Display', '<not_set>');
	const ww         = window.Width;
	const wh         = window.Height;
	const is_4k      = displayRes === '4k' || (ww > 3000 || wh > 1300);
	const plus4k     = is_4k ? '4k-' : '';
	const paths      = {};
	const logoPath   = `${fb.ProfilePath}georgia-reborn/images/logo/`;

	paths.logoWhite          = `${logoPath}${plus4k}logo-white.png`;
	paths.logoBlack          = `${logoPath}${plus4k}logo-black.png`;
	paths.logoReborn         = `${logoPath}${plus4k}logo-reborn.png`;
	paths.logoRandom         = `${logoPath}${plus4k}logo-random.png`;
	paths.logoBlue           = `${logoPath}${plus4k}logo-blue.png`;
	paths.logoDarkblue       = `${logoPath}${plus4k}logo-dark-blue.png`;
	paths.logoRed            = `${logoPath}${plus4k}logo-red.png`;
	paths.logoCream          = `${logoPath}${plus4k}logo-cream.png`;
	paths.logoNblue          = `${logoPath}${plus4k}logo-neon-blue.png`;
	paths.logoNgreen         = `${logoPath}${plus4k}logo-neon-green.png`;
	paths.logoNred           = `${logoPath}${plus4k}logo-neon-red.png`;
	paths.logoNgold          = `${logoPath}${plus4k}logo-neon-gold.png`;
	paths.logoCustom         = `${logoPath}${plus4k}logo-custom.png`;
	paths.logoBlackAndWhite  = `${logoPath}${plus4k}logo-black-white.png`;
	paths.logoBlackAndWhite2 = `${logoPath}${plus4k}logo-black-white2.png`;
	paths.logoBlackReborn    = `${logoPath}${plus4k}logo-black-reborn.png`;

	const logoWhite          = gdi.Image(paths.logoWhite);
	const logoBlack          = gdi.Image(paths.logoBlack);
	const logoReborn         = gdi.Image(paths.logoReborn);
	const logoRandom         = gdi.Image(paths.logoRandom);
	const logoBlue           = gdi.Image(paths.logoBlue);
	const logoDarkblue       = gdi.Image(paths.logoDarkblue);
	const logoRed            = gdi.Image(paths.logoRed);
	const logoCream          = gdi.Image(paths.logoCream);
	const logoNblue          = gdi.Image(paths.logoNblue);
	const logoNgreen         = gdi.Image(paths.logoNgreen);
	const logoNred           = gdi.Image(paths.logoNred);
	const logoNgold          = gdi.Image(paths.logoNgold);
	const logoCustom         = gdi.Image(paths.logoCustom);
	const logoBlackAndWhite  = gdi.Image(paths.logoBlackAndWhite);
	const logoBlackAndWhite2 = gdi.Image(paths.logoBlackAndWhite2);
	const logoBlackReborn    = gdi.Image(paths.logoBlackReborn);

	const logos =
		pref_theme === 'white'    ? pref_styleBlackAndWhite ? logoBlackAndWhite : pref_styleBlackAndWhite2 ? logoBlackAndWhite2 : logoWhite :
		pref_theme === 'black'    ? pref_styleBlackReborn   ? logoBlackReborn   : logoBlack :
		pref_theme === 'reborn'   ? logoReborn :
		pref_theme === 'random'   ? logoRandom :
		pref_theme === 'blue'     ? logoBlue :
		pref_theme === 'darkblue' ? logoDarkblue :
		pref_theme === 'red'      ? logoRed :
		pref_theme === 'cream'    ? logoCream :
		pref_theme === 'nblue'    ? logoNblue :
		pref_theme === 'ngreen'   ? logoNgreen :
		pref_theme === 'nred'     ? logoNred :
		pref_theme === 'ngold'    ? logoNgold :
		['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref_theme) ? logoCustom : logoReborn;

	gr.DrawImage(logos, window.Width * 0.5 - logos.Width * 0.5, window.Height * 0.5 - logos.Height * 0.5, logos.Width, logos.Height, 0, 0, logos.Width, logos.Height);
}
