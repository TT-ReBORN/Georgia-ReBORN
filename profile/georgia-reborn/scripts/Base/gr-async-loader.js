/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Preloader                                * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-09-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * SCRIPT INFO * //
/////////////////////
window.DefineScript('Georgia-ReBORN', {
	author: 'TT',
	version: window.GetProperty('Georgia-ReBORN - #Version: Do not hand edit!', '3.0-x64-DEV'),
	features: { drag_n_drop: true }
});


/////////////////////
// * FILE LOADER * //
/////////////////////
/**
 * A class that is responsible for loading script files on foobar startup or reload.
 */
class FileLoader {
	/**
	 * Create the `FileLoader` instance.
	 */
	constructor() {
		/** @global @type {number} The load start time when foobar was started. */
		this.loadStartTime = Date.now();

		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-helpers.js`);
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-common.js`);
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-config.js`);
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-config-defaults.js`);
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-settings.js`);
		include(`${fb.ProfilePath}georgia-reborn\\scripts\\base\\gr-setup.js`);

		/** @private @type {string} The file list that contains all Georgia-ReBORN script files. */
		this.fileList = [
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
			'playlist\\scripts\\pl-playlist.js',
			'playlist\\scripts\\pl-callbacks.js',
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
			'base\\gr-details.js',
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
			'base\\gr-initialize.js',
			'base\\gr-callbacks.js'
		];

		/**
		 * The strings in the lower bar that are used to display the script files being loaded.
		 * @type {{ loading: string; fileName: string; fileIndex: number }}
		 * @global
		 */
		this.loadStr = { loading: 'Loading:', fileName: '', fileIndex: 0 };

		/** Initialize the file loading process by including all specified script files. */
		this.init();
	}

	/**
	 * Initialize loading all Georgia-ReBORN scripts from fileList and schedule an update check.
	 * @global
	 * @returns {Promise<void>} A promise that resolves when all files are loaded and update check is scheduled.
	 */
	async init() {
		await this.includeFiles(this.fileList, this.loadStartTime);

		console.log(`Georgia-ReBORN loaded in ${Date.now() - this.loadStartTime}ms`);

		if (grSet.checkForUpdates) {
			grCfg.scheduleUpdateCheck(0);
		}
	}

	/**
	 * Loads a list of files asynchronously if grSet.asyncThemePreloader is true, otherwise synchronously.
	 * Throttles UI updates approximately every 16 milliseconds during async loading.
	 * @global
	 * @param {string[]} fileList - The list of files to load.
	 * @param {number} startTime - The timestamp marking the start of the operation, used for calculating total load time and UI update intervals.
	 */
	async includeFiles(fileList, startTime) {
		if (grSet.asyncThemePreloader) {
			const refreshTime = 16; // ~60Hz
			let lastRepaintTime = startTime;
			for (let i = 0; i < fileList.length; i++) {
				this.loadStr.fileName = `${fileList[i]} ...`;
				this.loadStr.fileIndex = i;
				const currentTime = Date.now();
				if (currentTime - lastRepaintTime > refreshTime) {
					lastRepaintTime = currentTime;
					window.Repaint();
				}
				await this.loadAsyncFile(`${fb.ProfilePath}georgia-reborn\\scripts\\${fileList[i]}`);
			}
			return;
		}
		for (const filePath of fileList) {
			include(`${fb.ProfilePath}georgia-reborn\\scripts\\${filePath}`);
		}
	}

	/**
	 * Loads script files asynchronously on foobar startup or reload.
	 * @global
	 * @param {string} filePath - The path to the file to load.
	 * @returns {Promise} A promise that resolves when the file has been loaded.
	 */
	loadAsyncFile(filePath) {
		return new Promise((resolve) => {
			setTimeout(() => {
				include(filePath);
				resolve();
			}, 0);
		});
	}
}


///////////////////
// * PRELOADER * //
///////////////////
/**
 * A class that is responsible for drawing the preloader on foobar startup or reload.
 */
class Preloader {
	/**
	 * Create the `Preloader` instance.
	 */
	constructor() {
		// * GEOMETRY * //
		// #region GEOMETRY
		/** @public @type {number} The global window.Width. */
		this.ww = window.Width;
		/** @public @type {number} The global window.Height. */
		this.wh = window.Height;
		/** @public @type {number} The y-position of the lower bar text. */
		this.lowerBarTextY = 0;
		/** @public @type {number} The width of the lower bar text. */
		this.lowerBarTextW = 0;
		/** @public @type {number} The height of the lower bar text. */
		this.lowerBarTextH = 0;
		/** @public @type {number} The width of the seekbar. */
		this.seekbarW = 0;
		/** @public @type {number} The height of the seekbar. */
		this.seekbarH = 0;
		/** @public @type {number} The x-position of the seekbar. */
		this.seekbarX = 0;
		/** @public @type {number} The y-position of the seekbar. */
		this.seekbarY = 0;
		// #endregion

		// * OBJECTS * //
		// #region OBJECTS
		/** @public @type {object} The preloader main colors object. */
		this.col = {};
		/** @public @type {object} The bold font for the lower bar. */
		this.ft_lower_bar_bold = null;
		/** @public @type {object} The light font for the lower bar. */
		this.ft_lower_bar_light = null;
		/** @public @type {object} The custom theme colors object. */
		this.customThemes = {
			custom01: grCfg.customTheme01,
			custom02: grCfg.customTheme02,
			custom03: grCfg.customTheme03,
			custom04: grCfg.customTheme04,
			custom05: grCfg.customTheme05,
			custom06: grCfg.customTheme06,
			custom07: grCfg.customTheme07,
			custom08: grCfg.customTheme08,
			custom09: grCfg.customTheme09,
			custom10: grCfg.customTheme10
		};
		/** @public @type {object} The currently selected custom theme with its colors. */
		this.customTheme = this.customThemes[grSet.theme];
		// #endregion

		// * STATE * //
		// #region STATE
		/** @public @type {boolean} The state indicating if the layout is not default. */
		this.layoutNotDefault = grSet.layout !== 'default';
		/** @public @type {boolean} The state indicating if the theme is one of the neon themes. */
		this.themeNeon = ['nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme);
		/** @public @type {boolean} The state indicating if the theme is a custom theme. */
		this.themeCustom = grSet.theme && grSet.theme.startsWith('custom');
		/** @public @type {boolean} The state indicating if the theme is in night mode. */
		this.themeNight = grSet.themeDayNightMode && grSet.themeDayNightTime === 'night' && !grSet.styleRebornWhite;
		/** @public @type {boolean} The state indicating if the style is nighttime. */
		this.styleNight = ['reborn', 'random'].includes(grSet.theme) && grSet.styleNighttime;
		// #endregion

		// * HELPERS * //
		// #region HELPERS
		/**
		 * Scales the value based on 4K mode and the display scale setting.
		 * @param {number} val - The value that needs to be scaled.
		 * @returns {number} The scaled value.
		 * @private
		 */
		this.SCALE = (val) => {
			const baseScale = RES._4K ? 2 : 1;
			const scaleFactor = grSet.displayScale / 100;
			return val * baseScale * scaleFactor;
		}
		// #endregion

		// * INITIALIZATION * //
		// #region INITIALIZATION
		this.initThemeDayNightModeState();
		this.initColors();
		this.initFonts();
		// #endregion
	}

	/**
	 * Initializes the theme day/night mode state.
	 * Start the theme day/night mode initialization before drawing the preloader.
	 */
	initThemeDayNightModeState() {
		if (!grSet.themeDayNightMode) return;
		initThemeDayNightMode(new Date());
		const [dayStart, nightStart] = grSet.themeDayNightMode.split('-');
		console.log(`Theme day/night mode is active, current time is: ${initThemeDayNightMode(new Date())}. The schedule has been set to ${To12HourTimeFormat(dayStart)} (day) - ${To12HourTimeFormat(nightStart)} (night).`);
	}

	/**
	 * Initializes color settings based on themes and styles.
	 * Sets background, lower bar title, progress bar, progress bar fill, progress bar frame, and UI hacks frame colors.
	 */
	initColors() {
		const themeNight = this.styleNight || this.themeNight;
		const rebornDark = (themeNight || grSet.styleRebornBlack);
		const rebornDark2 = this.styleNight || grSet.styleRebornBlack;
		const themeCustom = (key, defCol) => this.themeCustom && this.customTheme[key] !== '' ? HEXtoRGB(this.customTheme[key]) : defCol;

		this.col.bg = ({
			white: grSet.styleBlackAndWhite ? RGB(230, 230, 230) : grSet.styleBlackAndWhite2 ? RGB(25, 25, 25) : RGB(245, 245, 245),
			black: RGB(25, 25, 25),
			reborn: rebornDark ? RGB(25, 25, 25) : RGB(245, 245, 245),
			random: rebornDark ? RGB(25, 25, 25) : RGB(245, 245, 245),
			blue: RGB(5, 110, 195),
			darkblue: RGB(22, 40, 63),
			red: RGB(100, 20, 20),
			cream: RGB(255, 247, 240)
		}[grSet.theme] ||
			(this.themeNeon ? RGB(20, 20, 20) :
			themeCustom('grCol_preloaderBg', themeNight ? RGB(25, 25, 25) : RGB(245, 245, 245)))
		);
		UIWizard.WindowBgColor = this.col.bg;

		this.col.lowerBarTitle = ({
			white: RGB(120, 120, 120),
			black: RGB(200, 200, 200),
			reborn: rebornDark ? RGB(200, 200, 200) : RGB(120, 120, 120),
			random: rebornDark ? RGB(200, 200, 200) : RGB(120, 120, 120),
			blue: RGB(255, 255, 255),
			darkblue: RGB(255, 255, 255),
			red: RGB(220, 220, 220),
			cream: RGB(100, 100, 100)
		}[grSet.theme] ||
			(this.themeNeon ? RGB(200, 200, 200) :
			themeCustom('grCol_preloaderLowerBarTitle', themeNight ? RGB(200, 200, 200) : RGB(120, 120, 120)))
		);

		this.col.progressBar = ({
			white: grSet.styleBlackAndWhite ? RGB(210, 210, 210) : grSet.styleBlackAndWhite2 ? RGB(40, 40, 40) : RGB(220, 220, 220),
			black: RGB(35, 35, 35),
			reborn: rebornDark2 ? RGB(50, 50, 50) : this.themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220),
			random: rebornDark2 ? RGB(50, 50, 50) : this.themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220),
			blue: RGB(10, 130, 220),
			darkblue: RGB(27, 55, 90),
			red: RGB(140, 25, 25),
			cream: RGB(255, 255, 255)
		}[grSet.theme] ||
			(this.themeNeon ? RGB(35, 35, 35) :
			themeCustom('grCol_preloaderProgressBar', themeNight ? RGB(35, 35, 35) : RGB(220, 220, 220)))
		);

		this.col.progressBarFill = ({
			white: grSet.styleBlackAndWhite ? RGB(255, 255, 255) : grSet.styleBlackAndWhite2 ? RGB(210, 210, 210) : RGB(25, 160, 240),
			black: RGB(175, 205, 225),
			reborn: this.styleNight ? RGB(195, 225, 230) : (grSet.styleRebornBlack || this.themeNight) ? RGB(255, 255, 255) : RGB(90, 90, 90),
			random: this.styleNight ? RGB(140, 215, 215) : this.themeNight ? RGB(255, 255, 255) : RGB(70, 70, 70),
			blue: RGB(242, 230, 170),
			darkblue: RGB(255, 202, 128),
			red: RGB(245, 212, 165),
			cream: RGB(120, 170, 130),
			nblue: RGB(0, 200, 255),
			ngreen: RGB(0, 200, 0),
			nred: RGB(240, 10, 60),
			ngold: RGB(255, 205, 5)
		}[grSet.theme] ||
			themeCustom('grCol_preloaderProgressBarFill', themeNight ? RGB(225, 225, 195) : RGB(50, 25, 70))
		);

		this.col.progressBarFrame = ({
			blue: RGB(22, 107, 186),
			darkblue: RGB(22, 37, 54),
			red: RGB(92, 21, 21),
			cream: RGB(230, 230, 230)
		}[grSet.theme] ||
			themeCustom('grCol_preloaderProgressBarFrame', themeNight ? RGB(25, 25, 25) : RGB(255, 255, 255))
		);
	}

	/**
	 * Initializes font settings based on themes and styles.
	 * Sets fonts for the lower bar.
	 */
	initFonts() {
		const fontLowerBarBold = grSet.customThemeFonts ? grCfg.customFont.fontLowerBarArtist : 'HelveticaNeueLT Pro 65 Md';
		const fontLowerBarLight = grSet.customThemeFonts ? grCfg.customFont.fontLowerBarTitle : 'HelveticaNeueLT Pro 45 Lt';

		const fontSize =
			grSet.layout === 'compact' ? grSet.lowerBarFontSize_compact || 16 :
			grSet.layout === 'artwork' ? grSet.lowerBarFontSize_artwork || 16 :
										 grSet.lowerBarFontSize_default || 18;

		this.ft_lower_bar_bold  = Font(fontLowerBarBold,  fontSize, 0);
		this.ft_lower_bar_light = Font(fontLowerBarLight, fontSize, 0);
	}

	/**
	 * Sets layout metrics for the preloader.
	 * Calculates dimensions and positions for various elements.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	setMetrics(gr) {
		this.ww = window.Width;
		this.wh = window.Height;
		RES._4K = grSet.displayRes === '4K' || this.ww > 2560 && this.wh > 1600;

		const lowerBarHeight = this.SCALE(120);
		const lowerBarTop = this.wh - lowerBarHeight;
		const edgeMargin = this.SCALE(this.layoutNotDefault ? 20 : 40);
		const edgeMarginBoth = this.SCALE(this.layoutNotDefault ? 40 : 80);
		const textMargin = this.SCALE(15);

		this.lowerBarTextW = gr.CalcTextWidth(grFileLoader.loadStr.loading, this.ft_lower_bar_light);
		this.lowerBarTextH = gr.CalcTextHeight(grFileLoader.loadStr.fileName, this.ft_lower_bar_light);
		this.lowerBarTextY = this.layoutNotDefault ? Math.round(lowerBarTop + edgeMargin) : Math.round(lowerBarTop + (lowerBarHeight - (this.lowerBarTextH + textMargin)) / 2);

		this.seekbarW = this.ww - edgeMarginBoth;
		this.seekbarH = this.SCALE(this.layoutNotDefault ? 10 : 12);
		this.seekbarX = edgeMargin;
		this.seekbarY = this.layoutNotDefault ? Math.round(this.lowerBarTextY + this.lowerBarTextH + this.seekbarH) : Math.round(this.wh - edgeMargin);
	}

	/**
	 * Draws the entire preloader.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPreloader(gr) {
		this.setMetrics(gr);

		// * Apply better anti-aliasing on smaller font sizes in HD res
		gr.SetTextRenderingHint(!RES._4K && (grSet.gridArtistFontSize_layout < 18 || grSet.displayScale < 100) ? TextRenderingHint.ClearTypeGridFit : TextRenderingHint.AntiAliasGridFit);
		gr.SetSmoothingMode(SmoothingMode.None);

		// * BACKGROUND * //
		gr.FillSolidRect(0, 0, this.ww, this.wh, this.col.bg);

		// * LOGO/TEXT * //
		if (grSet.showPreloaderLogo) {
			this.drawLogo(gr);
		} else {
			gr.DrawString(grFileLoader.loadStr.loading, this.ft_lower_bar_bold, this.col.lowerBarTitle, this.seekbarX, this.lowerBarTextY, this.seekbarW, this.lowerBarTextH);
			gr.DrawString(grFileLoader.loadStr.fileName, this.ft_lower_bar_light, this.col.lowerBarTitle, this.seekbarX + this.lowerBarTextW + this.SCALE(20), this.lowerBarTextY, this.seekbarW - this.lowerBarTextW - this.SCALE(20), this.lowerBarTextH);
		}

		// * SEEKBAR * //
		gr.FillSolidRect(this.seekbarX, this.seekbarY, this.seekbarW, this.seekbarH, this.col.progressBar);
		gr.FillSolidRect(this.seekbarX, this.seekbarY, this.seekbarW * (grFileLoader.loadStr.fileIndex + this.SCALE(1)) / grFileLoader.fileList.length, this.seekbarH, this.col.progressBarFill);
		if ((['blue', 'darkblue', 'red', 'cream'].includes(grSet.theme) || this.themeCustom) && !grSet.systemFirstLaunch) {
			gr.DrawRect(this.seekbarX - this.SCALE(2), this.seekbarY - this.SCALE(2), this.seekbarW + this.SCALE(3), this.seekbarH + this.SCALE(3), this.SCALE(1), this.col.progressBarFrame);
		}
	}

	/**
	 * Draws the logo in the preloader.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawLogo(gr) {
		const plus4K = RES._4K ? '4K-' : '';

		// * CUSTOM LOGO * //
		const logoNight = grSet.styleNighttime ? '-night' : '';
		const customLogo = `custom-logo${logoNight}.png`;

		// * CUSTOM THEME LOGO * //
		const customThemeLogoConfig = this.customTheme && this.customTheme.grCol_preloaderLogo !== '';
		const cThemeLogo = this.customTheme && this.customTheme.grCol_preloaderLogo;

		// * NIGHTTIME LOGOS * //
		const nighttime = (grSet.styleNighttime || grSet.themeDayNightMode && grSet.themeDayNightTime === 'night') && !grSet.styleRebornWhite;
		const nighttimeReborn = nighttime && grSet.theme === 'reborn';
		const nighttimeRandom = nighttime && grSet.theme === 'random';
		const nighttimeCustom = nighttime && this.themeCustom;

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
			[this.themeCustom]:           'logo-custom.png',
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
		if (typeof this.drawLogo.logoErrorShown === 'undefined') {
			this.drawLogo.logoErrorShown = false;
		}
		if (utils.IsFile(paths.logo)) {
			const logo = gdi.Image(paths.logo);
			const scaleFactor = RES._4K ? 0.5 : 1;
			const w = this.SCALE(logo.Width * scaleFactor);
			const h = this.SCALE(logo.Height * scaleFactor);
			const x = this.ww * 0.5 - w * 0.5;
			const y = this.wh * 0.5 - h * 0.5;
			gr.DrawImage(logo, x, y, w, h, 0, 0, logo.Width, logo.Height);
		}
		else if (!this.drawLogo.logoErrorShown) {
			const customLogoPath = `${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\`;
			fb.ShowPopupMessage(`Logo file not found:\n\nIf you are using a custom logo, please ensure the file exists and has the correct name at the following location:\n\n${customLogoPath}\n\nImportant: Do not include the "4K-" prefix in your filename.\nThe script applies this prefix automatically, adding it manually will lead to naming issues such as "4K-4K-logoname.png".`, 'Logo error');
			this.drawLogo.logoErrorShown = true;
		}
	}
}


//////////////////////////////
// * THEME DAY/NIGHT MODE * //
//////////////////////////////
/**
 * Initializes the current time and changes the theme to day or night based on the OS clock and grSet.themeDayNightMode value.
 * The grSet.themeDayNightMode can be a string in the format 'startHour-endHour', which represents custom starting and ending hours for the day theme.
 * For example, '6-18' indicates day theme from 6 AM to 6 PM. This range can wrap around midnight.
 * The value 'false' disables the day/night theme feature, which is the default setting.
 * If the feature is disabled or if other theme-related preferences are set, the function exits without changing the theme.
 * This function has a side effect of modifying grSet.theme.
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


//////////////////////////////////
// ! PRELOADER INITIALIZATION ! //
//////////////////////////////////
/**
 * The instance of `FileLoader` class for file loading operations.
 * @typedef {FileLoader}
 * @global
 */
const grFileLoader = new FileLoader();

/**
 * The instance of `Preloader` class for preloader operations.
 * @typedef {Preloader}
 * @global
 */
const grPreloader = new Preloader();

/**
 * Called when drawing graphics.
 * Draws the preloader on foobar startup or reload.
 *
 * This callback will be overridden by the main UI's on_paint() callback in gr-initialize.js once the theme loads.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 */
function on_paint(gr) {
	grPreloader.drawPreloader(gr);
}
