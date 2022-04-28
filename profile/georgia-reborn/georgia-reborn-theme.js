const panelVersion = window.GetProperty('_theme_version (do not hand edit!)', '2.0.3');
window.DefineScript('Georgia-ReBORN', {author: 'TT', version: panelVersion, features: {drag_n_drop: true} });

const basePath           = fb.ProfilePath + 'georgia-reborn\\';
const pref_whiteTheme    = window.GetProperty('Georgia-ReBORN - Theme: White', '');
const pref_blackTheme    = window.GetProperty('Georgia-ReBORN - Theme: Black', '');
const pref_rebornTheme   = window.GetProperty('Georgia-ReBORN - Theme: Reborn', '');
const pref_randomTheme   = window.GetProperty('Georgia-ReBORN - Theme: Random', '');
const pref_blueTheme     = window.GetProperty('Georgia-ReBORN - Theme: Blue', '');
const pref_darkblueTheme = window.GetProperty('Georgia-ReBORN - Theme: Dark blue', '');
const pref_redTheme      = window.GetProperty('Georgia-ReBORN - Theme: Red', '');
const pref_creamTheme    = window.GetProperty('Georgia-ReBORN - Theme: Cream', '');
const pref_nblueTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon blue', '');
const pref_ngreenTheme   = window.GetProperty('Georgia-ReBORN - Theme: Neon green', '');
const pref_nredTheme     = window.GetProperty('Georgia-ReBORN - Theme: Neon red', '');
const pref_ngoldTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon gold', '');

const pref_themeStyleBlackAndWhite  = window.GetProperty('Georgia-ReBORN - Theme style: Black And White', '');
const pref_themeStyleBlackAndWhite2 = window.GetProperty('Georgia-ReBORN - Theme style: Black And White 2', '');
const pref_themeStyleBlackReborn    = window.GetProperty('Georgia-ReBORN - Theme style: Black Reborn', '');

function getLayoutMode() {
	const layoutMode = window.GetProperty('Georgia-ReBORN - System: Layout mode', '<not_set>');
	if (layoutMode === '<not_set>') {
		window.SetProperty('Georgia-ReBORN - System: Layout mode', 'default_mode');
	}
	return layoutMode;
}
getLayoutMode();

function loadAsyncFile(filePath) {
	return new Promise(resolve => {
		setTimeout(() => {
			include(filePath);
			resolve();
		}, 0);
	})
}

const loadAsync = window.GetProperty('Georgia-ReBORN - System: Load Theme Asynchronously', true);
async function includeFiles(fileList) {
	if (loadAsync) {
		let startTime = Date.now();
		const refreshTime = 16; // ~60Hz
		for (let i = 0; i < fileList.length; i++) {
			loadStrs.fileName = fileList[i] + ' ...';
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
	fileIndex: 0,
};
const startTime = Date.now();
const fileList = [
	'js\\common\\lodash-new.js',
	'js\\configuration.js',   // reads/write from config file. The actual configuration values are specified in globals.js
	'js\\helpers.js',
	'js\\common\\Common.js',
	'js\\defaults.js',   // used in settings.js
	'js\\hyperlinks.js', // used in settings.js
	'js\\settings.js',   // must be below hyperlinks.js and Common.js
	'js\\common\\Utility_LinkedList.js',
	'js\\common\\Control_ContextMenu.js',
	'js\\common\\Control_Scrollbar.js',
	'js\\common\\Control_List.js',
	'js\\playlist\\main.js',
	'js\\common\\Control_Button.js',
	'js\\library\\main.js',
	'js\\library\\scripts\\helpers.js',
	'js\\library\\scripts\\properties.js',
	'js\\library\\scripts\\interface.js',
	'js\\library\\scripts\\panel.js',
	'js\\library\\scripts\\scrollbar.js',
	'js\\library\\scripts\\library.js',
	'js\\library\\scripts\\populate.js',
	'js\\library\\scripts\\search.js',
	'js\\library\\scripts\\buttons.js',
	'js\\library\\scripts\\popupbox.js',
	'js\\library\\scripts\\timers.js',
	'js\\library\\scripts\\menu.js',
	'js\\library\\scripts\\initialise.js',
	'js\\library\\scripts\\images.js',
	'js\\library\\scripts\\callbacks.js',
	'js\\biography\\main.js',
	'js\\biography\\scripts\\helpers.js',
	'js\\biography\\scripts\\properties.js',
	'js\\biography\\scripts\\settings.js',
	'js\\biography\\scripts\\interface.js',
	'js\\biography\\scripts\\panel.js',
	'js\\biography\\scripts\\web.js',
	'js\\biography\\scripts\\names.js',
	'js\\biography\\scripts\\scrollbar.js',
	'js\\biography\\scripts\\buttons.js',
	'js\\biography\\scripts\\menu.js',
	'js\\biography\\scripts\\text.js',
	'js\\biography\\scripts\\tagger.js',
	'js\\biography\\scripts\\resize.js',
	'js\\biography\\scripts\\library.js',
	'js\\biography\\scripts\\images.js',
	'js\\biography\\scripts\\filmstrip.js',
	'js\\biography\\scripts\\timers.js',
	'js\\biography\\scripts\\popupbox.js',
	'js\\biography\\scripts\\initialise.js',
	'js\\biography\\scripts\\callbacks.js',
	'js\\color.js',
	'js\\themes.js',
	'js\\volume.js',
	'js\\image-caching.js',
	'js\\ui-components.js',
	'js\\lyrics.js',
	'js\\georgia-reborn-main.js'
];
includeFiles(fileList).then(() => {
	console.log(`Georgia-ReBORN loaded in ${Date.now() - startTime}ms`);

	if (pref.checkForUpdates) {
		scheduleUpdateCheck(0);
	}
});

// this function will be overridden once the theme loads
function on_paint(gr) {
	const RGB = (r, g, b) => { return (0xff000000 | (r << 16) | (g << 8) | (b)); }
	const scaleForDisplay = (number) => { return is_4k ? number * 2 : number };
	const displayRes       = window.GetProperty('Georgia-ReBORN - System: Display resolution', '<not_set>');
	const firstLaunch      = window.GetProperty('Georgia-ReBORN - System: First launch', '<not_set>');
	const layout_mode      = window.GetProperty('Georgia-ReBORN - System: Layout mode', ['default_mode', 'artwork_mode', 'compact_mode']);
	const showLogo         = window.GetProperty('Georgia-ReBORN - Player controls: Show logo on startup', true);
	const col = {};
	const paths = {};
	const ww = window.Width;
	const wh = window.Height;

	if (displayRes === '4k') {
		is_4k = true;
	} else if (ww > 3000 || wh > 1300) {
		is_4k = true;
	} else {
		is_4k = false;
	}

	col.bg =
		pref_whiteTheme ? pref_themeStyleBlackAndWhite ? RGB(230, 230, 230) : pref_themeStyleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref_blackTheme ? RGB(25, 25, 25) :
		pref_rebornTheme || pref_randomTheme ? RGB(245, 245, 245) :
		pref_blueTheme ? RGB(5, 110, 195) :
		pref_darkblueTheme ? RGB(22, 40, 63) :
		pref_redTheme ? RGB(100, 20, 20) :
		pref_creamTheme ? RGB(255, 247, 240) :
		pref_nblueTheme || pref_ngreenTheme || pref_nredTheme || pref_ngoldTheme ? RGB(20, 20, 20) : '';

	col.now_playing =
		pref_whiteTheme ? RGB(120, 120, 120) :
		pref_blackTheme ? RGB(200, 200, 200) :
		pref_rebornTheme || pref_randomTheme ? RGB(120, 120, 120) :
		pref_blueTheme ? RGB(255, 255, 255) :
		pref_darkblueTheme ? RGB(255, 255, 255) :
		pref_redTheme ? RGB(220, 220, 220) :
		pref_creamTheme ? RGB(100, 100, 100) :
		pref_nblueTheme || pref_ngreenTheme || pref_nredTheme || pref_ngoldTheme ? RGB(200, 200, 200) : '';

	col.progressBar =
		pref_whiteTheme ? pref_themeStyleBlackAndWhite ? RGB(210, 210, 210) : pref_themeStyleBlackAndWhite2 ? RGB(40, 40, 40) : RGB(220, 220, 220) :
		pref_blackTheme ? RGB(35, 35, 35) :
		pref_rebornTheme || pref_randomTheme ? RGB(220, 220, 220) :
		pref_blueTheme ? RGB(10, 130, 220) :
		pref_darkblueTheme ? RGB(27, 55, 90) :
		pref_redTheme ? RGB(140, 25, 25) :
		pref_creamTheme ? RGB(255, 255, 255) :
		pref_nblueTheme || pref_ngreenTheme || pref_nredTheme || pref_ngoldTheme ? RGB(35, 35, 35) : '';

	col.progressBarFill =
		pref_whiteTheme ? pref_themeStyleBlackAndWhite ? RGB(255, 255, 255) : pref_themeStyleBlackAndWhite2 ? RGB(210, 210, 210) : RGB(25, 160, 240) :
		pref_blackTheme ? RGB(165, 195, 215) :
		pref_rebornTheme ? RGB(90, 90, 90) :
		pref_randomTheme ? RGB(70, 70, 70) :
		pref_blueTheme ? RGB(242, 230, 170) :
		pref_darkblueTheme ? RGB(255, 202, 128) :
		pref_redTheme ? RGB(245, 212, 165) :
		pref_creamTheme ? RGB(120, 170, 130) :
		pref_nblueTheme ? RGB(0, 200, 255) :
		pref_ngreenTheme ? RGB(0, 200, 0) :
		pref_nredTheme ? RGB(229, 7, 44) :
		pref_ngoldTheme ? RGB(254, 204, 3) : '';

	col.progressBarFrame =
		pref_blueTheme ? RGB(22, 107, 186) :
		pref_darkblueTheme ? RGB(22, 37, 54) :
		pref_redTheme ? RGB(92, 21, 21) :
		pref_creamTheme ? RGB(230, 230, 230) : '';

	col.uiHackFrame =
		pref_whiteTheme ? pref_themeStyleBlackAndWhite ? RGB(230, 230, 230) : pref_themeStyleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245) :
		pref_blackTheme ? RGB(35, 35, 35) :
		pref_rebornTheme || pref_randomTheme ? RGB(245, 245, 245) :
		pref_blueTheme ? RGB(63, 155, 202) :
		pref_darkblueTheme ? RGB(27, 55, 90) :
		pref_redTheme ? RGB(125, 0, 0) :
		pref_creamTheme ? RGB(255, 247, 240) :
		pref_nblueTheme || pref_ngreenTheme || pref_nredTheme || pref_ngoldTheme ? RGB(30, 30, 30) : '';

	gr.SetSmoothingMode(3);
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// UIHacks Aero Glass Shadow Frame Fix
	gr.DrawLine(0, 0, ww, 0, 1, col.uiHackFrame);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, col.uiHackFrame);

	const font = (name, size, style) => {
		var font;
		try {
			font = gdi.Font(name, Math.round(scaleForDisplay(size)), style);
		} catch (e) {
			console.log('Failed to load font >>>', name, size, style);
		}
		return font;
	}
	const fontLight = 'HelveticaNeueLT Pro 45 Lt';
	const fontBold = 'HelveticaNeueLT Pro 65 Md';
	const lower_bar_font_size_default = window.GetProperty('Georgia-ReBORN - Font size: Default mode - Lower bar font size');
	const lower_bar_font_size_artwork = window.GetProperty('Georgia-ReBORN - Font size: Artwork mode - Lower bar font size');
	const lower_bar_font_size_compact = window.GetProperty('Georgia-ReBORN - Font size: Compact mode - Lower bar font size');
	if (layout_mode === 'default_mode') {
		var ft_lower = font(fontLight, lower_bar_font_size_default ? lower_bar_font_size_default : 18, 0);
		var ft_lower_bold = font(fontBold, lower_bar_font_size_default ? lower_bar_font_size_default : 18, 0);
	}
	else {
		var ft_lower = font(fontLight, layout_mode === 'artwork_mode' ? lower_bar_font_size_artwork : layout_mode === 'compact_mode' ? lower_bar_font_size_compact : 16, 0);
		var ft_lower_bold = font(fontBold, layout_mode === 'artwork_mode' ? lower_bar_font_size_artwork : layout_mode === 'compact_mode' ? lower_bar_font_size_compact : 16, 0);
	}
	const lower_bar_h = scaleForDisplay(120);
	const lowerBarTop = layout_mode === 'artwork_mode' || layout_mode === 'compact_mode' ? wh - lower_bar_h + (is_4k ? 33 : 18) : wh - lower_bar_h + (is_4k ? 65 : 35);
	const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower, 0, 0, 0, 0);
	const progressBar = {
		x: layout_mode === 'artwork_mode' || layout_mode === 'compact_mode' ? scaleForDisplay(20) : scaleForDisplay(40),
		y: layout_mode === 'artwork_mode' || layout_mode === 'compact_mode' ? Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(12) + (ww > 1920 ? 2 : 0)),
		w: layout_mode === 'artwork_mode' || layout_mode === 'compact_mode' ? ww - scaleForDisplay(40) : ww - scaleForDisplay(80),
		h: layout_mode === 'artwork_mode' || layout_mode === 'compact_mode' ? scaleForDisplay(10) + (ww > 1920 ? 2 : 0) : scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
	}

	if (showLogo) {
		drawLogo(gr);
	} else {
		gr.DrawString(loadStrs.loading, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
		gr.DrawString(loadStrs.fileName, ft_lower, col.now_playing, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop, progressBar.w - loadingWidth - scaleForDisplay(20), titleMeasurements.Height);
	}
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, col.progressBar);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, col.progressBarFill);
	if ((pref_blueTheme || pref_darkblueTheme || pref_redTheme || pref_creamTheme) && !firstLaunch) {
		gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, col.progressBarFrame);
	}
}

function drawLogo(gr) {
	const paths = {};

	paths.rebornLogoWhite     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-white.png'      : 'georgia-reborn/images/logo/logo-white.png');
	paths.rebornLogoBlack     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-black.png'      : 'georgia-reborn/images/logo/logo-black.png');
	paths.rebornLogoReborn    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-reborn.png'     : 'georgia-reborn/images/logo/logo-reborn.png');
	paths.rebornLogoRandom    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-random.png'     : 'georgia-reborn/images/logo/logo-random.png');
	paths.rebornLogoBlue      = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-blue.png'       : 'georgia-reborn/images/logo/logo-blue.png');
	paths.rebornLogoDarkblue  = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-dark-blue.png'  : 'georgia-reborn/images/logo/logo-dark-blue.png');
	paths.rebornLogoRed       = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-red.png'        : 'georgia-reborn/images/logo/logo-red.png');
	paths.rebornLogoCream     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-cream.png'      : 'georgia-reborn/images/logo/logo-cream.png');
	paths.rebornLogoNblue     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-blue.png'  : 'georgia-reborn/images/logo/logo-neon-blue.png');
	paths.rebornLogoNgreen    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-green.png' : 'georgia-reborn/images/logo/logo-neon-green.png');
	paths.rebornLogoNred      = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-red.png'   : 'georgia-reborn/images/logo/logo-neon-red.png');
	paths.rebornLogoNgold     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-gold.png'  : 'georgia-reborn/images/logo/logo-neon-gold.png');

	paths.rebornLogoBlackAndWhite  = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-black-white.png'  : 'georgia-reborn/images/logo/logo-black-white.png');
	paths.rebornLogoBlackAndWhite2 = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-black-white2.png' : 'georgia-reborn/images/logo/logo-black-white2.png');
	paths.rebornLogoBlackReborn    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-black-reborn.png' : 'georgia-reborn/images/logo/logo-black-reborn.png');

	const rebornLogoWhite     = gdi.Image(paths.rebornLogoWhite);
	const rebornLogoBlack     = gdi.Image(paths.rebornLogoBlack);
	const rebornLogoReborn    = gdi.Image(paths.rebornLogoReborn);
	const rebornLogoRandom    = gdi.Image(paths.rebornLogoRandom);
	const rebornLogoBlue      = gdi.Image(paths.rebornLogoBlue);
	const rebornLogoDarkblue  = gdi.Image(paths.rebornLogoDarkblue);
	const rebornLogoRed       = gdi.Image(paths.rebornLogoRed);
	const rebornLogoCream     = gdi.Image(paths.rebornLogoCream);
	const rebornLogoNblue     = gdi.Image(paths.rebornLogoNblue);
	const rebornLogoNgreen    = gdi.Image(paths.rebornLogoNgreen);
	const rebornLogoNred      = gdi.Image(paths.rebornLogoNred);
	const rebornLogoNgold     = gdi.Image(paths.rebornLogoNgold);

	const rebornLogoBlackAndWhite  = gdi.Image(paths.rebornLogoBlackAndWhite);
	const rebornLogoBlackAndWhite2 = gdi.Image(paths.rebornLogoBlackAndWhite2);
	const rebornLogoBlackReborn    = gdi.Image(paths.rebornLogoBlackReborn);

	if (pref_whiteTheme) {
		gr.DrawImage(rebornLogoWhite, window.Width / 2 - rebornLogoWhite.Width / 2, window.Height / 2 - rebornLogoWhite.Height / 2, rebornLogoWhite.Width, rebornLogoWhite.Height, 0, 0, rebornLogoWhite.Width, rebornLogoWhite.Height);
		if (pref_themeStyleBlackAndWhite) gr.DrawImage(rebornLogoBlackAndWhite, window.Width / 2 - rebornLogoBlackAndWhite.Width / 2, window.Height / 2 - rebornLogoBlackAndWhite.Height / 2, rebornLogoBlackAndWhite.Width, rebornLogoBlackAndWhite.Height, 0, 0, rebornLogoBlackAndWhite.Width, rebornLogoBlackAndWhite.Height);
		else if (pref_themeStyleBlackAndWhite2) gr.DrawImage(rebornLogoBlackAndWhite2, window.Width / 2 - rebornLogoBlackAndWhite2.Width / 2, window.Height / 2 - rebornLogoBlackAndWhite2.Height / 2, rebornLogoBlackAndWhite2.Width, rebornLogoBlackAndWhite2.Height, 0, 0, rebornLogoBlackAndWhite2.Width, rebornLogoBlackAndWhite2.Height);
	} else if (pref_blackTheme) {
		gr.DrawImage(rebornLogoBlack, window.Width / 2 - rebornLogoBlack.Width / 2, window.Height / 2 - rebornLogoBlack.Height / 2, rebornLogoBlack.Width, rebornLogoBlack.Height, 0, 0, rebornLogoBlack.Width, rebornLogoBlack.Height);
		if (pref_themeStyleBlackReborn) gr.DrawImage(rebornLogoBlackReborn, window.Width / 2 - rebornLogoBlackReborn.Width / 2, window.Height / 2 - rebornLogoBlackReborn.Height / 2, rebornLogoBlackReborn.Width, rebornLogoBlackReborn.Height, 0, 0, rebornLogoBlackReborn.Width, rebornLogoBlackReborn.Height);
	} else if (pref_rebornTheme) {
		gr.DrawImage(rebornLogoReborn, window.Width / 2 - rebornLogoReborn.Width / 2, window.Height / 2 - rebornLogoReborn.Height / 2, rebornLogoReborn.Width, rebornLogoReborn.Height, 0, 0, rebornLogoReborn.Width, rebornLogoReborn.Height);
	} else if (pref_randomTheme) {
		gr.DrawImage(rebornLogoRandom, window.Width / 2 - rebornLogoRandom.Width / 2, window.Height / 2 - rebornLogoRandom.Height / 2, rebornLogoRandom.Width, rebornLogoRandom.Height, 0, 0, rebornLogoRandom.Width, rebornLogoRandom.Height);
	} else if (pref_blueTheme) {
		gr.DrawImage(rebornLogoBlue, window.Width / 2 - rebornLogoBlue.Width / 2, window.Height / 2 - rebornLogoBlue.Height / 2, rebornLogoBlue.Width, rebornLogoBlue.Height, 0, 0, rebornLogoBlue.Width, rebornLogoBlue.Height);
	} else if (pref_darkblueTheme) {
		gr.DrawImage(rebornLogoDarkblue, window.Width / 2 - rebornLogoDarkblue.Width / 2, window.Height / 2 - rebornLogoDarkblue.Height / 2, rebornLogoDarkblue.Width, rebornLogoDarkblue.Height, 0, 0, rebornLogoDarkblue.Width, rebornLogoDarkblue.Height);
	} else if (pref_redTheme) {
		gr.DrawImage(rebornLogoRed, window.Width / 2 - rebornLogoRed.Width / 2, window.Height / 2 - rebornLogoRed.Height / 2, rebornLogoRed.Width, rebornLogoRed.Height, 0, 0, rebornLogoRed.Width, rebornLogoRed.Height);
	} else if (pref_creamTheme) {
		gr.DrawImage(rebornLogoCream, window.Width / 2 - rebornLogoCream.Width / 2, window.Height / 2 - rebornLogoCream.Height / 2, rebornLogoCream.Width, rebornLogoCream.Height, 0, 0, rebornLogoCream.Width, rebornLogoCream.Height);
	} else if (pref_nblueTheme) {
		gr.DrawImage(rebornLogoNblue, window.Width / 2 - rebornLogoNblue.Width / 2, window.Height / 2 - rebornLogoNblue.Height / 2, rebornLogoNblue.Width, rebornLogoNblue.Height, 0, 0, rebornLogoNblue.Width, rebornLogoNblue.Height);
	} else if (pref_ngreenTheme) {
		gr.DrawImage(rebornLogoNgreen, window.Width / 2 - rebornLogoNgreen.Width / 2, window.Height / 2 - rebornLogoNgreen.Height / 2, rebornLogoNgreen.Width, rebornLogoNgreen.Height, 0, 0, rebornLogoNgreen.Width, rebornLogoNgreen.Height);
	} else if (pref_nredTheme) {
		gr.DrawImage(rebornLogoNred, window.Width / 2 - rebornLogoNred.Width / 2, window.Height / 2 - rebornLogoNred.Height / 2, rebornLogoNred.Width, rebornLogoNred.Height, 0, 0, rebornLogoNred.Width, rebornLogoNred.Height);
	} else if (pref_ngoldTheme) {
		gr.DrawImage(rebornLogoNgold, window.Width / 2 - rebornLogoNgold.Width / 2, window.Height / 2 - rebornLogoNgold.Height / 2, rebornLogoNgold.Width, rebornLogoNgold.Height, 0, 0, rebornLogoNgold.Width, rebornLogoNgold.Height);
	}
}
