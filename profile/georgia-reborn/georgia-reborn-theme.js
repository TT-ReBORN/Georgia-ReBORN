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
    'js\\CaTRoX_QWR\\Panel_Library.js',
    'js\\CaTRoX_QWR\\Control_Button.js',
    'js\\biography.js',
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
    const layout_mode   = window.GetProperty('Georgia-ReBORN - System: Layout mode', ['default_mode', 'compact_mode']);
    const whiteTheme    = window.GetProperty('Georgia-ReBORN - Theme: White', 'white');
    const blackTheme    = window.GetProperty('Georgia-ReBORN - Theme: Black', 'black');
    const blueTheme     = window.GetProperty('Georgia-ReBORN - Theme: Blue', 'blue');
    const darkblueTheme = window.GetProperty('Georgia-ReBORN - Theme: Dark blue', 'darkblue');
    const redTheme      = window.GetProperty('Georgia-ReBORN - Theme: Red', 'red');
    const creamTheme    = window.GetProperty('Georgia-ReBORN - Theme: Cream', 'cream');
    const nblueTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon blue', 'nblue');
    const ngreenTheme   = window.GetProperty('Georgia-ReBORN - Theme: Neon green', 'ngreen');
    const nredTheme     = window.GetProperty('Georgia-ReBORN - Theme: Neon red', 'nred');
    const ngoldTheme    = window.GetProperty('Georgia-ReBORN - Theme: Neon gold', 'ngold');
    const col = {};

    col.bg =
    whiteTheme ? RGB(245, 245, 245) :
    blackTheme ? RGB(25, 25, 25) :
    blueTheme ? RGB(5, 110, 195) :
    darkblueTheme ? RGB(22, 40, 63) :
    redTheme ? RGB(100, 20, 20) :
    creamTheme ? RGB(255, 249, 245) :
    nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(20, 20, 20) : '';

    col.now_playing =
    whiteTheme ? RGB(120, 120, 120) :
    blackTheme ? RGB(200, 200, 200) :
    blueTheme ? RGB(255, 255, 255) :
    darkblueTheme ? RGB(255, 255, 255) :
    redTheme ? RGB(220, 220, 220) :
    creamTheme ? RGB(100, 100, 100) :
    nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(200, 200, 200) : '';

    col.progress_fill =
    whiteTheme ? RGB(180, 180, 180) :
    blackTheme ? RGB(100, 100, 100) :
    blueTheme ? RGB(242, 230, 170) :
    darkblueTheme ? RGB(255, 202, 128) :
    redTheme ? RGB(245, 212, 165) :
    creamTheme ? RGB(120, 170, 130) :
    nblueTheme ? RGB(0, 200, 255) :
    ngreenTheme ? RGB(0, 200, 0) :
    nredTheme ? RGB(229, 7, 44) :
    ngoldTheme ? RGB(254, 204, 3) : '';

    const use_4k = window.GetProperty('Georgia-ReBORN - System: Detect 4k', 'auto');
    const ww = window.Width;
    const wh = window.Height;

    if (use_4k === 'always') {
        is_4k = true;
    } else if (use_4k === 'auto' && (ww > 3000 || wh > 1400)) {
        is_4k = true;
    } else {
        is_4k = false;
    }
    gr.SetSmoothingMode(3);
    gr.FillSolidRect(0, 0, ww, wh, col.bg);

	// UIHacks Aero Glass Shadow Frame Fix
	gr.DrawLine(0, 0, ww, 0, 1,
		whiteTheme ? RGB(245, 245, 245) :
		blackTheme ? RGB(35, 35, 35) :
		blueTheme ? RGB(63, 155, 202) :
		darkblueTheme ? RGB(27, 55, 90) :
		redTheme ? RGB(125, 0, 0) :
		creamTheme ? RGB(255, 249, 245) :
		nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(30, 30, 30) : ''
	);
	gr.DrawLine(ww, wh - 1, 0, wh - 1, 1,
		whiteTheme ? RGB(245, 245, 245) :
		blackTheme ? RGB(35, 35, 35) :
		blueTheme ? RGB(63, 155, 202) :
		darkblueTheme ? RGB(27, 55, 90) :
		redTheme ? RGB(125, 0, 0) :
		creamTheme ? RGB(255, 249, 245) :
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
    else if (layout_mode === 'compact_mode') {
        var ft_lower = font(fontLight, lower_bar_font_size_compact ? lower_bar_font_size_compact : 16, 0);
        var ft_lower_bold = font(fontBold, lower_bar_font_size_compact ? lower_bar_font_size_compact : 16, 0);
    }
    const lower_bar_h = scaleForDisplay(120);
    const lowerBarTop = layout_mode === 'compact_mode' ? wh - lower_bar_h + (is_4k ? 33 : 18) : wh - lower_bar_h + (is_4k ? 65 : 35);
    const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower, 0, 0, 0, 0).Width);
    const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower, 0, 0, 0, 0);
    const progressBar = {
        x: layout_mode === 'compact_mode' ? scaleForDisplay(20) : scaleForDisplay(40),
        y: layout_mode === 'compact_mode' ? Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(10) + (ww > 1920 ? 2 : 0)) : Math.round(lowerBarTop + titleMeasurements.Height + scaleForDisplay(12) + (ww > 1920 ? 2 : 0)),
        w: layout_mode === 'compact_mode' ? ww - scaleForDisplay(40) : ww - scaleForDisplay(80),
        h: layout_mode === 'compact_mode' ? scaleForDisplay(10) + (ww > 1920 ? 2 : 0) : scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
    }

    gr.DrawString(loadStrs.loading, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop, progressBar.w, titleMeasurements.Height);
    gr.DrawString(loadStrs.fileName, ft_lower, col.now_playing, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop, progressBar.w, titleMeasurements.Height);

    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h,
        whiteTheme ? RGB(220, 220, 220) :
        blackTheme ? RGB(50, 50, 50) :
        blueTheme ? RGB(10, 130, 220) :
        darkblueTheme ? RGB(27, 55, 90) :
        redTheme ? RGB(140, 25, 25) :
        creamTheme ? RGB(255, 255, 255) :
        nblueTheme || ngreenTheme || nredTheme || ngoldTheme ? RGB(35, 35, 35) : ''
    );
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h,
        whiteTheme ? RGB(180, 180, 180) :
        blackTheme ? RGB(100, 100, 100) :
        blueTheme ? RGB(242, 230, 170) :
        darkblueTheme ? RGB(255, 202, 128) :
        redTheme ? RGB(245, 212, 165) :
        creamTheme ? RGB(120, 170, 130) :
        nblueTheme ? RGB(0, 200, 255) :
        ngreenTheme ? RGB(0, 200, 0) :
        nredTheme ? RGB(229, 7, 44) :
        ngoldTheme ? RGB(254, 204, 3) : ''
    );
    if ((blueTheme || darkblueTheme || redTheme || creamTheme) && !whiteTheme) {
        gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1,
            blueTheme ? RGB(23, 111, 194) :
            darkblueTheme ? RGB(22, 37, 54) :
            redTheme ? RGB(92, 21, 21) :
            creamTheme ? RGB(230, 230, 230) : ''
        );
    }
}
