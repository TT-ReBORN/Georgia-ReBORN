/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Theme Day/Night Mode                     * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    08-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////
// * THEME DAY/NIGHT * //
/////////////////////////
/**
 * A class that is responsible for managing theme day/night mode and design preset time-based switching.
 */
class ThemeDayNight {
	/**
	 * Creates the `ThemeDayNight` instance.
	 */
	constructor() {
		/** @private @type {?number} The timer ID for periodic checks (every 10 minutes). */
		this.timer = null;
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Initializes time-based theming during preloader phase.
	 * Applies immediate styles but does NOT start timers or log.
	 */
	static initThemeDayNightPreloader() {
		const instance = new ThemeDayNight();

		if (grSet.design === 'modern_day_night') {
			instance.initDesignPresetModernDynamic(new Date());
		}
		else if (grSet.themeDayNightEnabled) {
			instance.normalizeTimeRangeSetting();
			instance.applyTimeBasedTheme(new Date());
		}
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Formats current time as 12-hour string.
	 * @returns {string} Formatted time string.
	 * @private
	 */
	formatTime() {
		const now = new Date();
		const min = now.getMinutes();
		const hour = now.getHours();

		const minutes = min < 10 ? `0${min}` : min;
		const hours = hour % 12 || 12;
		const suffix = hour >= 12 ? 'PM' : 'AM';

		return `${hours}:${minutes} ${suffix}`;
	}

	/**
	 * Gets start/end hours with validation and fallbacks.
	 * @returns {{startHour: number, endHour: number}}
	 * @private
	 */
	getTimeRange() {
		let startHour = 6;
		let endHour = 18;
		const rangeSetting = grSet.themeDayNightSchedule;

		if (rangeSetting && typeof rangeSetting === 'string' && rangeSetting.includes('-')) {
			const parts = rangeSetting.split('-');
			const start = parseInt(parts[0], 10);
			const end = parseInt(parts[1], 10);

			if ((!isNaN(start) && !isNaN(end)) && (start >= 0 && start <= 24) && (end >= 0 && end <= 24)) {
				if (start === end && start !== 0 && end !== 24) {
					return { startHour, endHour };
				}
				startHour = start;
				endHour = end;
			}
		}

		return { startHour, endHour };
	}

	/**
	 * Determines if current hour is in daytime range.
	 * Semantics: startHour-endHour represents the DAYTIME period.
	 *
	 * "6-18"  = Day is 06:00-17:59, Night is 18:00-05:59
	 *
	 * "22-6"  = Day is 22:00-05:59, Night is 06:00-21:59 (wraps midnight)
	 *
	 * "17-23" = Day is 17:00-22:59, Night is 23:00-16:59
	 *
	 * @param {number} hours - The current hour (0-23).
	 * @param {number} startHour - The day start hour.
	 * @param {number} endHour - The day end hour.
	 * @returns {boolean} True if in daytime range.
	 * @private
	 */
	isDayTimeRange(hours, startHour, endHour) {
		// Special case for full 24-hour day
		if (startHour === 0 && endHour === 24) {
			return true; // Always day
		}

		// Normal case: start < end (6-18)
		// Wrap case: start > end (22-6, wraps through midnight)
		return startHour < endHour
			? hours >= startHour && hours < endHour
			: hours >= startHour || hours < endHour;
	}
	// #endregion

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the modern_day_night design preset based on time of day.
	 * Respects the same schedule as general day/night mode.
	 * @param {Date} date - The current date/time.
	 */
	initDesignPresetModernDynamic(date) {
		const hours = date.getHours();
		const { startHour, endHour } = this.getTimeRange();
		const isDayTime = this.isDayTimeRange(hours, startHour, endHour);

		grSet.themeDayNightTime = isDayTime ? 'day' : 'night';

		if (isDayTime) { // * Modern white
			grSet.styleRebornWhite = true;
			grSet.styleRebornBlack = false;
			grSet.styleProgressBarDesign = 'rounded';
			grSet.styleProgressBarFill = 'bevel';
			grSet.styleVolumeBarDesign = 'rounded';
			grSet.styleVolumeBarFill = 'bevel';
		} else { // * Modern black
			grSet.styleRebornWhite = false;
			grSet.styleRebornBlack = true;
			grSet.styleProgressBarDesign = 'default';
			grSet.styleProgressBarFill = 'inner';
			grSet.styleVolumeBarDesign = 'default';
			grSet.styleVolumeBarFill = 'inner';
		}

		setTimeout(() => {
			this.applyFoobarTheme();
		}, 1000); // Delay needed to prevent weird window size on foobar2000 startup
	}

	/**
	 * Initializes time-based theming in the main UI.
	 * Starts timer, restores state if needed, logs schedule.
	 */
	initThemeDayNightMain() {
		if (grSet.design === 'modern_day_night') {
			this.initDesignPresetModernDynamic(new Date());
			this.startTimer();
			return;
		}

		// Abort if general day/night mode is off or in setup mode or custom tags are active
		if (!grSet.themeDayNightEnabled || grSet.themeSetupDay || grSet.themeSetupNight ||
			$('[%GR_THEME%]') || $('[%GR_STYLE%]') || $('[%GR_PRESET%]')) {
			this.stopTimer();
			return;
		}

		this.normalizeTimeRangeSetting();
		this.restoreThemeDayNight();
		this.startTimer();

		const currentTime = this.formatTime();
		const { startHour, endHour } = this.getTimeRange();

		console.log(
			`Theme day/night mode active. Current time: ${currentTime}. ` +
			`Schedule: ${To12HourTimeFormat(startHour)} (day) - ${To12HourTimeFormat(endHour)} (night)`
		);
	}
	// #endregion

	// * PUBLIC METHODS - COMMON * //
	// #region PUBLIC METHODS - COMMON
	/**
	 * Applies the appropriate foobar2000 'Light' or 'Dark' mode based on current theme/settings.
	 * The mode is always determined internally from the active configuration.
	 */
	applyFoobarTheme() {
		// Dark designs and themes
		const darkDesignPresets = grSet.design === 'modern_black';
		const darkThemes = ['black', 'nblue', 'ngreen', 'nred', 'ngold'].includes(grSet.theme);
		const darkCustomThemes = grSet.theme === 'custom10';

		// Dark special styles
		const styleBlackAndWhite2 = grSet.theme === 'white' && grSet.styleBlackAndWhite2;
		const styleRebornBlack = grSet.theme === 'reborn' && grSet.styleRebornBlack;
		const styleRandomDark = grSet.theme === 'random' && grSet.styleRandomDark;
		const styleNighttime = ['reborn', 'random'].includes(grSet.theme) && grSet.styleNighttime;

		const isDark = darkDesignPresets || darkThemes || darkCustomThemes ||
			styleBlackAndWhite2 || styleRebornBlack || styleRandomDark || styleNighttime;

		if (isDark === window.IsDark) return;

		fb.RunMainMenuCommand(`View/Mode/${isDark ? 'Dark' : 'Light'}`);
	}

	/**
	 * Applies the appropriate day or night theme based on current time.
	 * @param {Date} date - The current date/time.
	 * @returns {boolean} True if the day/night state actually changed.
	 */
	applyTimeBasedTheme(date) {
		const hours = date.getHours();
		const { startHour, endHour } = this.getTimeRange();
		const isDayTime = this.isDayTimeRange(hours, startHour, endHour);
		const newState = isDayTime ? 'day' : 'night';
		const stateChanged = grSet.themeDayNightTime !== newState;

		if (stateChanged) {
			grSet.themeDayNightTime = newState;
			this.setThemeDayNightTheme(isDayTime);
			this.applyFoobarTheme();
		}

		return stateChanged;
	}

	/**
	 * Normalizes legacy number or malformed string settings.
	 */
	normalizeTimeRangeSetting() {
		if (typeof grSet.themeDayNightSchedule === 'number') {
			grSet.themeDayNightSchedule = `${grSet.themeDayNightSchedule}-18`;
		}
		else if (typeof grSet.themeDayNightSchedule === 'string' && !grSet.themeDayNightSchedule.includes('-')) {
			grSet.themeDayNightSchedule = `${grSet.themeDayNightSchedule}-${grSet.themeDayNightSchedule}`;
		}
	}

	/**
	 * Restores correct day/night theme if external changes drifted it.
	 */
	restoreThemeDayNight() {
		// Don't restore if modern_day_night is handling it
		if (grSet.design === 'modern_day_night') return;

		const currentState = grSet.themeDayNightTime;
		const expectedTheme = currentState === 'day' ? grSet.theme_day : grSet.theme_night;

		if (grSet.theme === expectedTheme) return;

		grm.ui.resetTheme();
		this.applyTimeBasedTheme(new Date());
		grm.ui.initThemeFull = true;
	}

	/**
	 * Sets and updates the theme style to the daytime or nighttime theme when selecting a theme style in top menu Options > Style.
	 * Used when daytime or nighttime theme setup is active.
	 */
	setThemeDayNightStyle() {
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
	 * Sets the theme based on the time of day.
	 * Used to switch between day and night mode by applying the corresponding theme settings.
	 * @param {boolean} isDaytime - When true, the daytime theme is applied; otherwise, the nighttime theme is applied.
	 */
	setThemeDayNightTheme(isDaytime) {
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
	 * Starts the unified 10-minute timer for both features.
	 */
	startTimer() {
		this.stopTimer();

		this.timer = setInterval(() => {
			const now = new Date();

			// modern_day_night has priority
			if (grSet.design === 'modern_day_night') {
				const prevWhite = grSet.styleRebornWhite;
				this.initDesignPresetModernDynamic(now);

				if (prevWhite !== grSet.styleRebornWhite) {
					grm.ui.initThemeFull = true;
					grm.ui.initTheme();
					DebugLog('\n>>> ThemeDayNight: modern_day_night auto-switched (day <-> night) <<<\n');
				}
				return;
			}

			// General day/night mode
			if (!grSet.themeDayNightEnabled) return;

			const stateChanged = this.applyTimeBasedTheme(now);
			if (!stateChanged) return;

			grm.ui.initThemeFull = true;
			grm.ui.initTheme();
			DebugLog('\n>>> ThemeDayNight: Full theme auto-switched (day <-> night) <<<\n');
		}, 600000); // 10 minutes
	}

	/**
	 * Stops the timer if running.
	 */
	stopTimer() {
		if (!this.timer) return;
		clearInterval(this.timer);
		this.timer = null;
	}
	// #endregion

	// * PUBLIC METHODS - CONFLICT HANDLING * //
	// #region PUBLIC METHODS - CONFLICT HANDLING
	/**
	 * Resolves conflicts between competing day/night features.
	 * Called when switching between features to ensure clean state.
	 * @param {'general'|'modern_day_night'|'setup'} activeFeature - Which feature is being activated
	 */
	resolveConflicts(activeFeature = null) {
		if (activeFeature === 'modern_day_night') {
			// User activated modern_day_night preset
			if (grSet.themeDayNightEnabled) {
				grSet.themeDayNightEnabled = false;
			}
			if (grSet.themeSetupDay || grSet.themeSetupNight) {
				grSet.themeSetupDay = false;
				grSet.themeSetupNight = false;
			}
		}
		else if (activeFeature === 'general' || activeFeature === 'setup') {
			// User activated general day/night or setup modes
			if (grSet.design === 'modern_day_night') {
				grSet.design = 'custom';
				grm.ui.setDesign('custom');
			}

			// Setup mode disables general mode to prevent auto-switching while editing
			if (activeFeature === 'setup') {
				grSet.themeDayNightEnabled = false;
				this.stopTimer();
			}
		}
	}

	/**
	 * Shows conflict warning for style changes during modern_day_night.
	 * This is a more specific warning than the general conflict check.
	 * @param {Function} onContinue - Called with (shouldContinue: boolean).
	 */
	showStyleChangeWarning(onContinue) {
		if (grSet.design !== 'modern_day_night') {
			onContinue(true);
			return;
		}

		const msg = grm.msg.getMessage('menu', 'modernDayNightManualSwitch');
		grm.msg.showPopup(true, msg, msg, 'Yes', 'No', (confirmed) => {
			if (confirmed) {
				if (grSet.themeSetupDay || grSet.themeSetupNight) {
					grSet.themeSetupDay = false;
					grSet.themeSetupNight = false;
					grm.ui.themeNotification = '';
				}
				grSet.design = 'custom';
				this.stopTimer();
			}
			onContinue(confirmed);
		});
	}
	// #endregion

	// * PUBLIC METHODS - MENU * //
	// #region PUBLIC METHODS - MENU
	/**
	 * Formats a time range string for display.
	 * @param {string|null} timeRange - The time range like '6-18' or null.
	 * @returns {string} The formatted string like '06 AM (day) - 06 PM (night)'.
	 */
	formatTimeRangeString(timeRange) {
		if (!timeRange) return 'Deactivated (default)';

		let normalizedRange = timeRange;

		if (typeof timeRange === 'number') {
			normalizedRange = `${timeRange}-18`;
		} else if (typeof timeRange === 'string' && !timeRange.includes('-')) {
			normalizedRange = `${timeRange}-${timeRange}`;
		}

		if (typeof normalizedRange !== 'string') return 'Deactivated (default)';

		const [start, end] = normalizedRange.split('-').map(part => {
			let hour = parseInt(part, 10);
			const suffix = (hour >= 12 && hour < 24) ? ' PM' : ' AM';
			hour = (hour === 0 || hour === 12) ? 12 : hour % 12;
			return `${hour.toString().padStart(2, '0')}${suffix}`;
		});

		return `${start} (day) - ${end} (night)`;
	}

	/**
	 * Handles the day/night mode state from menu.
	 * @param {string} timeValue - The time range to set.
	 * @param {boolean} enabled - The flag to enable day/night mode.
	 */
	handleDayNightMode(timeValue, enabled) {
		if (enabled) {
			this.resolveConflicts('general');
		}

		grSet.themeDayNightSchedule = timeValue;
		grSet.themeDayNightEnabled = enabled;

		if (!grSet.themeDayNightEnabled) {
			this.stopTimer();
			return;
		}

		const msg = grm.msg.getMessage('menu', 'themeDayNightMode');
		const msgFb = grm.msg.getMessage('menu', 'themeDayNightMode', true);

		grm.msg.showPopup(true, msgFb, msg, 'Yes', 'No', (confirmed) => {
			if (confirmed) {
				if (grSet.design === 'modern_day_night') {
					grSet.design = 'custom';
				}
				grm.ui.resetTheme();
				this.normalizeTimeRangeSetting();
				this.applyTimeBasedTheme(new Date());
				grm.ui.initThemeFull = true;
				grm.ui.initCustomTheme();
				grm.ui.initTheme();
				grm.ui.initStyleState();
				grm.preset.initThemePresetState();
				this.startTimer();
			}
			else {
				grSet.themeDayNightEnabled = false;
				if (grSet.presetAutoRandomMode !== 'off') {
					grSet.presetAutoRandomMode = 'dblclick';
					grm.preset.getRandomThemePreset();
				}
			}
		});
	}

	/**
	 * Prompts the user to enter a custom day-night mode start and end times.
	 * @param {boolean} [modernDayNightPreset] - The optional flag if Modern day/night preset is being used.
	 */
	setDayNightCustomTimeRange(modernDayNightPreset = false) {
		const currentValue = grSet.themeDayNightSchedule || '6-18';
		this.inputBoxNewValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'themeDayNightCustomTimeRange');
			this.inputBoxNewValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', currentValue, true);

			if (!this.inputBoxNewValue) return;

			const match = this.inputBoxNewValue.match(Regex.TimeRange);
			if (!match) throw new Error('Invalid format');

			const startTime = Number(match[1]);
			const endTime = Number(match[2]);

			if (startTime < 0 || startTime > 23 || endTime < 0 || endTime > 24 ||
				startTime === endTime && !(startTime === 0 && endTime === 24)) {
				throw new Error('Invalid time');
			}

			// * Write to schedule setting to config
			grSet.themeDayNightSchedule = this.inputBoxNewValue;
			grCfg.themeSettings.themeDayNightSchedule = this.inputBoxNewValue;
			grCfg.config.updateConfigObjValues('themeSettings', true);

			if (modernDayNightPreset) {
				this.initDesignPresetModernDynamic(new Date());
				grm.ui.initThemeFull = true;
				grm.ui.initTheme();

				if (grSet.themeDayNightEnabled) {
					grSet.themeDayNightEnabled = false;
					this.stopTimer();
				}

				this.startTimer(); // Restart timer to pick up modern_day_night logic
				console.log(`Modern Day/Night schedule updated to: ${this.inputBoxNewValue}`);
			}
			else { // General day/night logic
				this.resolveConflicts('general');
				grSet.themeDayNightEnabled = true;

				// * Update UI
				grm.ui.resetTheme();
				this.normalizeTimeRangeSetting();
				this.applyTimeBasedTheme(new Date());
				grm.ui.initThemeFull = true;
				grm.ui.initCustomTheme();
				grm.ui.initTheme();
				grm.ui.initStyleState();
				grm.preset.initThemePresetState();
				this.initThemeDayNightMain();

				console.log(`Custom day/night time range set to: ${this.inputBoxNewValue}`);
			}
		}
		catch (e) {
			if (e.message === 'Invalid format' || e.message === 'Invalid time') {
				const msg = grm.msg.getMessage('inputBox', 'themeDayNightCustomTimeRangeError');
				fb.ShowPopupMessage(msg, 'Custom Day/Night Mode');
			}
		}
	}

	/**
	 * Toggles setup mode for day or night.
	 * @param {'day'|'night'} mode - The setup mode to toggle.
	 */
	startDayNightSetup(mode) {
		const isDay = mode === 'day';
		const setupKey = isDay ? 'themeSetupDay' : 'themeSetupNight';
		const otherKey = isDay ? 'themeSetupNight' : 'themeSetupDay';

		// Toggle the setup mode
		grSet[setupKey] = !grSet[setupKey];
		grSet[otherKey] = false;

		if (grSet[setupKey]) {
			this.resolveConflicts('setup');
			grm.msg.showPopupNotice('menu', setupKey);
			grm.ui.resetTheme();
			this.setThemeDayNightTheme(isDay);
			grm.ui.initThemeFull = true;
			grm.ui.initCustomTheme();
			grm.ui.initTheme();
			grm.ui.initStyleState();
			grm.preset.initThemePresetState();
		} else {
			grm.ui.themeNotification = '';
		}
		RepaintWindow();
	}
	// #endregion
}
