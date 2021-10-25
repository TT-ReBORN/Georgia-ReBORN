const panelVersion = window.GetProperty('_theme_version (do not hand edit!)', '2.0.3');
window.DefineScript('Georgia-ReBORN', {author: 'TT', version: panelVersion, features: {drag_n_drop: true} });

const basePath = fb.ProfilePath + 'georgia-reborn\\';

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
	// 'js\\CaTRoX_QWR\\lodash.min.js',
	'js\\CaTRoX_QWR\\lodash-new.js',
	'js\\configuration.js',   // reads/write from config file. The actual configuration values are specified in globals.js
	'js\\helpers.js',
	'js\\CaTRoX_QWR\\Common.js',
	'js\\defaults.js',   // used in settings.js
	'js\\hyperlinks.js', // used in settings.js
	'js\\settings.js',   // must be below hyperlinks.js and Common.js
	'js\\CaTRoX_QWR\\Utility_LinkedList.js',
	'js\\CaTRoX_QWR\\Control_ContextMenu.js',
	'js\\CaTRoX_QWR\\Control_Scrollbar.js',
	'js\\CaTRoX_QWR\\Control_List.js',
	'js\\CaTRoX_QWR\\Panel_Playlist.js',
	'js\\CaTRoX_QWR\\Control_Button.js',
	'js\\Library\\main.js',
	'js\\Library\\scripts\\helpers.js',
	'js\\Library\\scripts\\properties.js',
	'js\\Library\\scripts\\interface.js',
	'js\\Library\\scripts\\panel.js',
	'js\\Library\\scripts\\scrollbar.js',
	'js\\Library\\scripts\\library.js',
	'js\\Library\\scripts\\populate.js',
	'js\\Library\\scripts\\search.js',
	'js\\Library\\scripts\\buttons.js',
	'js\\Library\\scripts\\popupbox.js',
	'js\\Library\\scripts\\timers.js',
	'js\\Library\\scripts\\menu.js',
	'js\\Library\\scripts\\initialise.js',
	'js\\Library\\scripts\\images.js',
	'js\\Library\\scripts\\callbacks.js',
	'js\\Biography\\main.js',
	'js\\Biography\\scripts\\helpers.js',
	'js\\Biography\\scripts\\properties.js',
	'js\\Biography\\scripts\\settings.js',
	'js\\Biography\\scripts\\interface.js',
	'js\\Biography\\scripts\\panel.js',
	'js\\Biography\\scripts\\web.js',
	'js\\Biography\\scripts\\names.js',
	'js\\Biography\\scripts\\scrollbar.js',
	'js\\Biography\\scripts\\buttons.js',
	'js\\Biography\\scripts\\menu.js',
	'js\\Biography\\scripts\\text.js',
	'js\\Biography\\scripts\\tagger.js',
	'js\\Biography\\scripts\\resize.js',
	'js\\Biography\\scripts\\library.js',
	'js\\Biography\\scripts\\images.js',
	'js\\Biography\\scripts\\filmstrip.js',
	'js\\Biography\\scripts\\timers.js',
	'js\\Biography\\scripts\\popupbox.js',
	'js\\Biography\\scripts\\initialise.js',
	'js\\Biography\\scripts\\callbacks.js',
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
	const use_4k        = window.GetProperty('Georgia-ReBORN - System: Detect 4k', 'auto');
	const firstLaunch   = window.GetProperty('Georgia-ReBORN - System: First launch', '<not_set>');
	const layout_mode   = window.GetProperty('Georgia-ReBORN - System: Layout mode', ['default_mode', 'artwork_mode', 'compact_mode']);
	const whiteTheme    = window.GetProperty('Georgia-ReBORN - Theme: White', 'white');
	const blackTheme    = window.GetProperty('Georgia-ReBORN - Theme: Black', 'black');
	const rebornTheme   = window.GetProperty('Georgia-ReBORN - Theme: ReBORN', 'reborn');
	const blueTheme     = window.GetProperty('Georgia-ReBORN - Theme: Blue', 'blue');
	const darkblueTheme = window.GetProperty('Georgia-ReBORN - Theme: Dark blue', 'darkblue');
	const redTheme      = window.GetProperty('Georgia-ReBORN - Theme: Red', 'red');
	const creamTheme    = window.GetProperty('Georgia-ReBORN - Theme: Cream', 'cream');
	const nblueTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon blue', 'nblue');
	const ngreenTheme   = window.GetProperty('Georgia-ReBORN - Theme: Neon green', 'ngreen');
	const nredTheme     = window.GetProperty('Georgia-ReBORN - Theme: Neon red', 'nred');
	const ngoldTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon gold', 'ngold');
	const showLogo      = window.GetProperty('Georgia-ReBORN - Player controls: Show logo on startup', true);
	const col = {};
	const paths = {};
	const ww = window.Width;
	const wh = window.Height;

	if (use_4k === 'always') {
		is_4k = true;
	} else if (use_4k === 'auto' && (ww > 3000 || wh > 1400)) {
		is_4k = true;
	} else {
		is_4k = false;
	}

	paths.rebornLogoWhite     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-white.png'      : 'georgia-reborn/images/logo/logo-white.png');
	paths.rebornLogoBlack     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-black.png'      : 'georgia-reborn/images/logo/logo-black.png');
	paths.rebornLogoReborn    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-reborn.png'     : 'georgia-reborn/images/logo/logo-reborn.png');
	paths.rebornLogoBlue      = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-blue.png'       : 'georgia-reborn/images/logo/logo-blue.png');
	paths.rebornLogoDarkblue  = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-dark-blue.png'  : 'georgia-reborn/images/logo/logo-dark-blue.png');
	paths.rebornLogoRed       = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-red.png'        : 'georgia-reborn/images/logo/logo-red.png');
	paths.rebornLogoCream     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-cream.png'      : 'georgia-reborn/images/logo/logo-cream.png');
	paths.rebornLogoNblue     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-blue.png'  : 'georgia-reborn/images/logo/logo-neon-blue.png');
	paths.rebornLogoNgreen    = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-green.png' : 'georgia-reborn/images/logo/logo-neon-green.png');
	paths.rebornLogoNred      = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-red.png'   : 'georgia-reborn/images/logo/logo-neon-red.png');
	paths.rebornLogoNgold     = fb.ProfilePath + (is_4k ? 'georgia-reborn/images/logo/4k-logo-neon-gold.png'  : 'georgia-reborn/images/logo/logo-neon-gold.png');
	const rebornLogoWhite     = gdi.Image(paths.rebornLogoWhite);
	const rebornLogoBlack     = gdi.Image(paths.rebornLogoBlack);
	const rebornLogoReborn    = gdi.Image(paths.rebornLogoReborn);
	const rebornLogoBlue      = gdi.Image(paths.rebornLogoBlue);
	const rebornLogoDarkblue  = gdi.Image(paths.rebornLogoDarkblue);
	const rebornLogoRed       = gdi.Image(paths.rebornLogoRed);
	const rebornLogoCream     = gdi.Image(paths.rebornLogoCream);
	const rebornLogoNblue     = gdi.Image(paths.rebornLogoNblue);
	const rebornLogoNgreen    = gdi.Image(paths.rebornLogoNgreen);
	const rebornLogoNred      = gdi.Image(paths.rebornLogoNred);
	const rebornLogoNgold     = gdi.Image(paths.rebornLogoNgold);

	col.bg =
	whiteTheme ? RGB(245, 245, 245) :
	blackTheme ? RGB(25, 25, 25) :
	rebornTheme ? RGB(245, 245, 245) :
	blueTheme ? RGB(5, 110, 195) :
	darkblueTheme ? RGB(22, 40, 63) :
	redTheme ? RGB(100, 20, 20) :
	creamTheme ? RGB(255, 247, 240) :
	nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(20, 20, 20) : '';

	col.now_playing =
	whiteTheme ? RGB(120, 120, 120) :
	blackTheme ? RGB(200, 200, 200) :
	rebornTheme ? RGB(120, 120, 120) :
	blueTheme ? RGB(255, 255, 255) :
	darkblueTheme ? RGB(255, 255, 255) :
	redTheme ? RGB(220, 220, 220) :
	creamTheme ? RGB(100, 100, 100) :
	nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(200, 200, 200) : '';

	col.progress_fill =
	whiteTheme ? RGB(180, 180, 180) :
	blackTheme ? RGB(100, 100, 100) :
	rebornTheme ? RGB(180, 180, 180) :
	blueTheme ? RGB(242, 230, 170) :
	darkblueTheme ? RGB(255, 202, 128) :
	redTheme ? RGB(245, 212, 165) :
	creamTheme ? RGB(120, 170, 130) :
	nblueTheme ? RGB(0, 200, 255) :
	ngreenTheme ? RGB(0, 200, 0) :
	nredTheme ? RGB(229, 7, 44) :
	ngoldTheme ? RGB(254, 204, 3) : '';

	gr.SetSmoothingMode(3);
	gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// UIHacks Aero Glass Shadow Frame Fix
	gr.DrawLine(0, 0, ww, 0, 1,
		whiteTheme ? RGB(245, 245, 245) :
		blackTheme ? RGB(35, 35, 35) :
		rebornTheme ? RGB(245, 245, 245) :
		blueTheme ? RGB(63, 155, 202) :
		darkblueTheme ? RGB(27, 55, 90) :
		redTheme ? RGB(125, 0, 0) :
		creamTheme ? RGB(255, 247, 240) :
		nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(30, 30, 30) : ''
	);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1,
		whiteTheme ? RGB(245, 245, 245) :
		blackTheme ? RGB(35, 35, 35) :
		rebornTheme ? RGB(245, 245, 245) :
		blueTheme ? RGB(63, 155, 202) :
		darkblueTheme ? RGB(27, 55, 90) :
		redTheme ? RGB(125, 0, 0) :
		creamTheme ? RGB(255, 247, 240) :
		nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(30, 30, 30) : ''
	);

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
	const lower_bar_font_size_default = window.GetProperty('Georgia-ReBORN - Font size: Default mode: Lower bar font size');
	const lower_bar_font_size_compact = window.GetProperty('Georgia-ReBORN - Font size: Compact mode: Lower bar font size');
	if (layout_mode === 'default_mode') {
		var ft_lower = font(fontLight, lower_bar_font_size_default ? lower_bar_font_size_default : 18, 0);
		var ft_lower_bold = font(fontBold, lower_bar_font_size_default ? lower_bar_font_size_default : 18, 0);
	}
	else if (layout_mode === 'compact_mode' || layout_mode === 'artwork_mode') {
		var ft_lower = font(fontLight, lower_bar_font_size_compact ? lower_bar_font_size_compact : 16, 0);
		var ft_lower_bold = font(fontBold, lower_bar_font_size_compact ? lower_bar_font_size_compact : 16, 0);
	}
	const lower_bar_h = scaleForDisplay(120);
	const lowerBarTop = layout_mode === 'compact_mode' || layout_mode === 'artwork_mode' ? wh - lower_bar_h + (is_4k ? 33 : 18) : wh - lower_bar_h + (is_4k ? 65 : 35);
	const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower, 0, 0, 0, 0).Width);
	const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower, 0, 0, 0, 0);
	const progressBar = {
		x: layout_mode === 'compact_mode' || layout_mode === 'artwork_mode' ? scaleForDisplay(20) : scaleForDisplay(40),
		y: layout_mode === 'compact_mode' || layout_mode === 'artwork_mode' ? Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(12) + (ww > 1920 ? 2 : 0)),
		w: layout_mode === 'compact_mode' || layout_mode === 'artwork_mode' ? ww - scaleForDisplay(40) : ww - scaleForDisplay(80),
		h: layout_mode === 'compact_mode' || layout_mode === 'artwork_mode' ? scaleForDisplay(10) + (ww > 1920 ? 2 : 0) : scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
	}

	gr.DrawString(loadStrs.loading, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
	gr.DrawString(loadStrs.fileName, ft_lower, col.now_playing, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop, progressBar.w, titleMeasurements.Height);

	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h,
		whiteTheme ? RGB(220, 220, 220) :
		blackTheme ? RGB(50, 50, 50) :
		rebornTheme ? RGB(220, 220, 220) :
		blueTheme ? RGB(10, 130, 220) :
		darkblueTheme ? RGB(27, 55, 90) :
		redTheme ? RGB(140, 25, 25) :
		creamTheme ? RGB(255, 255, 255) :
		nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(35, 35, 35) : ''
	);
	gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h,
		whiteTheme ? RGB(25, 160, 240) :
		blackTheme ? RGB(165, 195, 215) :
		rebornTheme ? RGB(90, 90, 90) :
		blueTheme ? RGB(242, 230, 170) :
		darkblueTheme ? RGB(255, 202, 128) :
		redTheme ? RGB(245, 212, 165) :
		creamTheme ? RGB(120, 170, 130) :
		nblueTheme ? RGB(0, 200, 255) :
		ngreenTheme ? RGB(0, 200, 0) :
		nredTheme ? RGB(229, 7, 44) :
		ngoldTheme ? RGB(254, 204, 3) : ''
	);
	if ((blueTheme || darkblueTheme || redTheme || creamTheme) && !firstLaunch) {
		gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1,
			blueTheme ? RGB(23, 111, 194) :
			darkblueTheme ? RGB(22, 37, 54) :
			redTheme ? RGB(92, 21, 21) :
			creamTheme ? RGB(230, 230, 230) : ''
		);
	}
	if (showLogo) {
		if (whiteTheme) {
			gr.DrawImage(rebornLogoWhite, window.Width / 2 - rebornLogoWhite.Width / 2, window.Height / 2 - rebornLogoWhite.Height / 2, rebornLogoWhite.Width, rebornLogoWhite.Height, 0, 0, rebornLogoWhite.Width, rebornLogoWhite.Height);
		} else if (blackTheme) {
			gr.DrawImage(rebornLogoBlack, window.Width / 2 - rebornLogoBlack.Width / 2, window.Height / 2 - rebornLogoBlack.Height / 2, rebornLogoBlack.Width, rebornLogoBlack.Height, 0, 0, rebornLogoBlack.Width, rebornLogoBlack.Height);
		} else if (rebornTheme) {
			gr.DrawImage(rebornLogoReborn, window.Width / 2 - rebornLogoReborn.Width / 2, window.Height / 2 - rebornLogoReborn.Height / 2, rebornLogoReborn.Width, rebornLogoReborn.Height, 0, 0, rebornLogoReborn.Width, rebornLogoReborn.Height);
		} else if (blueTheme) {
			gr.DrawImage(rebornLogoBlue, window.Width / 2 - rebornLogoBlue.Width / 2, window.Height / 2 - rebornLogoBlue.Height / 2, rebornLogoBlue.Width, rebornLogoBlue.Height, 0, 0, rebornLogoBlue.Width, rebornLogoBlue.Height);
		} else if (darkblueTheme) {
			gr.DrawImage(rebornLogoDarkblue, window.Width / 2 - rebornLogoDarkblue.Width / 2, window.Height / 2 - rebornLogoDarkblue.Height / 2, rebornLogoDarkblue.Width, rebornLogoDarkblue.Height, 0, 0, rebornLogoDarkblue.Width, rebornLogoDarkblue.Height);
		} else if (redTheme) {
			gr.DrawImage(rebornLogoRed, window.Width / 2 - rebornLogoRed.Width / 2, window.Height / 2 - rebornLogoRed.Height / 2, rebornLogoRed.Width, rebornLogoRed.Height, 0, 0, rebornLogoRed.Width, rebornLogoRed.Height);
		} else if (creamTheme) {
			gr.DrawImage(rebornLogoCream, window.Width / 2 - rebornLogoCream.Width / 2, window.Height / 2 - rebornLogoCream.Height / 2, rebornLogoCream.Width, rebornLogoCream.Height, 0, 0, rebornLogoCream.Width, rebornLogoCream.Height);
		} else if (nblueTheme) {
			gr.DrawImage(rebornLogoNblue, window.Width / 2 - rebornLogoNblue.Width / 2, window.Height / 2 - rebornLogoNblue.Height / 2, rebornLogoNblue.Width, rebornLogoNblue.Height, 0, 0, rebornLogoNblue.Width, rebornLogoNblue.Height);
		} else if (ngreenTheme) {
			gr.DrawImage(rebornLogoNgreen, window.Width / 2 - rebornLogoNgreen.Width / 2, window.Height / 2 - rebornLogoNgreen.Height / 2, rebornLogoNgreen.Width, rebornLogoNgreen.Height, 0, 0, rebornLogoNgreen.Width, rebornLogoNgreen.Height);
		} else if (nredTheme) {
			gr.DrawImage(rebornLogoNred, window.Width / 2 - rebornLogoNred.Width / 2, window.Height / 2 - rebornLogoNred.Height / 2, rebornLogoNred.Width, rebornLogoNred.Height, 0, 0, rebornLogoNred.Width, rebornLogoNred.Height);
		} else if (ngoldTheme) {
			gr.DrawImage(rebornLogoNgold, window.Width / 2 - rebornLogoNgold.Width / 2, window.Height / 2 - rebornLogoNgold.Height / 2, rebornLogoNgold.Width, rebornLogoNgold.Height, 0, 0, rebornLogoNgold.Width, rebornLogoNgold.Height);
		}
	}
}
