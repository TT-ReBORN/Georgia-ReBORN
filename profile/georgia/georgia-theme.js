const panelVersion = window.GetProperty('_theme_version (do not hand edit!)', '2.0.3');
window.DefineScript('Georgia-ReBORN', {author: 'TT', version: panelVersion, features: {drag_n_drop: true} });

const basePath = fb.ProfilePath + 'georgia\\';

function loadAsyncFile(filePath) {
    return new Promise(resolve => {
        setTimeout(() => {
            include(filePath);
            resolve();
        }, 0);
    })
}

const loadAsync = window.GetProperty('Load Theme Asynchronously', true);
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
    'js\\defaults.js',  // used in settings.js
    'js\\hyperlinks.js',    // used in settings.js
    'js\\settings.js',   // must be below hyperlinks.js and Common.js
    'js\\CaTRoX_QWR\\Utility_LinkedList.js',
    'js\\CaTRoX_QWR\\Control_ContextMenu.js',
    'js\\CaTRoX_QWR\\Control_Scrollbar.js',
    'js\\CaTRoX_QWR\\Control_List.js',
    'js\\CaTRoX_QWR\\Panel_Playlist.js',
    'js\\CaTRoX_QWR\\Panel_Library.js',
    'js\\CaTRoX_QWR\\Control_Button.js',
    'js\\color.js',
    'js\\themes.js',
    'js\\volume.js',
    'js\\image-caching.js',
    'js\\ui-components.js',
    'js\\lyrics.js',
    'images\\icons\\original\\64\\lfmk.js',
    'js\\biography.js',
    'js\\georgia-main.js'
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
    const darkMode = window.GetProperty('Use Dark Theme', false);
    const whiteTheme = window.GetProperty('Georgia-ReBORN White Theme', 'white');
    const blackTheme = window.GetProperty('Georgia-ReBORN Black Theme', 'black');
    const blueTheme = window.GetProperty('Georgia-ReBORN Blue Theme', 'blue');
    const darkblueTheme = window.GetProperty('Georgia-ReBORN Dark Blue Theme', 'darkblue');
    const redTheme = window.GetProperty('Georgia-ReBORN Red Theme', 'red');
    const creamTheme = window.GetProperty('Georgia-ReBORN Cream Theme', 'cream');
    const nblueTheme = window.GetProperty('Georgia-ReBORN Neon Blue Theme', 'nblue');
    const ngreenTheme = window.GetProperty('Georgia-ReBORN Neon Green Theme', 'ngreen');
    const nredTheme = window.GetProperty('Georgia-ReBORN Neon Red Theme', 'nred');
    const ngoldTheme = window.GetProperty('Georgia-ReBORN Neon Gold Theme', 'ngold');
    const col = {};

    if (whiteTheme) {
        col.bg = RGB(245, 245, 245);
        col.menu_bg = RGB(245, 245, 245);
        col.now_playing = RGB(120, 120, 120);
        col.progress_fill = RGB(180, 180, 180);
    } else if (blackTheme) {
        col.bg = RGB(25, 25, 25);
        col.menu_bg = RGB(25, 25, 25);
        col.now_playing = RGB(200, 200, 200);
        col.progress_fill = RGB(100, 100, 100);
    } else if (blueTheme) {
        col.bg = RGB(5, 110, 195);
        col.menu_bg = RGB(5, 110, 195);
        col.now_playing = RGB(255, 255, 255);
        col.progress_fill = RGB(242, 230, 170);
    } else if (darkblueTheme) {
        col.bg = RGB(22, 40, 63);
        col.menu_bg = RGB(22, 40, 63);
        col.now_playing = RGB(255, 255, 255);
        col.progress_fill = RGB(255, 202, 128);
    } else if (redTheme) {
        col.bg = RGB(100, 20, 20);
        col.menu_bg = RGB(100, 20, 20);
        col.now_playing = RGB(220, 220, 220);
        col.progress_fill = RGB(245, 212, 165);
    } else if (creamTheme) {
        col.bg = RGB(255, 249, 245);
        col.menu_bg = RGB(255, 249, 245);
        col.now_playing = RGB(100, 100, 100);
        col.progress_fill = RGB(120, 170, 130);
    } else if (nblueTheme) {
        col.bg = RGB(20, 20, 20);
        col.menu_bg = RGB(20, 20, 20);
        col.now_playing = RGB(200, 200, 200);
        col.progress_fill = RGB(0, 200, 255);
    } else if (ngreenTheme) {
        col.bg = RGB(20, 20, 20);
        col.menu_bg = RGB(20, 20, 20);
        col.now_playing = RGB(200, 200, 200);
        col.progress_fill = RGB(0, 200, 0);
    } else if (nredTheme) {
        col.bg = RGB(20, 20, 20);
        col.menu_bg = RGB(20, 20, 20);
        col.now_playing = RGB(200, 200, 200);
        col.progress_fill = RGB(229, 7, 44);
    } else if (ngoldTheme) {
        col.bg = RGB(20, 20, 20);
        col.menu_bg = RGB(20, 20, 20);
        col.now_playing = RGB(200, 200, 200);
        col.progress_fill = RGB(254, 204, 3);
    }

    const use_4k = window.GetProperty('Detect 4k', 'auto');
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
    const menuHeight = scaleForDisplay(160);
    gr.FillSolidRect(0, 0, ww, wh, col.bg);
    //gr.FillSolidRect(0, 0, ww, menuHeight, col.menu_bg); // I don't need this

    // ---> UIHacks Aero Glass Shadow Frame Fix
    if (whiteTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(245, 245, 245));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(245, 245, 245));
    } else if (blackTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(35, 35, 35));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(35, 35, 35));
    } else if (blueTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(63, 155, 202));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(63, 155, 202));
    } else if (darkblueTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(27, 55, 90));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(27, 55, 90));
    } else if (redTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(125, 0, 0));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(125, 0, 0));
    } else if (creamTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(255, 249, 245));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(255, 249, 245));
    } else if (nblueTheme || ngreenTheme || nredTheme || ngoldTheme) {
    gr.DrawLine(0, 0, ww, 0, 1, RGB(30, 30, 30));
    gr.DrawLine(ww, wh - 1, 0, wh - 1, 1, RGB(30, 30, 30));
    }
    // End

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
    const ft_lower = font(fontLight, 18, 0);
    const ft_lower_bold = font(fontBold, 18, 0);
    const lowerBarTop = wh - scaleForDisplay(80);
    const loadingWidth = Math.ceil(gr.MeasureString(loadStrs.loading, ft_lower, 0, 0, 0, 0).Width);
    const titleMeasurements = gr.MeasureString(loadStrs.fileName, ft_lower, 0, 0, 0, 0);
    const progressBar = {
        x: scaleForDisplay(40),
        y: Math.round(lowerBarTop + titleMeasurements.Height) + (is_4k ? scaleForDisplay(6) - 1 : scaleForDisplay(7)),
        w: ww - scaleForDisplay(80),
        h: scaleForDisplay(12) + (ww > 1920 ? 2 : 0)
    }
    gr.DrawString(loadStrs.loading, ft_lower_bold, col.now_playing, progressBar.x, lowerBarTop - (is_4k ? scaleForDisplay(6) - 1 : scaleForDisplay(5) - 1), progressBar.w, titleMeasurements.Height);
    gr.DrawString(loadStrs.fileName, ft_lower, col.now_playing, progressBar.x + loadingWidth + scaleForDisplay(20), lowerBarTop - (is_4k ? scaleForDisplay(6) - 1 : scaleForDisplay(5) - 1), progressBar.w, titleMeasurements.Height);
    if (whiteTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(220, 220, 220));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(180, 180, 180));
    } else if (blackTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(50, 50, 50));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(100, 100, 100));
    } else if (blueTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(10, 130, 220));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(242, 230, 170));
    gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, RGB(23, 111, 194));
    } else if (darkblueTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(27, 55, 90));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(255, 202, 128));
    gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, RGB(22, 37, 54));
    } else if (redTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(140, 25, 25));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(245, 212, 165));
    gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, RGB(92, 21, 21));
    } else if (creamTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(255, 255, 255));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(120, 170, 130));
    gr.DrawRect(progressBar.x - 2, progressBar.y - 2, progressBar.w + 3, progressBar.h + 3, 1, RGB(230, 230, 230));
    } else if (nblueTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(35, 35, 35));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(0, 200, 255));
    } else if (ngreenTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(35, 35, 35));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(0, 200, 0));
    } else if (nredTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(35, 35, 35));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(229, 7, 44));
    } else if (ngoldTheme) {
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w, progressBar.h, RGB(35, 35, 35));
    gr.FillSolidRect(progressBar.x, progressBar.y, progressBar.w * (loadStrs.fileIndex + 1) / fileList.length, progressBar.h, RGB(254, 204, 3));
    }
}
