/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color System                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    02-05-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////
// * COLOR SYSTEM * //
//////////////////////
/**
 * A class that provides the Georgia-ReBORN Color System.
 * Implements WCAG 3.0 / APCA perceptual color science to manage theme generation,
 * contrast validation, and system-wide UI styling keyframes.
 */
class ColorSystem {
	/**
	 * Creates the `ColorSystem` instance.
	 * Initializes all keyframe tables for color adjustment, contrast validation, and UI element styling.
	 */
	constructor() {
		const {
			Y0, Y0_1, Y0_2, Y0_5, Y1_0, Y1_8,
			Y3_5, Y5_5, Y7_5, Y10,
			Y15, Y22, Y32, Y36_2, Y36_7, Y40,
			Y45, Y50, Y60, Y67,
			Y75, Y85, Y90, Y95, Y100
		} = LUM;

		// * COMMON SECTION * //
		// #region COMMON SECTION
		/**
		 * The accent keyframes for the primary accent.
		 * @private @type {Object}
		 */
		this.accentKeyframes = [
			// * VERY DARK ZONE * //
			{ lum: Y0,   value: 55 },
			{ lum: Y0_1, value: 56 },
			{ lum: Y0_2, value: 56 },
			{ lum: Y0_5, value: 57 },
			{ lum: Y1_0, value: 59 },
			{ lum: Y1_8, value: 61 },

			// * DARK ZONE * //
			{ lum: Y3_5, value: 63 },
			{ lum: Y5_5, value: 66 },
			{ lum: Y7_5, value: 68 },
			{ lum: Y10,  value: 70 },

			// * MID ZONE * //
			{ lum: Y15,  value: 72 },
			{ lum: Y22,  value: 75 },
			{ lum: Y32,  value: 78 },
			{ lum: Y40,  value: 80 },

			// * MID-BRIGHT ZONE * //
			{ lum: Y45,  value: 81 },
			{ lum: Y50,  value: 82 },
			{ lum: Y60,  value: 83 },
			{ lum: Y67,  value: 84 },

			// * VERY BRIGHT ZONE * //
			{ lum: Y75,  value:  95 },
			{ lum: Y85,  value: 100 },
			{ lum: Y90,  value: -12 },
			{ lum: Y95,  value: -10 },
			{ lum: Y100, value: -15 }
		];

		/**
		 * The button element keyframes for all interactive controls.
		 * Role strings: 'button.text', 'button.bg', 'button.icon'.
		 * @private @type {Object}
		 */
		this.buttonKeyframes = {
			text: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 77 },
				{ lum: Y0_1, value: 78 },
				{ lum: Y0_2, value: 79 },
				{ lum: Y0_5, value: 80 },
				{ lum: Y1_0, value: 81 },
				{ lum: Y1_8, value: 82 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 83 },
				{ lum: Y5_5, value: 84 },
				{ lum: Y7_5, value: 85 },
				{ lum: Y10,  value: 86 },

				// * MID ZONE * //
				{ lum: Y15,  value: 86 },
				{ lum: Y22,  value: 86 },
				{ lum: Y32,  value: 85 },
				{ lum: Y40,  value: 84 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 83 },
				{ lum: Y50,  value: 81 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 73 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -70 },
				{ lum: Y85,  value: -75 },
				{ lum: Y90,  value: -78 },
				{ lum: Y95,  value: -80 },
				{ lum: Y100, value: -83 }
			],

			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  25 },
				{ lum: Y0_1, value:  18 },
				{ lum: Y0_2, value:  12 },
				{ lum: Y0_5, value: -18 },
				{ lum: Y1_0, value: -14 },
				{ lum: Y1_8, value: -12 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -11 },
				{ lum: Y5_5, value: -11 },
				{ lum: Y7_5, value: -10 },
				{ lum: Y10,  value: -10 },

				// * MID ZONE * //
				{ lum: Y15,  value:  -9 },
				{ lum: Y22,  value:  -9 },
				{ lum: Y32,  value:  -8 },
				{ lum: Y40,  value:  -8 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  -9 },
				{ lum: Y50,  value:  -9 },
				{ lum: Y60,  value:  -8 },
				{ lum: Y67,  value:  -8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  -5 },
				{ lum: Y85,  value:  -5 },
				{ lum: Y90,  value:  -4 },
				{ lum: Y95,  value:  -4 },
				{ lum: Y100, value:  -3 }
			],

			icon: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 76 },
				{ lum: Y0_1, value: 77 },
				{ lum: Y0_2, value: 78 },
				{ lum: Y0_5, value: 79 },
				{ lum: Y1_0, value: 80 },
				{ lum: Y1_8, value: 81 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 82 },
				{ lum: Y5_5, value: 83 },
				{ lum: Y7_5, value: 84 },
				{ lum: Y10,  value: 85 },

				// * MID ZONE * //
				{ lum: Y15,  value: 85 },
				{ lum: Y22,  value: 85 },
				{ lum: Y32,  value: 84 },
				{ lum: Y40,  value: 83 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 82 },
				{ lum: Y50,  value: 80 },
				{ lum: Y60,  value: 77 },
				{ lum: Y67,  value: 72 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -68 },
				{ lum: Y85,  value: -73 },
				{ lum: Y90,  value: -76 },
				{ lum: Y95,  value: -78 },
				{ lum: Y100, value: -81 }
			]
		};

		/**
		 * The scrollbar element keyframes for all panels and lists.
		 * Role strings: 'scrollbar.button', 'scrollbar.buttonHovered', 'scrollbar.thumb', 'scrollbar.thumbHovered'.
		 * @private @type {Object}
		 */
		this.scrollbarKeyframes = {
			/**
			 * The scrollbar arrow buttons state.
			 */
			button: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 62 },
				{ lum: Y0_1, value: 63 },
				{ lum: Y0_2, value: 64 },
				{ lum: Y0_5, value: 65 },
				{ lum: Y1_0, value: 66 },
				{ lum: Y1_8, value: 67 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 68 },
				{ lum: Y5_5, value: 69 },
				{ lum: Y7_5, value: 70 },
				{ lum: Y10,  value: 71 },

				// * MID ZONE * //
				{ lum: Y15,  value: 71 },
				{ lum: Y22,  value: 71 },
				{ lum: Y32,  value: 70 },
				{ lum: Y40,  value: 69 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 68 },
				{ lum: Y50,  value: 66 },
				{ lum: Y60,  value: 66 },
				{ lum: Y67,  value: 65 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -60 },
				{ lum: Y85,  value: -65 },
				{ lum: Y90,  value: -68 },
				{ lum: Y95,  value: -70 },
				{ lum: Y100, value: -73 }
			],

			/**
			 * The scrollbar arrow buttons hovered state.
			 */
			buttonHovered: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 100 },
				{ lum: Y0_1, value: 100 },
				{ lum: Y0_2, value: 100 },
				{ lum: Y0_5, value: 100 },
				{ lum: Y1_0, value: 100 },
				{ lum: Y1_8, value: 100 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 100 },
				{ lum: Y5_5, value: 100 },
				{ lum: Y7_5, value: 100 },
				{ lum: Y10,  value: 100 },

				// * MID ZONE * //
				{ lum: Y15,  value: 100 },
				{ lum: Y22,  value: 100 },
				{ lum: Y32,  value: 100 },
				{ lum: Y40,  value: 100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 100 },
				{ lum: Y50,  value: 100 },
				{ lum: Y60,  value: 100 },
				{ lum: Y67,  value: 100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -100 },
				{ lum: Y85,  value: -100 },
				{ lum: Y90,  value: -100 },
				{ lum: Y95,  value: -100 },
				{ lum: Y100, value: -100 }
			],

			/**
			 * The scrollbar thumb normal state.
			 */
			thumb: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 20 },
				{ lum: Y0_1, value: 15 },
				{ lum: Y0_2, value: 14 },
				{ lum: Y0_5, value: 14 },
				{ lum: Y1_0, value: 13 },
				{ lum: Y1_8, value: 13 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 14 },
				{ lum: Y5_5, value: 14 },
				{ lum: Y7_5, value: 14 },
				{ lum: Y10,  value: 15 },

				// * MID ZONE * //
				{ lum: Y15,  value: 15 },
				{ lum: Y22,  value: 15 },
				{ lum: Y32,  value: 16 },
				{ lum: Y40,  value: 16 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 16 },
				{ lum: Y50,  value: 17 },
				{ lum: Y60,  value: 16 },
				{ lum: Y67,  value: 15 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: 55 },
				{ lum: Y85,  value: 65 },
				{ lum: Y90,  value: -6 },
				{ lum: Y95,  value: -5 },
				{ lum: Y100, value: -4 }
			],

			/**
			 * The scrollbar thumb hover state.
			 */
			thumbHovered: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 50 },
				{ lum: Y0_1, value: 51 },
				{ lum: Y0_2, value: 51 },
				{ lum: Y0_5, value: 52 },
				{ lum: Y1_0, value: 54 },
				{ lum: Y1_8, value: 56 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 58 },
				{ lum: Y5_5, value: 61 },
				{ lum: Y7_5, value: 63 },
				{ lum: Y10,  value: 65 },

				// * MID ZONE * //
				{ lum: Y15,  value: 67 },
				{ lum: Y22,  value: 70 },
				{ lum: Y32,  value: 73 },
				{ lum: Y40,  value: 75 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 76 },
				{ lum: Y50,  value: 77 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 79 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  95 },
				{ lum: Y85,  value: 100 },
				{ lum: Y90,  value: -17 },
				{ lum: Y95,  value: -15 },
				{ lum: Y100, value: -20 }
			]
		};

		/**
		 * The text element keyframes for all readable content.
		 * Role strings: 'text.normal', 'text.muted', 'text.active', 'text.heading'.
		 * @private @type {Object}
		 */
		this.textKeyframes = {
			/**
			 * The primary body text - playlist rows, library items, biography content.
			 */
			primary: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 80 },
				{ lum: Y0_1, value: 80 },
				{ lum: Y0_2, value: 81 },
				{ lum: Y0_5, value: 82 },
				{ lum: Y1_0, value: 83 },
				{ lum: Y1_8, value: 84 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 85 },
				{ lum: Y5_5, value: 86 },
				{ lum: Y7_5, value: 87 },
				{ lum: Y10,  value: 88 },

				// * MID ZONE * //
				{ lum: Y15,  value: 88 },
				{ lum: Y22,  value: 88 },
				{ lum: Y32,  value: 87 },
				{ lum: Y40,  value: 86 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 85 },
				{ lum: Y50,  value: 83 },
				{ lum: Y60,  value: 80 },
				{ lum: Y67,  value: 75 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -55 },
				{ lum: Y85,  value: -60 },
				{ lum: Y90,  value: -63 },
				{ lum: Y95,  value: -65 },
				{ lum: Y100, value: -68 }
			],

			/**
			 * The secondary/subdued text - info, dates, metadata, counts.
			 */
			secondary: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 75 },
				{ lum: Y0_1, value: 76 },
				{ lum: Y0_2, value: 77 },
				{ lum: Y0_5, value: 78 },
				{ lum: Y1_0, value: 79 },
				{ lum: Y1_8, value: 80 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 81 },
				{ lum: Y5_5, value: 82 },
				{ lum: Y7_5, value: 83 },
				{ lum: Y10,  value: 84 },

				// * MID ZONE * //
				{ lum: Y15,  value: 84 },
				{ lum: Y22,  value: 84 },
				{ lum: Y32,  value: 83 },
				{ lum: Y40,  value: 82 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 81 },
				{ lum: Y50,  value: 79 },
				{ lum: Y60,  value: 76 },
				{ lum: Y67,  value: 72 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -65 },
				{ lum: Y85,  value: -70 },
				{ lum: Y90,  value: -73 },
				{ lum: Y95,  value: -75 },
				{ lum: Y100, value: -78 }
			],

			/**
			 * The emphasis/playing text - highlighted items, active state.
			 */
			emphasis: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 95 },
				{ lum: Y0_1, value: 95 },
				{ lum: Y0_2, value: 96 },
				{ lum: Y0_5, value: 96 },
				{ lum: Y1_0, value: 97 },
				{ lum: Y1_8, value: 98 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  99 },
				{ lum: Y5_5, value: 100 },
				{ lum: Y7_5, value: 100 },
				{ lum: Y10,  value: 100 },

				// * MID ZONE * //
				{ lum: Y15,  value: 100 },
				{ lum: Y22,  value: 100 },
				{ lum: Y32,  value: 100 },
				{ lum: Y40,  value: 100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 100 },
				{ lum: Y50,  value: 100 },
				{ lum: Y60,  value:  98 },
				{ lum: Y67,  value:  95 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  -90 },
				{ lum: Y85,  value:  -95 },
				{ lum: Y90,  value:  -98 },
				{ lum: Y95,  value: -100 },
				{ lum: Y100, value: -100 }
			],

			/**
			 * The heading text - section headers, artist names, album titles.
			 */
			heading: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 78 },
				{ lum: Y0_1, value: 79 },
				{ lum: Y0_2, value: 80 },
				{ lum: Y0_5, value: 81 },
				{ lum: Y1_0, value: 82 },
				{ lum: Y1_8, value: 83 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 84 },
				{ lum: Y5_5, value: 85 },
				{ lum: Y7_5, value: 86 },
				{ lum: Y10,  value: 87 },

				// * MID ZONE * //
				{ lum: Y15,  value: 87 },
				{ lum: Y22,  value: 87 },
				{ lum: Y32,  value: 86 },
				{ lum: Y40,  value: 85 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 84 },
				{ lum: Y50,  value: 82 },
				{ lum: Y60,  value: 79 },
				{ lum: Y67,  value: 74 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -68 },
				{ lum: Y85,  value: -73 },
				{ lum: Y90,  value: -76 },
				{ lum: Y95,  value: -78 },
				{ lum: Y100, value: -81 }
			]
		};
		// #endregion

		// * SHARED PANEL ELEMENTS * //
		// #region SHARED PANEL ELEMENTS
		/**
		 * The line divider keyframes for visual separators.
		 * Role strings: 'line.normal', 'line.playing'.
		 * @private @type {Object}
		 */
		this.lineKeyframes = {
			/**
			 * The normal line dividers state.
			 */
			normal: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  28 },
				{ lum: Y0_1, value:  14 },
				{ lum: Y0_2, value:  12 },
				{ lum: Y0_5, value: -45 },
				{ lum: Y1_0, value: -40 },
				{ lum: Y1_8, value: -35 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -20 },
				{ lum: Y5_5, value: -18 },
				{ lum: Y7_5, value: -18 },
				{ lum: Y10,  value: -18 },

				// * MID ZONE * //
				{ lum: Y15,  value: -19 },
				{ lum: Y22,  value: -20 },
				{ lum: Y32,  value: -20 },
				{ lum: Y40,  value: -20 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -20 },
				{ lum: Y50,  value: -20 },
				{ lum: Y60,  value: -20 },
				{ lum: Y67,  value: -19 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -15 },
				{ lum: Y85,  value: -14 },
				{ lum: Y90,  value: -13 },
				{ lum: Y95,  value: -12 },
				{ lum: Y100, value: -10 }
			],

			/**
			 * The playing line dividers state.
			 */
			playing: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  30 },
				{ lum: Y0_1, value:  20 },
				{ lum: Y0_2, value:  15 },
				{ lum: Y0_5, value: -40 },
				{ lum: Y1_0, value: -35 },
				{ lum: Y1_8, value: -35 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -18 },
				{ lum: Y5_5, value: -20 },
				{ lum: Y7_5, value: -22 },
				{ lum: Y10,  value: -23 },

				// * MID ZONE * //
				{ lum: Y15,  value: -24 },
				{ lum: Y22,  value: -25 },
				{ lum: Y32,  value: -25 },
				{ lum: Y40,  value: -25 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -25 },
				{ lum: Y50,  value: -25 },
				{ lum: Y60,  value: -24 },
				{ lum: Y67,  value: -24 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -22 },
				{ lum: Y85,  value: -20 },
				{ lum: Y90,  value: -19 },
				{ lum: Y95,  value: -18 },
				{ lum: Y100, value: -17 }
			]
		};

		/**
		 * The now-playing background keyframes.
		 * Role string: 'nowplaying'.
		 * Used by: Playlist, Library and other now-playing areas.
		 * @private @type {Object}
		 */
		this.nowPlayingKeyframes = {
			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 20, blendAlpha: 115 },
				{ lum: Y0_1, value:  5, blendAlpha: 112 },
				{ lum: Y0_2, value:  9, blendAlpha: 108 },
				{ lum: Y0_5, value:  9, blendAlpha: 100 },
				{ lum: Y1_0, value:  8, blendAlpha: 92 },
				{ lum: Y1_8, value:  8, blendAlpha: 85 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  9, blendAlpha: 78 },
				{ lum: Y5_5, value:  9, blendAlpha: 74 },
				{ lum: Y7_5, value:  9, blendAlpha: 72 },
				{ lum: Y10,  value: 10, blendAlpha: 70 },

				// * MID ZONE * //
				{ lum: Y15,  value: 10, blendAlpha: 70 },
				{ lum: Y22,  value: 10, blendAlpha: 70 },
				{ lum: Y32,  value: 11, blendAlpha: 70 },
				{ lum: Y40,  value: 11, blendAlpha: 72 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 11, blendAlpha: 78 },
				{ lum: Y50,  value: 12, blendAlpha: 85 },
				{ lum: Y60,  value: 15, blendAlpha: 95 },
				{ lum: Y67,  value: 17, blendAlpha: 102 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: 25, blendAlpha: 108 },
				{ lum: Y85,  value: 30, blendAlpha: 112 },
				{ lum: Y90,  value: -6, blendAlpha: 115 },
				{ lum: Y95,  value: -5, blendAlpha: 115 },
				{ lum: Y100, value: -4, blendAlpha: 115 }
			]
		};

		/**
		 * The row element keyframes for list backgrounds.
		 * Role strings: 'row.stripes', 'row.selection'.
		 * @private @type {Object}
		 */
		this.rowKeyframes = {
			/**
			 * The row stripe background.
			 */
			stripes: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 10 },
				{ lum: Y0_1, value:  8 },
				{ lum: Y0_2, value:  6 },
				{ lum: Y0_5, value:  5 },
				{ lum: Y1_0, value:  4 },
				{ lum: Y1_8, value:  3 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  3 },
				{ lum: Y5_5, value:  3 },
				{ lum: Y7_5, value:  3 },
				{ lum: Y10,  value:  3 },

				// * MID ZONE * //
				{ lum: Y15,  value:  3 },
				{ lum: Y22,  value:  3 },
				{ lum: Y32,  value:  3 },
				{ lum: Y40,  value:  3 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  3 },
				{ lum: Y50,  value:  3 },
				{ lum: Y60,  value:  3 },
				{ lum: Y67,  value:  3 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  3 },
				{ lum: Y85,  value:  3 },
				{ lum: Y90,  value: -3 },
				{ lum: Y95,  value: -3 },
				{ lum: Y100, value: -3 }
			],

			/**
			 * The row selection background.
			 */
			selectionBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  20 },
				{ lum: Y0_1, value:  16 },
				{ lum: Y0_2, value:  14 },
				{ lum: Y0_5, value: -15 },
				{ lum: Y1_0, value: -12 },
				{ lum: Y1_8, value: -10 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  -9 },
				{ lum: Y5_5, value:  -9 },
				{ lum: Y7_5, value:  -8 },
				{ lum: Y10,  value:  -8 },

				// * MID ZONE * //
				{ lum: Y15,  value:  -8 },
				{ lum: Y22,  value:  -8 },
				{ lum: Y32,  value:  -7 },
				{ lum: Y40,  value:  -7 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  -8 },
				{ lum: Y50,  value:  -8 },
				{ lum: Y60,  value:  -7 },
				{ lum: Y67,  value:  -7 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  -5 },
				{ lum: Y85,  value:  -5 },
				{ lum: Y90,  value:  -4 },
				{ lum: Y95,  value:  -4 },
				{ lum: Y100, value:  -3 }
			]
		};

		/**
		 * The shadow overlay keyframes organized by shadow type.
		 * Role strings: 'shadow.panel', 'shadow.discArt', 'shadow.fill'.
		 * @private @type {Object}
		 */
		this.shadowKeyframes = {
			/**
			 * The panel shadows - used for drop shadows on UI panels and elements.
			 * Role string: 'shadow.panel'.
			 * Used by: Main background, panels, buttons.
			 */
			panel: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: -255, alt: -255 },
				{ lum: Y0_1, base: -255, alt: -255 },
				{ lum: Y0_2, base: -255, alt: -255 },
				{ lum: Y0_5, base: -200, alt: -210 },
				{ lum: Y1_0, base: -100, alt: -160 },
				{ lum: Y1_8, base:  -50, alt: -110 },

				// * DARK ZONE * //
				{ lum: Y3_5, base:  -80, alt:  -85 },
				{ lum: Y5_5, base:  -70, alt:  -75 },
				{ lum: Y7_5, base:  -60, alt:  -65 },
				{ lum: Y10,  base:  -50, alt:  -55 },
				{ lum: Y15,  base:  -40, alt:  -45 },

				// * MID ZONE * //
				{ lum: Y22,  base:  -35, alt:  -40 },
				{ lum: Y32,  base:  -30, alt:  -35 },
				{ lum: Y40,  base:  -30, alt:  -35 },
				{ lum: Y45,  base:  -30, alt:  -35 },
				{ lum: Y50,  base:  -35, alt:  -40 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base:  -35, alt:  -40 },
				{ lum: Y67,  base:  -33, alt:  -38 },
				{ lum: Y75,  base:  -33, alt:  -38 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base:  -32, alt:  -37 },
				{ lum: Y90,  base:  -32, alt:  -37 },
				{ lum: Y95,  base:  -30, alt:  -35 },
				{ lum: Y100, base:  -30, alt:  -35 }
			],

			/**
			 * The disc art shadows - specialized shadow for rotating disc art.
			 * Role string: 'shadow.discArt'.
			 * Used by: Disc art visualization.
			 */
			discArt: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: -255, alt: -255 },
				{ lum: Y0_1, base: -255, alt: -255 },
				{ lum: Y0_2, base: -255, alt: -255 },
				{ lum: Y0_5, base: -200, alt: -210 },
				{ lum: Y1_0, base: -150, alt: -160 },
				{ lum: Y1_8, base: -100, alt: -110 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: -80, alt: -85 },
				{ lum: Y5_5, base: -70, alt: -75 },
				{ lum: Y7_5, base: -60, alt: -65 },
				{ lum: Y10,  base: -50, alt: -55 },
				{ lum: Y15,  base: -40, alt: -45 },

				// * MID ZONE * //
				{ lum: Y22,  base: -35, alt: -40 },
				{ lum: Y32,  base: -30, alt: -35 },
				{ lum: Y40,  base: -30, alt: -35 },
				{ lum: Y45,  base: -30, alt: -35 },
				{ lum: Y50,  base: -35, alt: -40 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: -35, alt: -40 },
				{ lum: Y67,  base: -33, alt: -38 },
				{ lum: Y75,  base: -33, alt: -38 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: -32, alt: -37 },
				{ lum: Y90,  base: -32, alt: -37 },
				{ lum: Y95,  base: -30, alt: -35 },
				{ lum: Y100, base: -0,  alt: -35 }
			],

			/**
			 * The fill shadows - used for progress/volume bar fills.
			 * Role string: 'shadow.fill'.
			 * Used by: Progress bar fill, volume bar fill, peakmeter fills.
			 */
			fill: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 85, bevel: 90 },
				{ lum: Y0_1, base: 83, bevel: 88 },
				{ lum: Y0_2, base: 82, bevel: 86 },
				{ lum: Y0_5, base: 80, bevel: 85 },
				{ lum: Y1_0, base: 75, bevel: 80 },
				{ lum: Y1_8, base: 70, bevel: 75 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 65, bevel: 70 },
				{ lum: Y5_5, base: 62, bevel: 67 },
				{ lum: Y7_5, base: 60, bevel: 65 },
				{ lum: Y10,  base: 56, bevel: 61 },
				{ lum: Y15,  base: 53, bevel: 58 },

				// * MID ZONE * //
				{ lum: Y22,  base: 50, bevel: 55 },
				{ lum: Y32,  base: 45, bevel: 50 },
				{ lum: Y40,  base: 40, bevel: 45 },
				{ lum: Y45,  base: 37, bevel: 42 },
				{ lum: Y50,  base: 35, bevel: 40 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 33, bevel: 38 },
				{ lum: Y67,  base: 30, bevel: 35 },
				{ lum: Y75,  base: 27, bevel: 32 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 24, bevel: 29 },
				{ lum: Y90,  base: 23, bevel: 28 },
				{ lum: Y95,  base: 22, bevel: 27 },
				{ lum: Y100, base: 20, bevel: 25 }
			]
		};

		/**
		 * The sidemarker keyframes for selected or highlighted elements.
		 * Role string: 'sidemarker'.
		 * @private @type {Object}
		 */
		this.sidemarkerKeyframes = [
			// * VERY DARK ZONE * //
			{ lum: Y0,   value: 55 },
			{ lum: Y0_1, value: 56 },
			{ lum: Y0_2, value: 56 },
			{ lum: Y0_5, value: 57 },
			{ lum: Y1_0, value: 59 },
			{ lum: Y1_8, value: 61 },

			// * DARK ZONE * //
			{ lum: Y3_5, value: 63 },
			{ lum: Y5_5, value: 66 },
			{ lum: Y7_5, value: 68 },
			{ lum: Y10,  value: 70 },

			// * MID ZONE * //
			{ lum: Y15,  value: 72 },
			{ lum: Y22,  value: 75 },
			{ lum: Y32,  value: 78 },
			{ lum: Y40,  value: 80 },

			// * MID-BRIGHT ZONE * //
			{ lum: Y45,  value: 82 },
			{ lum: Y50,  value: 84 },
			{ lum: Y60,  value: 88 },
			{ lum: Y67,  value: 92 },

			// * VERY BRIGHT ZONE * //
			{ lum: Y75,  value:  95 },
			{ lum: Y85,  value: 100 },
			{ lum: Y90,  value: -15 },
			{ lum: Y95,  value: -16 },
			{ lum: Y100, value: -18 }
		];
		// #endregion

		// * PANEL-SPECIFIC ELEMENTS * //
		// #region PANEL-SPECIFIC ELEMENTS
		/**
		 * The no-photo stub element keyframes.
		 * Role strings: 'noPhotoStub.bg', 'noPhotoStub.text'.
		 * @private @type {Object}
		 */
		this.noPhotoStubKeyframes = {
			/**
			 * The no photo stub background.
			 */
			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 10 },
				{ lum: Y0_1, value:  8 },
				{ lum: Y0_2, value:  6 },
				{ lum: Y0_5, value:  5 },
				{ lum: Y1_0, value:  4 },
				{ lum: Y1_8, value:  3 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  3 },
				{ lum: Y5_5, value:  3 },
				{ lum: Y7_5, value:  3 },
				{ lum: Y10,  value:  3 },

				// * MID ZONE * //
				{ lum: Y15,  value:  3 },
				{ lum: Y22,  value:  3 },
				{ lum: Y32,  value:  3 },
				{ lum: Y40,  value:  3 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  3 },
				{ lum: Y50,  value:  3 },
				{ lum: Y60,  value:  3 },
				{ lum: Y67,  value:  3 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  3 },
				{ lum: Y85,  value:  3 },
				{ lum: Y90,  value: -3 },
				{ lum: Y95,  value: -3 },
				{ lum: Y100, value: -3 }
			],

			/**
			 * The no photo stub text.
			 */
			text: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 78 },
				{ lum: Y0_1, value: 79 },
				{ lum: Y0_2, value: 80 },
				{ lum: Y0_5, value: 81 },
				{ lum: Y1_0, value: 82 },
				{ lum: Y1_8, value: 83 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 84 },
				{ lum: Y5_5, value: 85 },
				{ lum: Y7_5, value: 86 },
				{ lum: Y10,  value: 87 },

				// * MID ZONE * //
				{ lum: Y15,  value: 87 },
				{ lum: Y22,  value: 87 },
				{ lum: Y32,  value: 86 },
				{ lum: Y40,  value: 85 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 84 },
				{ lum: Y50,  value: 82 },
				{ lum: Y60,  value: 79 },
				{ lum: Y67,  value: 74 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -68 },
				{ lum: Y85,  value: -73 },
				{ lum: Y90,  value: -76 },
				{ lum: Y95,  value: -78 },
				{ lum: Y100, value: -81 }
			]
		};

		/**
		 * The library tree node keyframes.
		 * Role strings: 'node.plus', 'node.plusBg', 'node.minus'.
		 * @private @type {Object}
		 */
		this.nodeKeyframes = {
			/**
			 * The tree node plus icon.
			 */
			plus: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 75 },
				{ lum: Y0_1, value: 76 },
				{ lum: Y0_2, value: 77 },
				{ lum: Y0_5, value: 78 },
				{ lum: Y1_0, value: 79 },
				{ lum: Y1_8, value: 80 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 81 },
				{ lum: Y5_5, value: 82 },
				{ lum: Y7_5, value: 83 },
				{ lum: Y10,  value: 84 },

				// * MID ZONE * //
				{ lum: Y15,  value: 84 },
				{ lum: Y22,  value: 84 },
				{ lum: Y32,  value: 83 },
				{ lum: Y40,  value: 82 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 81 },
				{ lum: Y50,  value: 79 },
				{ lum: Y60,  value: 76 },
				{ lum: Y67,  value: 72 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -65 },
				{ lum: Y85,  value: -70 },
				{ lum: Y90,  value: -73 },
				{ lum: Y95,  value: -75 },
				{ lum: Y100, value: -78 }
			],

			/**
			 * The tree node plus icon background.
			 */
			plusBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 10 },
				{ lum: Y0_1, value:  8 },
				{ lum: Y0_2, value:  6 },
				{ lum: Y0_5, value:  5 },
				{ lum: Y1_0, value:  4 },
				{ lum: Y1_8, value:  3 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  3 },
				{ lum: Y5_5, value:  3 },
				{ lum: Y7_5, value:  3 },
				{ lum: Y10,  value:  3 },

				// * MID ZONE * //
				{ lum: Y15,  value:  3 },
				{ lum: Y22,  value:  3 },
				{ lum: Y32,  value:  3 },
				{ lum: Y40,  value:  3 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  3 },
				{ lum: Y50,  value:  3 },
				{ lum: Y60,  value:  3 },
				{ lum: Y67,  value:  3 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  3 },
				{ lum: Y85,  value:  3 },
				{ lum: Y90,  value: -3 },
				{ lum: Y95,  value: -3 },
				{ lum: Y100, value: -3 }
			],

			/**
			 * The tree node minus icon.
			 */
			minus: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 75 },
				{ lum: Y0_1, value: 76 },
				{ lum: Y0_2, value: 77 },
				{ lum: Y0_5, value: 78 },
				{ lum: Y1_0, value: 79 },
				{ lum: Y1_8, value: 80 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 81 },
				{ lum: Y5_5, value: 82 },
				{ lum: Y7_5, value: 83 },
				{ lum: Y10,  value: 84 },

				// * MID ZONE * //
				{ lum: Y15,  value: 84 },
				{ lum: Y22,  value: 84 },
				{ lum: Y32,  value: 83 },
				{ lum: Y40,  value: 82 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 81 },
				{ lum: Y50,  value: 79 },
				{ lum: Y60,  value: 76 },
				{ lum: Y67,  value: 72 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -65 },
				{ lum: Y85,  value: -70 },
				{ lum: Y90,  value: -73 },
				{ lum: Y95,  value: -75 },
				{ lum: Y100, value: -78 }
			]
		};
		// #endregion

		// * MAIN COMPONENTS * //
		// #region MAIN COMPONENTS
		/**
		 * The complete menu button keyframes - all menu elements and style overlays.
		 * Role strings: 'menu.bg', 'menu.rect', 'menu.text' and style overlays.
		 * @private @type {Object}
		 */
		this.menuKeyframes = {
			/**
			 * The menu button background container.
			 */
			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  35 },
				{ lum: Y0_1, value:  26 },
				{ lum: Y0_2, value:  24 },
				{ lum: Y0_5, value:  22 },
				{ lum: Y1_0, value:  20 },
				{ lum: Y1_8, value:  18 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  20 },
				{ lum: Y5_5, value:  18 },
				{ lum: Y7_5, value:  16 },
				{ lum: Y10,  value:  15 },

				// * MID ZONE * //
				{ lum: Y15,  value:  15 },
				{ lum: Y22,  value:  16 },
				{ lum: Y32,  value:  16 },
				{ lum: Y40,  value:  18 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  20 },
				{ lum: Y50,  value:  22 },
				{ lum: Y60,  value:  24 },
				{ lum: Y67,  value:  26 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  28 },
				{ lum: Y85,  value:  30 },
				{ lum: Y90,  value:  -2 },
				{ lum: Y95,  value:  -4 },
				{ lum: Y100, value:  -6 }
			],

			/**
			 * The menu button background container.
			 */
			styleBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 70,  bevel: 84,  inner: 96,  emboss: 30 },
				{ lum: Y0_1, base: 68,  bevel: 82,  inner: 94,  emboss: 29 },
				{ lum: Y0_2, base: 66,  bevel: 79,  inner: 91,  emboss: 28 },
				{ lum: Y0_5, base: 64,  bevel: 77,  inner: 89,  emboss: 27 },
				{ lum: Y1_0, base: 60,  bevel: 72,  inner: 84,  emboss: 25 },
				{ lum: Y1_8, base: 56,  bevel: 67,  inner: 79,  emboss: 23 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 52,  bevel: 62,  inner: 74,  emboss: 21 },
				{ lum: Y5_5, base: 50,  bevel: 60,  inner: 72,  emboss: 20 },
				{ lum: Y7_5, base: 48,  bevel: 58,  inner: 70,  emboss: 19 },
				{ lum: Y10,  base: 46,  bevel: 55,  inner: 67,  emboss: 18 },

				// * MID ZONE * //
				{ lum: Y15,  base: 44,  bevel: 53,  inner: 65,  emboss: 17 },
				{ lum: Y22,  base: 42,  bevel: 50,  inner: 62,  emboss: 16 },
				{ lum: Y32,  base: 40,  bevel: 48,  inner: 60,  emboss: 15 },
				{ lum: Y40,  base: 38,  bevel: 46,  inner: 58,  emboss: 14 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  base: 37,  bevel: 44,  inner: 56,  emboss: 14 },
				{ lum: Y50,  base: 36,  bevel: 43,  inner: 55,  emboss: 13 },
				{ lum: Y60,  base: 35,  bevel: 42,  inner: 54,  emboss: 13 },
				{ lum: Y67,  base: 34,  bevel: 41,  inner: 53,  emboss: 12 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  base: 32,  bevel: 38,  inner: 50,  emboss: 11 },
				{ lum: Y85,  base: 30,  bevel: 36,  inner: 48,  emboss: 10 },
				{ lum: Y90,  base: 29,  bevel: 35,  inner: 47,  emboss: 10 },
				{ lum: Y95,  base: 28,  bevel: 34,  inner: 46,  emboss:  9 },
				{ lum: Y100, base: 27,  bevel: 32,  inner: 44,  emboss:  9 }
			],

			/**
			 * The unified menu background alpha overlay.
			 * Replaces former styleBgBevel + styleBgEmboss.
			 * Role string: 'menu.overlayBg'.
			 * Columns: base=no-style | bevel=bevel/inner | inner=blend | emboss=emboss
			 * bevel/inner both use former styleBgBevel.alt values.
			 * emboss uses former styleBgEmboss.alt values.
			 */
			overlayBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 0, bevel: 80, inner: 80, emboss: 40 },
				{ lum: Y0_1, base: 0, bevel: 78, inner: 78, emboss: 39 },
				{ lum: Y0_2, base: 0, bevel: 76, inner: 76, emboss: 38 },
				{ lum: Y0_5, base: 0, bevel: 74, inner: 74, emboss: 37 },
				{ lum: Y1_0, base: 0, bevel: 70, inner: 70, emboss: 35 },
				{ lum: Y1_8, base: 0, bevel: 66, inner: 66, emboss: 33 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 0, bevel: 62, inner: 62, emboss: 31 },
				{ lum: Y5_5, base: 0, bevel: 60, inner: 60, emboss: 30 },
				{ lum: Y7_5, base: 0, bevel: 58, inner: 58, emboss: 29 },
				{ lum: Y10,  base: 0, bevel: 56, inner: 56, emboss: 28 },
				{ lum: Y15,  base: 0, bevel: 54, inner: 54, emboss: 27 },

				// * MID ZONE * //
				{ lum: Y22,  base: 0, bevel: 52, inner: 52, emboss: 26 },
				{ lum: Y32,  base: 0, bevel: 50, inner: 50, emboss: 25 },
				{ lum: Y40,  base: 0, bevel: 48, inner: 48, emboss: 24 },
				{ lum: Y45,  base: 0, bevel: 47, inner: 47, emboss: 24 },
				{ lum: Y50,  base: 0, bevel: 46, inner: 46, emboss: 23 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 0, bevel: 45, inner: 45, emboss: 23 },
				{ lum: Y67,  base: 0, bevel: 44, inner: 44, emboss: 22 },
				{ lum: Y75,  base: 0, bevel: 42, inner: 42, emboss: 21 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 0, bevel: 40, inner: 40, emboss: 20 },
				{ lum: Y90,  base: 0, bevel: 39, inner: 39, emboss: 20 },
				{ lum: Y95,  base: 0, bevel: 38, inner: 38, emboss: 19 },
				{ lum: Y100, base: 0, bevel: 37, inner: 37, emboss: 19 }
			],

			/**
			 * The unified menu rect alpha overlay.
			 * Replaces former styleRectBevel.
			 * Role string: 'menu.overlayRect'.
			 * Columns: base=no-style | bevel=bevel normal | inner=blend normal | hovered=any hovered state
			 * bevel/inner use former styleRectBevel.base values.
			 * hovered uses former styleRectBevel.hovered values.
			 */
			overlayRect: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 0, bevel: 40, inner: 40, hovered: 30 },
				{ lum: Y0_1, base: 0, bevel: 39, inner: 39, hovered: 29 },
				{ lum: Y0_2, base: 0, bevel: 38, inner: 38, hovered: 28 },
				{ lum: Y0_5, base: 0, bevel: 37, inner: 37, hovered: 27 },
				{ lum: Y1_0, base: 0, bevel: 35, inner: 35, hovered: 25 },
				{ lum: Y1_8, base: 0, bevel: 33, inner: 33, hovered: 23 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 0, bevel: 31, inner: 31, hovered: 21 },
				{ lum: Y5_5, base: 0, bevel: 30, inner: 30, hovered: 20 },
				{ lum: Y7_5, base: 0, bevel: 29, inner: 29, hovered: 19 },
				{ lum: Y10,  base: 0, bevel: 28, inner: 28, hovered: 18 },
				{ lum: Y15,  base: 0, bevel: 27, inner: 27, hovered: 17 },

				// * MID ZONE * //
				{ lum: Y22,  base: 0, bevel: 26, inner: 26, hovered: 16 },
				{ lum: Y32,  base: 0, bevel: 25, inner: 25, hovered: 15 },
				{ lum: Y40,  base: 0, bevel: 24, inner: 24, hovered: 14 },
				{ lum: Y45,  base: 0, bevel: 24, inner: 24, hovered: 14 },
				{ lum: Y50,  base: 0, bevel: 23, inner: 23, hovered: 13 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 0, bevel: 23, inner: 23, hovered: 13 },
				{ lum: Y67,  base: 0, bevel: 22, inner: 22, hovered: 12 },
				{ lum: Y75,  base: 0, bevel: 21, inner: 21, hovered: 11 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 0, bevel: 20, inner: 20, hovered: 10 },
				{ lum: Y90,  base: 0, bevel: 20, inner: 20, hovered: 10 },
				{ lum: Y95,  base: 0, bevel: 19, inner: 19, hovered:  9 },
				{ lum: Y100, base: 0, bevel: 60, inner: 60, hovered: 60 }
			],

			/**
			 * The menu button rect/background (normal/hovered/down states).
			 */
			rect: [
				// * VERY DARK ZONE * //
				{ lum: Y0,    base:  62, bevel: -82, inner: -82 },
				{ lum: Y0_1,  base:  60, bevel: -78, inner: -78 },
				{ lum: Y0_2,  base:  58, bevel: -72, inner: -72 },
				{ lum: Y0_5,  base:  55, bevel: -45, inner: -45 },
				{ lum: Y1_0,  base:  52, bevel: -35, inner: -35 },
				{ lum: Y1_8,  base:  50, bevel: -25, inner: -25 },

				// * DARK ZONE * //
				{ lum: Y3_5,  base:  49, bevel: -15, inner: -15 },
				{ lum: Y5_5,  base:  49, bevel: -14, inner: -14 },
				{ lum: Y7_5,  base:  48, bevel: -13, inner: -13 },
				{ lum: Y10,   base:  48, bevel: -12, inner: -12 },

				// * MID ZONE * //
				{ lum: Y15,   base:  47, bevel: -11, inner: -11 },
				{ lum: Y22,   base:  47, bevel: -10, inner: -10 },
				{ lum: Y32,   base:  46, bevel:  -9, inner:  -9 },
				{ lum: Y36_2, base:  46, bevel:  -9, inner:  -9 },
				{ lum: Y36_7, base: -46, bevel:  -9, inner:  -9 },
				{ lum: Y40,   base: -44, bevel:  -9, inner:  -9 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,   base: -42, bevel:  -9, inner:  -9 },
				{ lum: Y50,   base: -40, bevel:  -9, inner:  -9 },
				{ lum: Y60,   base: -38, bevel:  -8, inner:  -8 },
				{ lum: Y67,   base: -36, bevel:  -8, inner:  -8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,   base: -34, bevel:  -6, inner:  -6 },
				{ lum: Y85,   base: -30, bevel:  -6, inner:  -6 },
				{ lum: Y90,   base: -28, bevel:  -5, inner:  -5 },
				{ lum: Y95,   base: -26, bevel:  -5, inner:  -5 },
				{ lum: Y100,  base: -24, bevel:  50, inner:  50 }
			],

			/**
			 * The menu text labels.
			 */
			text: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 77 },
				{ lum: Y0_1, value: 78 },
				{ lum: Y0_2, value: 79 },
				{ lum: Y0_5, value: 80 },
				{ lum: Y1_0, value: 81 },
				{ lum: Y1_8, value: 82 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 83 },
				{ lum: Y5_5, value: 84 },
				{ lum: Y7_5, value: 85 },
				{ lum: Y10,  value: 86 },

				// * MID ZONE * //
				{ lum: Y15,  value: 86 },
				{ lum: Y22,  value: 86 },
				{ lum: Y32,  value: 85 },
				{ lum: Y40,  value: 84 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 83 },
				{ lum: Y50,  value: 81 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 73 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -70 },
				{ lum: Y85,  value: -75 },
				{ lum: Y90,  value: -78 },
				{ lum: Y95,  value: -80 },
				{ lum: Y100, value: -83 }
			],

			/**
			 * The STYLE OVERLAYS - Applied via applyStyleColor().
			 * These are alpha values used for overlay blending.
			 */
			styleTop: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 220, bevel: 220, inner: 220, emboss: 100 },
				{ lum: Y0_1, base: 218, bevel: 218, inner: 218, emboss:  98 },
				{ lum: Y0_2, base: 216, bevel: 216, inner: 216, emboss:  96 },
				{ lum: Y0_5, base: 214, bevel: 214, inner: 214, emboss:  94 },
				{ lum: Y1_0, base: 210, bevel: 210, inner: 210, emboss:  90 },
				{ lum: Y1_8, base: 206, bevel: 206, inner: 206, emboss:  86 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 202, bevel: 202, inner: 202, emboss:  82 },
				{ lum: Y5_5, base: 200, bevel: 200, inner: 200, emboss:  80 },
				{ lum: Y7_5, base: 208, bevel: 208, inner: 208, emboss:  78 },
				{ lum: Y10,  base: 216, bevel: 216, inner: 216, emboss:  76 },

				// * MID ZONE * //
				{ lum: Y15,  base: 224, bevel: 224, inner: 224, emboss:  74 },
				{ lum: Y22,  base: 222, bevel: 222, inner: 222, emboss:  72 },
				{ lum: Y32,  base: 210, bevel: 210, inner: 210, emboss:  70 },
				{ lum: Y40,  base: 208, bevel: 208, inner: 208, emboss:  68 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  base: 207, bevel: 207, inner: 207, emboss:  67 },
				{ lum: Y50,  base: 206, bevel: 206, inner: 206, emboss:  66 },
				{ lum: Y60,  base: 205, bevel: 205, inner: 205, emboss:  65 },
				{ lum: Y67,  base: 204, bevel: 204, inner: 204, emboss:  64 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  base: 202, bevel: 202, inner: 202, emboss:  62 },
				{ lum: Y85,  base: 200, bevel: 200, inner: 200, emboss:  60 },
				{ lum: Y90,  base: 199, bevel: 199, inner: 199, emboss:  59 },
				{ lum: Y95,  base: 198, bevel: 198, inner: 198, emboss:  58 },
				{ lum: Y100, base: 197, bevel: 197, inner: 197, emboss:  57 }
			],

			styleBottom: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 30, bevel: 30, inner: 20, emboss: 60 },
				{ lum: Y0_1, base: 29, bevel: 29, inner: 19, emboss: 58 },
				{ lum: Y0_2, base: 28, bevel: 28, inner: 18, emboss: 56 },
				{ lum: Y0_5, base: 27, bevel: 27, inner: 17, emboss: 54 },
				{ lum: Y1_0, base: 25, bevel: 25, inner: 15, emboss: 50 },
				{ lum: Y1_8, base: 23, bevel: 23, inner: 13, emboss: 46 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 21, bevel: 21, inner: 11, emboss: 42 },
				{ lum: Y5_5, base: 50, bevel: 50, inner: 10, emboss: 40 },
				{ lum: Y7_5, base: 39, bevel: 39, inner:  9, emboss: 38 },
				{ lum: Y10,  base: 38, bevel: 38, inner:  8, emboss: 36 },

				// * MID ZONE * //
				{ lum: Y15,  base: 37, bevel: 37, inner:  7, emboss: 34 },
				{ lum: Y22,  base: 36, bevel: 36, inner:  6, emboss: 32 },
				{ lum: Y32,  base: 35, bevel: 35, inner:  5, emboss: 30 },
				{ lum: Y40,  base: 34, bevel: 34, inner:  4, emboss: 28 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  base: 34, bevel: 34, inner:  4, emboss: 27 },
				{ lum: Y50,  base: 33, bevel: 33, inner:  3, emboss: 26 },
				{ lum: Y60,  base: 33, bevel: 33, inner:  3, emboss: 25 },
				{ lum: Y67,  base: 32, bevel: 32, inner:  2, emboss: 24 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  base: 31, bevel: 31, inner:  1, emboss: 22 },
				{ lum: Y85,  base: 30, bevel: 30, inner:  0, emboss: 20 },
				{ lum: Y90,  base: 30, bevel: 30, inner:  0, emboss: 19 },
				{ lum: Y95,  base: 29, bevel: 29, inner:  0, emboss: 18 },
				{ lum: Y100, base: 29, bevel: 29, inner:  0, emboss: 17 }
			],

			/**
			 * The menu rect emboss top overlay (color values, not alpha).
			 * Used when: style = emboss, for top highlight.
			 */
			styleRectEmbossTop: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  32 },
				{ lum: Y0_1, value:  26 },
				{ lum: Y0_2, value:  20 },
				{ lum: Y0_5, value:  -5 },
				{ lum: Y1_0, value:  -2 },
				{ lum: Y1_8, value:   0 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:   1 },
				{ lum: Y5_5, value:   1 },
				{ lum: Y7_5, value:   2 },
				{ lum: Y10,  value:   2 },

				// * MID ZONE * //
				{ lum: Y15,  value:  20 },
				{ lum: Y22,  value:  20 },
				{ lum: Y32,  value:   4 },
				{ lum: Y40,  value:   4 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:   3 },
				{ lum: Y50,  value:   3 },
				{ lum: Y60,  value:   4 },
				{ lum: Y67,  value:   4 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:   6 },
				{ lum: Y85,  value:   6 },
				{ lum: Y90,  value:   7 },
				{ lum: Y95,  value:   7 },
				{ lum: Y100, value:  60 }
			],

			/**
			 * The menu rect emboss bottom overlay (color values, not alpha).
			 * Used when: style = emboss, for bottom shadow.
			 */
			styleRectEmbossBottom: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  17 },
				{ lum: Y0_1, value:  11 },
				{ lum: Y0_2, value:   5 },
				{ lum: Y0_5, value: -30 },
				{ lum: Y1_0, value: -27 },
				{ lum: Y1_8, value: -25 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -24 },
				{ lum: Y5_5, value: -24 },
				{ lum: Y7_5, value: -23 },
				{ lum: Y10,  value: -23 },

				// * MID ZONE * //
				{ lum: Y15,  value: -22 },
				{ lum: Y22,  value: -22 },
				{ lum: Y32,  value: -21 },
				{ lum: Y40,  value: -21 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -22 },
				{ lum: Y50,  value: -22 },
				{ lum: Y60,  value: -21 },
				{ lum: Y67,  value: -21 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -19 },
				{ lum: Y85,  value: -19 },
				{ lum: Y90,  value: -18 },
				{ lum: Y95,  value: -18 },
				{ lum: Y100, value:  45 }
			]
		};

		/**
		 * The complete transport button keyframes.
		 * Role strings: 'transport.bg', 'transport.ellipse', 'transport.icon' and related style overlays.
		 * @private @type {Object}
		 */
		this.transportKeyframes = {
			/**
			 * The transport button ellipse background.
			 */
			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 55 },
				{ lum: Y0_1, value: 56 },
				{ lum: Y0_2, value: 56 },
				{ lum: Y0_5, value: 57 },
				{ lum: Y1_0, value: 59 },
				{ lum: Y1_8, value: 61 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 63 },
				{ lum: Y5_5, value: 66 },
				{ lum: Y7_5, value: 68 },
				{ lum: Y10,  value: 70 },

				// * MID ZONE * //
				{ lum: Y15,  value: 72 },
				{ lum: Y22,  value: 75 },
				{ lum: Y32,  value: 78 },
				{ lum: Y40,  value: 80 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 81 },
				{ lum: Y50,  value: 82 },
				{ lum: Y60,  value: 83 },
				{ lum: Y67,  value: 84 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  95 },
				{ lum: Y85,  value: 100 },
				{ lum: Y90,  value: 100 },
				{ lum: Y95,  value: 100 },
				{ lum: Y100, value:  -6 }
			],

			/**
			 * The transport button ellipse inner circle.
			 */
			ellipse: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  20 },
				{ lum: Y0_1, value:  14 },
				{ lum: Y0_2, value:  10 },
				{ lum: Y0_5, value: -10 },
				{ lum: Y1_0, value:  -9 },
				{ lum: Y1_8, value:  -9 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  -8 },
				{ lum: Y5_5, value:  -8 },
				{ lum: Y7_5, value:  -7 },
				{ lum: Y10,  value:  -7 },

				// * MID ZONE * //
				{ lum: Y15,  value:  -7 },
				{ lum: Y22,  value:  -7 },
				{ lum: Y32,  value:  -7 },
				{ lum: Y40,  value:  -7 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  -7 },
				{ lum: Y50,  value:  -7 },
				{ lum: Y60,  value:  -8 },
				{ lum: Y67,  value:  -8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  -8 },
				{ lum: Y85,  value:  -9 },
				{ lum: Y90,  value:  -9 },
				{ lum: Y95,  value: -10 },
				{ lum: Y100, value: -10 }
			],

			/**
			 * The transport button icons normal state.
			 */
			icon: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -52 },
				{ lum: Y0_1, value: -50 },
				{ lum: Y0_2, value: -48 },
				{ lum: Y0_5, value: -46 },
				{ lum: Y1_0, value: -44 },
				{ lum: Y1_8, value: -42 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -40 },
				{ lum: Y5_5, value: -38 },
				{ lum: Y7_5, value: -36 },
				{ lum: Y10,  value: -34 },

				// * MID ZONE * //
				{ lum: Y15,  value: -32 },
				{ lum: Y22,  value: -30 },
				{ lum: Y32,  value: -30 },
				{ lum: Y40,  value: -32 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -34 },
				{ lum: Y50,  value: -36 },
				{ lum: Y60,  value: -42 },
				{ lum: Y67,  value: -44 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -46 },
				{ lum: Y85,  value: -48 },
				{ lum: Y90,  value: -50 },
				{ lum: Y95,  value: -52 },
				{ lum: Y100, value: -55 }
			],

			/**
			 * The transport button icons hovered state.
			 */
			iconHovered: [
				// * VERY DARK ZONE * //
				{ lum: Y0,    value:  100 },
				{ lum: Y0_1,  value:  100 },
				{ lum: Y0_2,  value:  100 },
				{ lum: Y0_5,  value:  100 },
				{ lum: Y1_0,  value:  100 },
				{ lum: Y1_8,  value:  100 },

				// * DARK ZONE * //
				{ lum: Y3_5,  value:  100 },
				{ lum: Y5_5,  value:  100 },
				{ lum: Y7_5,  value:  100 },
				{ lum: Y10,   value:  100 },

				// * MID ZONE * //
				{ lum: Y15,   value:  100 },
				{ lum: Y22,   value:  100 },
				{ lum: Y32,   value:  100 },
				{ lum: Y36_2, value:  100 },
				{ lum: Y36_7, value: -100 },
				{ lum: Y40,   value: -100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,   value: -100 },
				{ lum: Y50,   value: -100 },
				{ lum: Y60,   value: -100 },
				{ lum: Y67,   value: -100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,   value: -100 },
				{ lum: Y85,   value: -100 },
				{ lum: Y90,   value: -100 },
				{ lum: Y95,   value: -100 },
				{ lum: Y100,  value: -100 }
			],

			/**
			 * The transport button icons normal state with style minimal.
			 */
			iconMinimal: [
				// * VERY DARK ZONE * //
				{ lum: Y0,    value:  76 },
				{ lum: Y0_1,  value:  77 },
				{ lum: Y0_2,  value:  78 },
				{ lum: Y0_5,  value:  79 },
				{ lum: Y1_0,  value:  80 },
				{ lum: Y1_8,  value:  81 },

				// * DARK ZONE * //
				{ lum: Y3_5,  value:  82 },
				{ lum: Y5_5,  value:  83 },
				{ lum: Y7_5,  value:  84 },
				{ lum: Y10,   value:  85 },

				// * MID ZONE * //
				{ lum: Y15,   value:  85 },
				{ lum: Y22,   value:  84 },
				{ lum: Y32,   value:  72 },
				{ lum: Y40,   value: -60 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,   value: -65 },
				{ lum: Y50,   value: -68 },
				{ lum: Y60,   value: -72 },
				{ lum: Y67,   value: -74 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,   value: -76 },
				{ lum: Y85,   value: -78 },
				{ lum: Y90,   value: -80 },
				{ lum: Y95,   value: -82 },
				{ lum: Y100,  value: -85 }
			],

			/**
			 * The transport button icons hovered state with style minimal.
			 */
			iconMinimalHovered: [
				// * VERY DARK ZONE * //
				{ lum: Y0,    value:  100 },
				{ lum: Y0_1,  value:  100 },
				{ lum: Y0_2,  value:  100 },
				{ lum: Y0_5,  value:  100 },
				{ lum: Y1_0,  value:  100 },
				{ lum: Y1_8,  value:  100 },

				// * DARK ZONE * //
				{ lum: Y3_5,  value:  100 },
				{ lum: Y5_5,  value:  100 },
				{ lum: Y7_5,  value:  100 },
				{ lum: Y10,   value:  100 },

				// * MID ZONE * //
				{ lum: Y15,   value:  100 },
				{ lum: Y22,   value:  100 },
				{ lum: Y32,   value:  100 },
				{ lum: Y36_2, value:  100 },
				{ lum: Y36_7, value: -100 },
				{ lum: Y40,   value: -100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,   value: -100 },
				{ lum: Y50,   value: -100 },
				{ lum: Y60,   value: -100 },
				{ lum: Y67,   value: -100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,   value: -100 },
				{ lum: Y85,   value: -100 },
				{ lum: Y90,   value: -100 },
				{ lum: Y95,   value: -100 },
				{ lum: Y100,  value: -100 }
			],

			/**
			 * The transport button light with emboss style.
			 */
			embossLight: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  4 },
				{ lum: Y0_1, value:  4 },
				{ lum: Y0_2, value:  5 },
				{ lum: Y0_5, value:  5 },
				{ lum: Y1_0, value:  6 },
				{ lum: Y1_8, value:  7 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  8 },
				{ lum: Y5_5, value:  9 },
				{ lum: Y7_5, value:  8 },
				{ lum: Y10,  value:  9 },
				{ lum: Y15,  value: 10 },

				// * MID ZONE * //
				{ lum: Y22,  value: 12 },
				{ lum: Y32,  value: 11 },
				{ lum: Y40,  value: 11 },
				{ lum: Y45,  value: 10 },
				{ lum: Y50,  value: 10 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: 10 },
				{ lum: Y67,  value: 10 },
				{ lum: Y75,  value: 10 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value: 10 },
				{ lum: Y90,  value: 10 },
				{ lum: Y95,  value: 10 },
				{ lum: Y100, value: 10 }
			],

			/**
			 * The transport button dark with emboss style.
			 */
			embossDark: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -20 },
				{ lum: Y0_1, value: -18 },
				{ lum: Y0_2, value: -15 },
				{ lum: Y0_5, value: -12 },
				{ lum: Y1_0, value:  -5 },
				{ lum: Y1_8, value:   5 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  15 },
				{ lum: Y5_5, value:  30 },
				{ lum: Y7_5, value:  40 },
				{ lum: Y10,  value:  40 },
				{ lum: Y15,  value:  40 },

				// * MID ZONE * //
				{ lum: Y22,  value:  40 },
				{ lum: Y32,  value:  40 },
				{ lum: Y40,  value:  37 },
				{ lum: Y45,  value:  35 },
				{ lum: Y50,  value:  33 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value:  32 },
				{ lum: Y67,  value:  30 },
				{ lum: Y75,  value:  30 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value:  30 },
				{ lum: Y90,  value:  30 },
				{ lum: Y95,  value:  30 },
				{ lum: Y100, value:  30 }
			],

			/**
			 * The transport button top shadow.
			 */
			top: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  4 },
				{ lum: Y0_1, value:  4 },
				{ lum: Y0_2, value:  4 },
				{ lum: Y0_5, value:  4 },
				{ lum: Y1_0, value:  5 },
				{ lum: Y1_8, value:  5 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  6 },
				{ lum: Y5_5, value:  6 },
				{ lum: Y7_5, value:  6 },
				{ lum: Y10,  value:  3 },
				{ lum: Y15,  value:  0 },

				// * MID ZONE * //
				{ lum: Y22,  value: -6 },
				{ lum: Y32,  value: -6 },
				{ lum: Y40,  value: -6 },
				{ lum: Y45,  value: -6 },
				{ lum: Y50,  value: -6 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: -3 },
				{ lum: Y67,  value:  0 },
				{ lum: Y75,  value:  2 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value:  4 },
				{ lum: Y90,  value:  5 },
				{ lum: Y95,  value:  5 },
				{ lum: Y100, value:  6 }
			],

			/**
			 * The transport button bottom shadow.
			 */
			bottom: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  4 },
				{ lum: Y0_1, value:  4 },
				{ lum: Y0_2, value:  4 },
				{ lum: Y0_5, value:  4 },
				{ lum: Y1_0, value:  5 },
				{ lum: Y1_8, value:  5 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  6 },
				{ lum: Y5_5, value:  6 },
				{ lum: Y7_5, value:  6 },
				{ lum: Y10,  value:  3 },
				{ lum: Y15,  value:  0 },

				// * MID ZONE * //
				{ lum: Y22,  value: -6 },
				{ lum: Y32,  value: -6 },
				{ lum: Y40,  value: -6 },
				{ lum: Y45,  value: -6 },
				{ lum: Y50,  value: -6 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: -3 },
				{ lum: Y67,  value:  0 },
				{ lum: Y75,  value:  2 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value:  4 },
				{ lum: Y90,  value:  5 },
				{ lum: Y95,  value:  5 },
				{ lum: Y100, value:  6 }
			],

			styleBg:     this.menuKeyframes.styleBg,
			styleTop:    this.menuKeyframes.styleTop,
			styleBottom: this.menuKeyframes.styleBottom,
		};

		/**
		 * The complete progress bar keyframes.
		 * Role strings: 'progressBar.bg', 'progressBar.fill' and related overlays.
		 * @private @type {Object}
		 */
		this.progressBarKeyframes = {
			/**
			 * The progress bar background.
			 */
			bg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  25 },
				{ lum: Y0_1, value:  12 },
				{ lum: Y0_2, value:  10 },
				{ lum: Y0_5, value: -16 },
				{ lum: Y1_0, value: -12 },
				{ lum: Y1_8, value: -10 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -9 },
				{ lum: Y5_5, value: -9 },
				{ lum: Y7_5, value: -8 },
				{ lum: Y10,  value: -8 },

				// * MID ZONE * //
				{ lum: Y15, value: -7 },
				{ lum: Y22, value: -7 },
				{ lum: Y32, value: -6 },
				{ lum: Y40, value: -6 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45, value: -6 },
				{ lum: Y50, value: -6 },
				{ lum: Y60, value: -7 },
				{ lum: Y67, value: -7 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -7 },
				{ lum: Y85,  value: -7 },
				{ lum: Y90,  value: -8 },
				{ lum: Y95,  value: -8 },
				{ lum: Y100, value: -8 }
			],

			/**
			 * The progress bar fill.
			 */
			fill: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 50 },
				{ lum: Y0_1, value: 51 },
				{ lum: Y0_2, value: 51 },
				{ lum: Y0_5, value: 52 },
				{ lum: Y1_0, value: 54 },
				{ lum: Y1_8, value: 56 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 58 },
				{ lum: Y5_5, value: 61 },
				{ lum: Y7_5, value: 63 },
				{ lum: Y10,  value: 65 },

				// * MID ZONE * //
				{ lum: Y15,  value: 67 },
				{ lum: Y22,  value: 70 },
				{ lum: Y32,  value: 73 },
				{ lum: Y40,  value: 75 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 76 },
				{ lum: Y50,  value: 77 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 79 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  95 },
				{ lum: Y85,  value: 100 },
				{ lum: Y90,  value: -17 },
				{ lum: Y95,  value: -15 },
				{ lum: Y100, value: -20 }
			],

			/**
			 * The progress bar highlight overlay (alpha).
			 */
			highlight: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 75, bevel: 65 },
				{ lum: Y0_1, base: 74, bevel: 64 },
				{ lum: Y0_2, base: 74, bevel: 64 },
				{ lum: Y0_5, base: 74, bevel: 64 },
				{ lum: Y1_0, base: 73, bevel: 63 },
				{ lum: Y1_8, base: 72, bevel: 62 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 71, bevel: 61 },
				{ lum: Y5_5, base: 70, bevel: 60 },
				{ lum: Y7_5, base: 70, bevel: 60 },
				{ lum: Y10,  base: 67, bevel: 57 },
				{ lum: Y15,  base: 63, bevel: 53 },

				// * MID ZONE * //
				{ lum: Y22,  base: 59, bevel: 49 },
				{ lum: Y32,  base: 55, bevel: 45 },
				{ lum: Y40,  base: 50, bevel: 40 },
				{ lum: Y45,  base: 47, bevel: 37 },
				{ lum: Y50,  base: 45, bevel: 35 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 42, bevel: 32 },
				{ lum: Y67,  base: 40, bevel: 30 },
				{ lum: Y75,  base: 33, bevel: 28 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 27, bevel: 47 },
				{ lum: Y90,  base: 25, bevel: 55 },
				{ lum: Y95,  base: 23, bevel: 53 },
				{ lum: Y100, base: 20, bevel: 50 }
			],

			/**
			 * The progress bar top line overlay (alpha).
			 */
			lineTop: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 60, bevel: 65, inner: 70 },
				{ lum: Y0_1, base: 59, bevel: 64, inner: 69 },
				{ lum: Y0_2, base: 58, bevel: 63, inner: 68 },
				{ lum: Y0_5, base: 58, bevel: 63, inner: 68 },
				{ lum: Y1_0, base: 56, bevel: 61, inner: 66 },
				{ lum: Y1_8, base: 54, bevel: 59, inner: 64 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 52, bevel: 57, inner: 62 },
				{ lum: Y5_5, base: 51, bevel: 56, inner: 61 },
				{ lum: Y7_5, base: 50, bevel: 55, inner: 60 },
				{ lum: Y10,  base: 47, bevel: 52, inner: 57 },
				{ lum: Y15,  base: 44, bevel: 49, inner: 54 },

				// * MID ZONE * //
				{ lum: Y22,  base: 40, bevel: 45, inner: 50 },
				{ lum: Y32,  base: 35, bevel: 40, inner: 45 },
				{ lum: Y40,  base: 30, bevel: 35, inner: 40 },
				{ lum: Y45,  base: 27, bevel: 32, inner: 37 },
				{ lum: Y50,  base: 25, bevel: 30, inner: 35 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 23, bevel: 28, inner: 33 },
				{ lum: Y67,  base: 20, bevel: 25, inner: 30 },
				{ lum: Y75,  base: 17, bevel: 22, inner: 27 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 14, bevel: 19, inner: 24 },
				{ lum: Y90,  base: 13, bevel: 18, inner: 23 },
				{ lum: Y95,  base: 12, bevel: 17, inner: 22 },
				{ lum: Y100, base: 10, bevel: 15, inner: 20 }
			],

			/**
			 * The progress bar bottom line overlay (alpha).
			 */
			lineBottom: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 10, bevel: 15, inner: 20 },
				{ lum: Y0_1, base: 10, bevel: 15, inner: 20 },
				{ lum: Y0_2, base: 11, bevel: 16, inner: 21 },
				{ lum: Y0_5, base: 11, bevel: 16, inner: 21 },
				{ lum: Y1_0, base: 12, bevel: 17, inner: 22 },
				{ lum: Y1_8, base: 13, bevel: 18, inner: 23 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 14, bevel: 19, inner: 24 },
				{ lum: Y5_5, base: 15, bevel: 20, inner: 25 },
				{ lum: Y7_5, base: 15, bevel: 20, inner: 25 },
				{ lum: Y10,  base: 18, bevel: 22, inner: 27 },
				{ lum: Y15,  base: 22, bevel: 24, inner: 29 },

				// * MID ZONE * //
				{ lum: Y22,  base: 26, bevel: 26, inner: 31 },
				{ lum: Y32,  base: 30, bevel: 30, inner: 35 },
				{ lum: Y40,  base: 33, bevel: 32, inner: 37 },
				{ lum: Y45,  base: 35, bevel: 33, inner: 38 },
				{ lum: Y50,  base: 36, bevel: 34, inner: 39 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 38, bevel: 35, inner: 40 },
				{ lum: Y67,  base: 40, bevel: 35, inner: 40 },
				{ lum: Y75,  base: 43, bevel: 38, inner: 43 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 47, bevel: 42, inner: 47 },
				{ lum: Y90,  base: 48, bevel: 43, inner: 48 },
				{ lum: Y95,  base: 49, bevel: 44, inner: 49 },
				{ lum: Y100, base: 50, bevel: 45, inner: 50 }
			],

			/**
			 * The progress bar fill shadow overlay (alpha).
			 */
			styleFillShadow: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 85, bevel: 90 },
				{ lum: Y0_1, base: 83, bevel: 88 },
				{ lum: Y0_2, base: 82, bevel: 86 },
				{ lum: Y0_5, base: 80, bevel: 85 },
				{ lum: Y1_0, base: 75, bevel: 80 },
				{ lum: Y1_8, base: 70, bevel: 75 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 65, bevel: 70 },
				{ lum: Y5_5, base: 62, bevel: 67 },
				{ lum: Y7_5, base: 60, bevel: 65 },
				{ lum: Y10,  base: 56, bevel: 61 },
				{ lum: Y15,  base: 53, bevel: 58 },

				// * MID ZONE * //
				{ lum: Y22,  base: 50, bevel: 55 },
				{ lum: Y32,  base: 45, bevel: 50 },
				{ lum: Y40,  base: 40, bevel: 45 },
				{ lum: Y45,  base: 37, bevel: 42 },
				{ lum: Y50,  base: 35, bevel: 40 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 33, bevel: 38 },
				{ lum: Y67,  base: 30, bevel: 35 },
				{ lum: Y75,  base: 27, bevel: 32 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 24, bevel: 29 },
				{ lum: Y90,  base: 23, bevel: 28 },
				{ lum: Y95,  base: 22, bevel: 27 },
				{ lum: Y100, base: 20, bevel: 25 }
			]
		};

		/**
		 * The complete volume bar keyframes.
		 * Role strings: 'volumeBar.bg', 'volumeBar.fill' and related overlays.
		 * @private @type {Object}
		 */
		this.volumeBarKeyframes = {
			/**
			 * The volume bar background.
			 */
			bg: this.transportKeyframes.bg,

			/**
			 * The volume bar fill (same as progress bar).
			 */
			fill: this.progressBarKeyframes.fill,

			/**
			 * The volume bar bg style overlay, bevel and inner.
			 */
			styleBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   base: 60, bevel: 65 },
				{ lum: Y0_1, base: 59, bevel: 64 },
				{ lum: Y0_2, base: 58, bevel: 63 },
				{ lum: Y0_5, base: 57, bevel: 62 },
				{ lum: Y1_0, base: 54, bevel: 59 },
				{ lum: Y1_8, base: 50, bevel: 55 },

				// * DARK ZONE * //
				{ lum: Y3_5, base: 46, bevel: 51 },
				{ lum: Y5_5, base: 43, bevel: 48 },
				{ lum: Y7_5, base: 40, bevel: 45 },
				{ lum: Y10,  base: 37, bevel: 42 },
				{ lum: Y15,  base: 34, bevel: 39 },

				// * MID ZONE * //
				{ lum: Y22,  base: 30, bevel: 35 },
				{ lum: Y32,  base: 26, bevel: 31 },
				{ lum: Y40,  base: 23, bevel: 28 },
				{ lum: Y45,  base: 21, bevel: 26 },
				{ lum: Y50,  base: 20, bevel: 25 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  base: 18, bevel: 23 },
				{ lum: Y67,  base: 16, bevel: 21 },
				{ lum: Y75,  base: 14, bevel: 19 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  base: 12, bevel: 17 },
				{ lum: Y90,  base: 11, bevel: 16 },
				{ lum: Y95,  base: 10, bevel: 15 },
				{ lum: Y100, base:  9, bevel: 14 }
			],

			/**
			 * The volume bar fill shadow (same as progress bar).
			 */
			styleFillShadow: this.progressBarKeyframes.styleFillShadow
		};

		/**
		 * The complete peakmeter bar keyframes.
		 * Role strings for all peakmeter elements and gradients.
		 * @private @type {Object}
		 */
		this.peakmeterBarKeyframes = {
			/**
			 * The peakmeter progress bar background (same as progress bar).
			 */
			prog: this.progressBarKeyframes.bg,

			/**
			 * The peakmeter progress fill (active portion).
			 */
			progFill: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  100 },
				{ lum: Y0_1, value:  100 },
				{ lum: Y0_2, value:  100 },
				{ lum: Y0_5, value:  100 },
				{ lum: Y1_0, value:  100 },
				{ lum: Y1_8, value:  100 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  100 },
				{ lum: Y5_5, value:  100 },
				{ lum: Y7_5, value: -100 },
				{ lum: Y10,  value: -100 },

				// * MID ZONE * //
				{ lum: Y15,  value: -100 },
				{ lum: Y22,  value: -100 },
				{ lum: Y32,  value: -100 },
				{ lum: Y40,  value: -100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -100 },
				{ lum: Y50,  value: -100 },
				{ lum: Y60,  value: -100 },
				{ lum: Y67,  value:  100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  100 },
				{ lum: Y85,  value:  100 },
				{ lum: Y90,  value:  100 },
				{ lum: Y95,  value:  100 },
				{ lum: Y100, value:  100 }
			],

			/**
			 * The peakmeter fill gradient - top.
			 */
			fillTop: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 40 },
				{ lum: Y0_1, value: 41 },
				{ lum: Y0_2, value: 42 },
				{ lum: Y0_5, value: 43 },
				{ lum: Y1_0, value: 45 },
				{ lum: Y1_8, value: 47 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 49 },
				{ lum: Y5_5, value: 52 },
				{ lum: Y7_5, value: 54 },
				{ lum: Y10,  value: 56 },

				// * MID ZONE * //
				{ lum: Y15,  value: 58 },
				{ lum: Y22,  value: 61 },
				{ lum: Y32,  value: 64 },
				{ lum: Y40,  value: 66 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 67 },
				{ lum: Y50,  value: 68 },
				{ lum: Y60,  value: 69 },
				{ lum: Y67,  value: -8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -10 },
				{ lum: Y85,  value: -12 },
				{ lum: Y90,  value: -13 },
				{ lum: Y95,  value: -15 },
				{ lum: Y100, value: -18 }
			],

			/**
			 * The peakmeter fill gradient - middle.
			 */
			fillMiddle: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 60 },
				{ lum: Y0_1, value: 61 },
				{ lum: Y0_2, value: 62 },
				{ lum: Y0_5, value: 63 },
				{ lum: Y1_0, value: 65 },
				{ lum: Y1_8, value: 67 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 69 },
				{ lum: Y5_5, value: 72 },
				{ lum: Y7_5, value: 74 },
				{ lum: Y10,  value: 76 },

				// * MID ZONE * //
				{ lum: Y15,  value: 78 },
				{ lum: Y22,  value: 81 },
				{ lum: Y32,  value: 84 },
				{ lum: Y40,  value: 86 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  87 },
				{ lum: Y50,  value:  88 },
				{ lum: Y60,  value:  89 },
				{ lum: Y67,  value: -18 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -20 },
				{ lum: Y85,  value: -22 },
				{ lum: Y90,  value: -24 },
				{ lum: Y95,  value: -27 },
				{ lum: Y100, value: -30 }
			],

			/**
			 * The peakmeter fill gradient - back.
			 */
			fillBack: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 80 },
				{ lum: Y0_1, value: 81 },
				{ lum: Y0_2, value: 82 },
				{ lum: Y0_5, value: 83 },
				{ lum: Y1_0, value: 85 },
				{ lum: Y1_8, value: 87 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  89 },
				{ lum: Y5_5, value:  92 },
				{ lum: Y7_5, value:  94 },
				{ lum: Y10,  value:  96 },

				// * MID ZONE * //
				{ lum: Y15,  value:  98 },
				{ lum: Y22,  value: 100 },
				{ lum: Y32,  value: 100 },
				{ lum: Y40,  value: 100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 100 },
				{ lum: Y50,  value: 100 },
				{ lum: Y60,  value: 100 },
				{ lum: Y67,  value: -36 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -40 },
				{ lum: Y85,  value: -44 },
				{ lum: Y90,  value: -50 },
				{ lum: Y95,  value: -58 },
				{ lum: Y100, value: -65 }
			],

			/**
			 * The vertical peakmeter progress fill.
			 */
			vertProgFill: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 50 },
				{ lum: Y0_1, value: 51 },
				{ lum: Y0_2, value: 52 },
				{ lum: Y0_5, value: 53 },
				{ lum: Y1_0, value: 55 },
				{ lum: Y1_8, value: 57 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 59 },
				{ lum: Y5_5, value: 62 },
				{ lum: Y7_5, value: 64 },
				{ lum: Y10,  value: 66 },

				// * MID ZONE * //
				{ lum: Y15,  value: 68 },
				{ lum: Y22,  value: 71 },
				{ lum: Y32,  value: 74 },
				{ lum: Y40,  value: 76 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 77 },
				{ lum: Y50,  value: 78 },
				{ lum: Y60,  value: 79 },
				{ lum: Y67,  value: -45 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -50 },
				{ lum: Y85,  value: -53 },
				{ lum: Y90,  value: -55 },
				{ lum: Y95,  value: -60 },
				{ lum: Y100, value: -63 }
			],

			/**
			 * The vertical peakmeter fill.
			 */
			vertFill: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 40 },
				{ lum: Y0_1, value: 41 },
				{ lum: Y0_2, value: 42 },
				{ lum: Y0_5, value: 43 },
				{ lum: Y1_0, value: 45 },
				{ lum: Y1_8, value: 47 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 49 },
				{ lum: Y5_5, value: 52 },
				{ lum: Y7_5, value: 54 },
				{ lum: Y10,  value: 56 },

				// * MID ZONE * //
				{ lum: Y15,  value: 58 },
				{ lum: Y22,  value: 61 },
				{ lum: Y32,  value: 64 },
				{ lum: Y40,  value: 66 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  67 },
				{ lum: Y50,  value:  68 },
				{ lum: Y60,  value:  69 },
				{ lum: Y67,  value: -40 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -45 },
				{ lum: Y85,  value: -48 },
				{ lum: Y90,  value: -49 },
				{ lum: Y95,  value: -51 },
				{ lum: Y100, value: -53 }
			],

			/**
			 * The vertical peakmeter peak indicators.
			 */
			vertFillPeaks: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 60 },
				{ lum: Y0_1, value: 61 },
				{ lum: Y0_2, value: 62 },
				{ lum: Y0_5, value: 63 },
				{ lum: Y1_0, value: 65 },
				{ lum: Y1_8, value: 67 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 69 },
				{ lum: Y5_5, value: 72 },
				{ lum: Y7_5, value: 74 },
				{ lum: Y10,  value: 76 },

				// * MID ZONE * //
				{ lum: Y15,  value: 78 },
				{ lum: Y22,  value: 81 },
				{ lum: Y32,  value: 84 },
				{ lum: Y40,  value: 86 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  87 },
				{ lum: Y50,  value:  88 },
				{ lum: Y60,  value:  89 },
				{ lum: Y67,  value: -18 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -22 },
				{ lum: Y85,  value: -24 },
				{ lum: Y90,  value: -26 },
				{ lum: Y95,  value: -28 },
				{ lum: Y100, value: -30 }
			],

			/**
			 * The static peakmeter progress fill - TintOKLCH(accent, 40) origin.
			 */
			progFillStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  40 },
				{ lum: Y0_1, value:  41 },
				{ lum: Y0_2, value:  41 },
				{ lum: Y0_5, value:  42 },
				{ lum: Y1_0, value:  43 },
				{ lum: Y1_8, value:  44 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  46 },
				{ lum: Y5_5, value:  48 },
				{ lum: Y7_5, value:  50 },
				{ lum: Y10,  value:  52 },

				// * MID ZONE * //
				{ lum: Y15,  value:  54 },
				{ lum: Y22,  value:  57 },
				{ lum: Y32,  value:  60 },
				{ lum: Y40,  value:  63 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  65 },
				{ lum: Y50,  value:  66 },
				{ lum: Y60,  value:  67 },
				{ lum: Y67,  value: -40 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -45 },
				{ lum: Y85,  value: -48 },
				{ lum: Y90,  value: -50 },
				{ lum: Y95,  value: -55 },
				{ lum: Y100, value: -58 }
			],

			/**
			 * The static peakmeter fill gradient - top - TintOKLCH(accent, 10) origin.
			 */
			fillTopStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  0 },
				{ lum: Y0_1, value:  1 },
				{ lum: Y0_2, value:  1 },
				{ lum: Y0_5, value:  2 },
				{ lum: Y1_0, value:  3 },
				{ lum: Y1_8, value:  4 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  5 },
				{ lum: Y5_5, value:  7 },
				{ lum: Y7_5, value:  8 },
				{ lum: Y10,  value:  10 },

				// * MID ZONE * //
				{ lum: Y15,  value:  12 },
				{ lum: Y22,  value:  15 },
				{ lum: Y32,  value:  18 },
				{ lum: Y40,  value:  20 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  22 },
				{ lum: Y50,  value:  23 },
				{ lum: Y60,  value:  24 },
				{ lum: Y67,  value:   8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -10 },
				{ lum: Y85,  value: -12 },
				{ lum: Y90,  value: -13 },
				{ lum: Y95,  value: -15 },
				{ lum: Y100, value: -18 }
			],

			/**
			 * The static peakmeter fill gradient - middle - TintOKLCH(accent, 20) origin.
			 */
			fillMiddleStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  10 },
				{ lum: Y0_1, value:  11 },
				{ lum: Y0_2, value:  11 },
				{ lum: Y0_5, value:  12 },
				{ lum: Y1_0, value:  14 },
				{ lum: Y1_8, value:  15 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  17 },
				{ lum: Y5_5, value:  20 },
				{ lum: Y7_5, value:  22 },
				{ lum: Y10,  value:  24 },

				// * MID ZONE * //
				{ lum: Y15,  value:  27 },
				{ lum: Y22,  value:  30 },
				{ lum: Y32,  value:  34 },
				{ lum: Y40,  value:  37 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  39 },
				{ lum: Y50,  value:  40 },
				{ lum: Y60,  value:  41 },
				{ lum: Y67,  value:  -8 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -10 },
				{ lum: Y85,  value: -12 },
				{ lum: Y90,  value: -14 },
				{ lum: Y95,  value: -17 },
				{ lum: Y100, value: -20 }
			],

			/**
			 * The static peakmeter fill gradient - back - ShadeOKLCH(accent, 15) origin.
			 * Always a shade (negative); deepens toward bright zone.
			 */
			fillBackStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -5 },
				{ lum: Y0_1, value: -5 },
				{ lum: Y0_2, value: -6 },
				{ lum: Y0_5, value: -6 },
				{ lum: Y1_0, value: -7 },
				{ lum: Y1_8, value: -8 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -10 },
				{ lum: Y5_5, value: -13 },
				{ lum: Y7_5, value: -16 },
				{ lum: Y10,  value: -19 },

				// * MID ZONE * //
				{ lum: Y15,  value: -23 },
				{ lum: Y22,  value: -28 },
				{ lum: Y32,  value: -34 },
				{ lum: Y40,  value: -38 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -41 },
				{ lum: Y50,  value: -44 },
				{ lum: Y60,  value: -48 },
				{ lum: Y67,  value: -50 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -55 },
				{ lum: Y85,  value: -60 },
				{ lum: Y90,  value: -63 },
				{ lum: Y95,  value: -66 },
				{ lum: Y100, value: -70 }
			],

			/**
			 * The static vertical peakmeter progress fill.
			 * Original was grCol.progressBarFill - mirror progressBar.fill values.
			 */
			vertProgFillStatic: this.progressBarKeyframes.fill,

			/**
			 * The static vertical peakmeter fill - accentColor itself (0-modification) origin.
			 * Very small tint for dark zone visibility; modest shade for light zone.
			 */
			vertFillStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:   5 },
				{ lum: Y0_1, value:   6 },
				{ lum: Y0_2, value:   6 },
				{ lum: Y0_5, value:   7 },
				{ lum: Y1_0, value:   8 },
				{ lum: Y1_8, value:   9 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  10 },
				{ lum: Y5_5, value:  12 },
				{ lum: Y7_5, value:  14 },
				{ lum: Y10,  value:  16 },

				// * MID ZONE * //
				{ lum: Y15,  value:  18 },
				{ lum: Y22,  value:  20 },
				{ lum: Y32,  value:  22 },
				{ lum: Y40,  value:  24 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  25 },
				{ lum: Y50,  value:  26 },
				{ lum: Y60,  value:  27 },
				{ lum: Y67,  value: -20 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -25 },
				{ lum: Y85,  value: -28 },
				{ lum: Y90,  value: -30 },
				{ lum: Y95,  value: -33 },
				{ lum: Y100, value: -35 }
			],

			/**
			 * The static vertical peakmeter peak indicators - TintOKLCH(accent, 60) origin.
			 */
			vertFillPeaksStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  60 },
				{ lum: Y0_1, value:  61 },
				{ lum: Y0_2, value:  61 },
				{ lum: Y0_5, value:  62 },
				{ lum: Y1_0, value:  63 },
				{ lum: Y1_8, value:  64 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  66 },
				{ lum: Y5_5, value:  68 },
				{ lum: Y7_5, value:  70 },
				{ lum: Y10,  value:  72 },

				// * MID ZONE * //
				{ lum: Y15,  value:  74 },
				{ lum: Y22,  value:  77 },
				{ lum: Y32,  value:  80 },
				{ lum: Y40,  value:  82 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  84 },
				{ lum: Y50,  value:  85 },
				{ lum: Y60,  value:  86 },
				{ lum: Y67,  value: -25 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -28 },
				{ lum: Y85,  value: -30 },
				{ lum: Y90,  value: -32 },
				{ lum: Y95,  value: -35 },
				{ lum: Y100, value: -38 }
			]
		};

		/**
		 * The complete waveform bar keyframes.
		 * Role strings for all waveform elements (front, back, pre-fill, indicator, static variants).
		 * @private @type {Object}
		 */
		this.waveformBarKeyframes = {
			/**
			 * The waveform front fill (played portion).
			 */
			fillFront: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 90 },
				{ lum: Y0_1, value: 91 },
				{ lum: Y0_2, value: 92 },
				{ lum: Y0_5, value: 93 },
				{ lum: Y1_0, value: 95 },
				{ lum: Y1_8, value: 97 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  99 },
				{ lum: Y5_5, value: 100 },
				{ lum: Y7_5, value: 100 },
				{ lum: Y10,  value: 100 },

				// * MID ZONE * //
				{ lum: Y15,  value: 100 },
				{ lum: Y22,  value: 100 },
				{ lum: Y32,  value: 100 },
				{ lum: Y40,  value: 100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 100 },
				{ lum: Y50,  value: 100 },
				{ lum: Y60,  value:  98 },
				{ lum: Y67,  value:  95 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -80 },
				{ lum: Y85,  value: -85 },
				{ lum: Y90,  value: -88 },
				{ lum: Y95,  value: -90 },
				{ lum: Y100, value: -93 }
			],

			/**
			 * The waveform back fill (played portion background).
			 */
			fillBack: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 45 },
				{ lum: Y0_1, value: 46 },
				{ lum: Y0_2, value: 47 },
				{ lum: Y0_5, value: 48 },
				{ lum: Y1_0, value: 50 },
				{ lum: Y1_8, value: 52 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 54 },
				{ lum: Y5_5, value: 57 },
				{ lum: Y7_5, value: 59 },
				{ lum: Y10,  value: 61 },

				// * MID ZONE * //
				{ lum: Y15,  value: 63 },
				{ lum: Y22,  value: 66 },
				{ lum: Y32,  value: 69 },
				{ lum: Y40,  value: 71 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 72 },
				{ lum: Y50,  value: 73 },
				{ lum: Y60,  value: 74 },
				{ lum: Y67,  value: 75 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -40 },
				{ lum: Y85,  value: -45 },
				{ lum: Y90,  value: -48 },
				{ lum: Y95,  value: -50 },
				{ lum: Y100, value: -53 }
			],

			/**
			 * The waveform pre-fill front (unplayed portion).
			 */
			preFront: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 60 },
				{ lum: Y0_1, value: 61 },
				{ lum: Y0_2, value: 62 },
				{ lum: Y0_5, value: 63 },
				{ lum: Y1_0, value: 65 },
				{ lum: Y1_8, value: 67 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 69 },
				{ lum: Y5_5, value: 72 },
				{ lum: Y7_5, value: 74 },
				{ lum: Y10,  value: 76 },

				// * MID ZONE * //
				{ lum: Y15,  value: 78 },
				{ lum: Y22,  value: 81 },
				{ lum: Y32,  value: 84 },
				{ lum: Y40,  value: 86 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 87 },
				{ lum: Y50,  value: 88 },
				{ lum: Y60,  value: 89 },
				{ lum: Y67,  value: 90 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -50 },
				{ lum: Y85,  value: -55 },
				{ lum: Y90,  value: -58 },
				{ lum: Y95,  value: -60 },
				{ lum: Y100, value: -63 }
			],

			/**
			 * The waveform pre-fill back (unplayed portion background).
			 */
			preBack: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 25 },
				{ lum: Y0_1, value: 26 },
				{ lum: Y0_2, value: 27 },
				{ lum: Y0_5, value: 28 },
				{ lum: Y1_0, value: 30 },
				{ lum: Y1_8, value: 32 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 34 },
				{ lum: Y5_5, value: 37 },
				{ lum: Y7_5, value: 39 },
				{ lum: Y10,  value: 41 },

				// * MID ZONE * //
				{ lum: Y15,  value: 43 },
				{ lum: Y22,  value: 46 },
				{ lum: Y32,  value: 49 },
				{ lum: Y40,  value: 51 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 52 },
				{ lum: Y50,  value: 53 },
				{ lum: Y60,  value: 54 },
				{ lum: Y67,  value: 55 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -20 },
				{ lum: Y85,  value: -25 },
				{ lum: Y90,  value: -28 },
				{ lum: Y95,  value: -30 },
				{ lum: Y100, value: -33 }
			],

			/**
			 * The waveform playback position indicator.
			 */
			indicator: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 95 },
				{ lum: Y0_1, value: 95 },
				{ lum: Y0_2, value: 96 },
				{ lum: Y0_5, value: 97 },
				{ lum: Y1_0, value: 98 },
				{ lum: Y1_8, value: 99 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 100 },
				{ lum: Y5_5, value: 100 },
				{ lum: Y7_5, value: 100 },
				{ lum: Y10,  value: 100 },

				// * MID ZONE * //
				{ lum: Y15,  value: 100 },
				{ lum: Y22,  value: 100 },
				{ lum: Y32,  value: 100 },
				{ lum: Y40,  value: 100 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 100 },
				{ lum: Y50,  value: 100 },
				{ lum: Y60,  value: 100 },
				{ lum: Y67,  value: 100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -95 },
				{ lum: Y85,  value: -98 },
				{ lum: Y90,  value: -100 },
				{ lum: Y95,  value: -100 },
				{ lum: Y100, value: -100 }
			],

			/**
			 * The static waveform front fill.
			 * Origin: colLum < 0.07 → t040, colLum < 0.12 → t020, else → primary (≈0).
			 */
			fillFrontStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  40 },
				{ lum: Y0_1, value:  40 },
				{ lum: Y0_2, value:  40 },
				{ lum: Y0_5, value:  40 },
				{ lum: Y1_0, value:  40 },
				{ lum: Y1_8, value:  40 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  38 },
				{ lum: Y5_5, value:  30 },
				{ lum: Y7_5, value:  20 },
				{ lum: Y10,  value:  10 },

				// * MID ZONE * //
				{ lum: Y15,  value:   5 },
				{ lum: Y22,  value:   5 },
				{ lum: Y32,  value:   5 },
				{ lum: Y40,  value:   5 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:   5 },
				{ lum: Y50,  value:   5 },
				{ lum: Y60,  value:   5 },
				{ lum: Y67,  value: -30 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -40 },
				{ lum: Y85,  value: -50 },
				{ lum: Y90,  value: -55 },
				{ lum: Y95,  value: -60 },
				{ lum: Y100, value: -65 }
			],

			/**
			 * The static waveform back fill.
			 * Origin: colLum < 0.07 → t020, colLum < 0.12 → primary (≈0), else → s020 (-20).
			 */
			fillBackStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  20 },
				{ lum: Y0_1, value:  20 },
				{ lum: Y0_2, value:  20 },
				{ lum: Y0_5, value:  20 },
				{ lum: Y1_0, value:  20 },
				{ lum: Y1_8, value:  20 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  16 },
				{ lum: Y5_5, value:  10 },
				{ lum: Y7_5, value:   5 },
				{ lum: Y10,  value:   0 },

				// * MID ZONE * //
				{ lum: Y15,  value: -12 },
				{ lum: Y22,  value: -20 },
				{ lum: Y32,  value: -20 },
				{ lum: Y40,  value: -20 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -20 },
				{ lum: Y50,  value: -22 },
				{ lum: Y60,  value: -24 },
				{ lum: Y67,  value: -35 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -45 },
				{ lum: Y85,  value: -50 },
				{ lum: Y90,  value: -53 },
				{ lum: Y95,  value: -55 },
				{ lum: Y100, value: -58 }
			],

			/**
			 * The static waveform pre-fill front (unplayed portion).
			 * Origin: RGB(100, 100, 100) - neutral mid-gray. Approximated via shade.
			 * Shading desaturates toward a dark neutral, deepening slightly for very bright accents.
			 */
			preFrontStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -55 },
				{ lum: Y0_1, value: -55 },
				{ lum: Y0_2, value: -55 },
				{ lum: Y0_5, value: -54 },
				{ lum: Y1_0, value: -54 },
				{ lum: Y1_8, value: -53 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -51 },
				{ lum: Y5_5, value: -49 },
				{ lum: Y7_5, value: -47 },
				{ lum: Y10,  value: -45 },

				// * MID ZONE * //
				{ lum: Y15,  value: -43 },
				{ lum: Y22,  value: -41 },
				{ lum: Y32,  value: -39 },
				{ lum: Y40,  value: -37 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -36 },
				{ lum: Y50,  value: -35 },
				{ lum: Y60,  value: -34 },
				{ lum: Y67,  value: -33 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -31 },
				{ lum: Y85,  value: -29 },
				{ lum: Y90,  value: -28 },
				{ lum: Y95,  value: -27 },
				{ lum: Y100, value: -26 }
			],

			/**
			 * The static waveform pre-fill back (unplayed portion background).
			 * Origin: RGB(80, 80, 80) - dark gray. Deeper shade than preFrontStatic.
			 */
			preBackStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -65 },
				{ lum: Y0_1, value: -65 },
				{ lum: Y0_2, value: -64 },
				{ lum: Y0_5, value: -64 },
				{ lum: Y1_0, value: -63 },
				{ lum: Y1_8, value: -62 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -60 },
				{ lum: Y5_5, value: -58 },
				{ lum: Y7_5, value: -56 },
				{ lum: Y10,  value: -54 },

				// * MID ZONE * //
				{ lum: Y15,  value: -52 },
				{ lum: Y22,  value: -50 },
				{ lum: Y32,  value: -47 },
				{ lum: Y40,  value: -45 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -44 },
				{ lum: Y50,  value: -43 },
				{ lum: Y60,  value: -42 },
				{ lum: Y67,  value: -41 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -39 },
				{ lum: Y85,  value: -36 },
				{ lum: Y90,  value: -35 },
				{ lum: Y95,  value: -34 },
				{ lum: Y100, value: -33 }
			],

			/**
			 * The static waveform playback position indicator.
			 * Origin: colLum > 0.60 → RGB(255,255,255), else → RGB(220,220,220).
			 * Both were light; we honor that for dark zone and flip for white bg.
			 */
			indicatorStatic: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  86 },
				{ lum: Y0_1, value:  86 },
				{ lum: Y0_2, value:  87 },
				{ lum: Y0_5, value:  87 },
				{ lum: Y1_0, value:  88 },
				{ lum: Y1_8, value:  88 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  89 },
				{ lum: Y5_5, value:  90 },
				{ lum: Y7_5, value:  91 },
				{ lum: Y10,  value:  92 },

				// * MID ZONE * //
				{ lum: Y15,  value:  93 },
				{ lum: Y22,  value:  94 },
				{ lum: Y32,  value:  95 },
				{ lum: Y40,  value:  96 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value:  97 },
				{ lum: Y50,  value:  98 },
				{ lum: Y60,  value: 100 },
				{ lum: Y67,  value: 100 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -95  },
				{ lum: Y85,  value: -98  },
				{ lum: Y90,  value: -100 },
				{ lum: Y95,  value: -100 },
				{ lum: Y100, value: -100 }
			]
		};

		/**
		 * The details panel element keyframes.
		 * Role strings: 'details.text', 'details.timelineAdded', 'details.timelinePlayed', 'details.timelineUnplayed'.
		 * @private @type {Object}
		 */
		this.detailsKeyframes = {
			/**
			 * The details text content.
			 */
			text: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 77 },
				{ lum: Y0_1, value: 78 },
				{ lum: Y0_2, value: 79 },
				{ lum: Y0_5, value: 80 },
				{ lum: Y1_0, value: 81 },
				{ lum: Y1_8, value: 82 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 83 },
				{ lum: Y5_5, value: 84 },
				{ lum: Y7_5, value: 85 },
				{ lum: Y10,  value: 86 },

				// * MID ZONE * //
				{ lum: Y15,  value: 86 },
				{ lum: Y22,  value: 86 },
				{ lum: Y32,  value: 85 },
				{ lum: Y40,  value: 84 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 83 },
				{ lum: Y50,  value: 81 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 73 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -55 },
				{ lum: Y85,  value: -60 },
				{ lum: Y90,  value: -63 },
				{ lum: Y95,  value: -65 },
				{ lum: Y100, value: -68 }
			],

			/**
			 * The timeline "added" bar (most recent additions).
			 */
			timelineAdded: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 40 },
				{ lum: Y0_1, value: 41 },
				{ lum: Y0_2, value: 42 },
				{ lum: Y0_5, value: 43 },
				{ lum: Y1_0, value: 44 },
				{ lum: Y1_8, value: 46 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 49 },
				{ lum: Y5_5, value: 52 },
				{ lum: Y7_5, value: 54 },
				{ lum: Y10,  value: 56 },

				// * MID ZONE * //
				{ lum: Y15,  value: 59 },
				{ lum: Y22,  value: 62 },
				{ lum: Y32,  value: 64 },
				{ lum: Y40,  value: 66 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 67 },
				{ lum: Y50,  value: 68 },
				{ lum: Y60,  value: 69 },
				{ lum: Y67,  value: 70 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  80 },
				{ lum: Y85,  value:  90 },
				{ lum: Y90,  value: -24 },
				{ lum: Y95,  value: -22 },
				{ lum: Y100, value: -27 }
			],

			/**
			 * The timeline "played" bar (playback history).
			 */
			timelinePlayed: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 25 },
				{ lum: Y0_1, value: 26 },
				{ lum: Y0_2, value: 27 },
				{ lum: Y0_5, value: 28 },
				{ lum: Y1_0, value: 29 },
				{ lum: Y1_8, value: 31 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 34 },
				{ lum: Y5_5, value: 37 },
				{ lum: Y7_5, value: 39 },
				{ lum: Y10,  value: 41 },

				// * MID ZONE * //
				{ lum: Y15,  value: 44 },
				{ lum: Y22,  value: 47 },
				{ lum: Y32,  value: 49 },
				{ lum: Y40,  value: 51 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 52 },
				{ lum: Y50,  value: 53 },
				{ lum: Y60,  value: 54 },
				{ lum: Y67,  value: 55 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  65 },
				{ lum: Y85,  value:  75 },
				{ lum: Y90,  value: -19 },
				{ lum: Y95,  value: -17 },
				{ lum: Y100, value: -22 }
			],

			/**
			 * The timeline "unplayed" bar (never played).
			 */
			timelineUnplayed: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 10 },
				{ lum: Y0_1, value: 11 },
				{ lum: Y0_2, value: 12 },
				{ lum: Y0_5, value: 13 },
				{ lum: Y1_0, value: 14 },
				{ lum: Y1_8, value: 16 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 19 },
				{ lum: Y5_5, value: 22 },
				{ lum: Y7_5, value: 24 },
				{ lum: Y10,  value: 26 },

				// * MID ZONE * //
				{ lum: Y15,  value: 29 },
				{ lum: Y22,  value: 32 },
				{ lum: Y32,  value: 34 },
				{ lum: Y40,  value: 36 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 37 },
				{ lum: Y50,  value: 38 },
				{ lum: Y60,  value: 39 },
				{ lum: Y67,  value: 40 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value:  50 },
				{ lum: Y85,  value:  60 },
				{ lum: Y90,  value: -14 },
				{ lum: Y95,  value: -12 },
				{ lum: Y100, value: -17 }
			]
		};

		/**
		 * The lower bar text element keyframes.
		 * Role string: 'lowerbar.text'.
		 * @private @type {Object}
		 */
		this.lowerBarKeyframes = {
			/**
			 * The lower bar artist/title text.
			 */
			text: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 77 },
				{ lum: Y0_1, value: 78 },
				{ lum: Y0_2, value: 79 },
				{ lum: Y0_5, value: 80 },
				{ lum: Y1_0, value: 81 },
				{ lum: Y1_8, value: 82 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 83 },
				{ lum: Y5_5, value: 84 },
				{ lum: Y7_5, value: 85 },
				{ lum: Y10,  value: 86 },

				// * MID ZONE * //
				{ lum: Y15,  value: 86 },
				{ lum: Y22,  value: 86 },
				{ lum: Y32,  value: 85 },
				{ lum: Y40,  value: 84 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 83 },
				{ lum: Y50,  value: 81 },
				{ lum: Y60,  value: 78 },
				{ lum: Y67,  value: 73 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -70 },
				{ lum: Y85,  value: -75 },
				{ lum: Y90,  value: -78 },
				{ lum: Y95,  value: -80 },
				{ lum: Y100, value: -83 }
			]
		};
		// #endregion

		// * STYLE SECTION * //
		// #region STYLE SECTION
		/**
		 * The unified style keyframes for background style effects.
		 * Keys: bevel, gradient, gradientRebornBlack, alternative.
		 * @private @type {Object}
		 */
		this.styleKeyframes = {
			/**
			 * The bevel style - subtle shade overlay creating 3D depth.
			 * Used by: grCol.styleBevel (BEVEL style active).
			 */
			bevel: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -85 },
				{ lum: Y0_1, value: -84 },
				{ lum: Y0_2, value: -93 },
				{ lum: Y0_5, value: -92 },
				{ lum: Y1_0, value: -90 },
				{ lum: Y1_8, value: -98 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -20 },
				{ lum: Y5_5, value: -22 },
				{ lum: Y7_5, value: -24 },
				{ lum: Y10,  value: -26 },

				// * MID ZONE * //
				{ lum: Y15,  value: -28 },
				{ lum: Y22,  value: -30 },
				{ lum: Y32,  value: -31 },
				{ lum: Y40,  value: -32 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: -32 },
				{ lum: Y50,  value: -33 },
				{ lum: Y60,  value: -33 },
				{ lum: Y67,  value: -33 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: -32 },
				{ lum: Y85,  value: -31 },
				{ lum: Y90,  value: -31 },
				{ lum: Y95,  value: -30 },
				{ lum: Y100, value: -30 }
			],

			/**
			 * The normal gradient - standard background gradient.
			 * Used by: grCol.styleGradient, grCol.styleGradient2.
			 */
			gradient: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: -100 },
				{ lum: Y0_1, value: -100 },
				{ lum: Y0_2, value:  -95 },
				{ lum: Y0_5, value:  -95 },
				{ lum: Y1_0, value:  -94 },
				{ lum: Y1_8, value:  -90 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -54 },
				{ lum: Y5_5, value: -52 },
				{ lum: Y7_5, value: -50 },
				{ lum: Y10,  value: -48 },

				// * MID ZONE * //
				{ lum: Y15,  value: -47 },
				{ lum: Y22,  value: -45 },
				{ lum: Y32,  value: -43 },
				{ lum: Y40,  value: -41 },
				{ lum: Y45,  value: -39 },
				{ lum: Y50,  value: -37 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: -36 },
				{ lum: Y67,  value: -35 },
				{ lum: Y75,  value: -32 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value: -29 },
				{ lum: Y90,  value: -28 },
				{ lum: Y95,  value: -27 },
				{ lum: Y100, value: -25 }
			],

			/**
			 * The Reborn Black gradient - darker, more dramatic background gradient.
			 * Used by: grCol.styleGradient, grCol.styleGradient2 when Reborn Black is active.
			 */
			gradientRebornBlack: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  10 },
				{ lum: Y0_1, value:   8 },
				{ lum: Y0_2, value:   6 },
				{ lum: Y0_5, value:   5 },
				{ lum: Y1_0, value:   0 },
				{ lum: Y1_8, value: -10 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -20 },
				{ lum: Y5_5, value: -40 },
				{ lum: Y7_5, value: -45 },
				{ lum: Y10,  value: -47 },
				{ lum: Y15,  value: -48 },

				// * MID ZONE * //
				{ lum: Y22,  value: -49 },
				{ lum: Y32,  value: -50 },
				{ lum: Y40,  value: -53 },
				{ lum: Y45,  value: -55 },
				{ lum: Y50,  value: -57 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: -59 },
				{ lum: Y67,  value: -60 },
				{ lum: Y75,  value: -62 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value: -64 },
				{ lum: Y90,  value: -64 },
				{ lum: Y95,  value: -65 },
				{ lum: Y100, value: -65 }
			],

			/**
			 * The alternative style - more aggressive tonal shift for ALT/ALT2 styles.
			 * Used by: grCol.styleAlternative (ALT and ALT2 styles active).
			 */
			alternative: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  20 },
				{ lum: Y0_1, value:  18 },
				{ lum: Y0_2, value:  16 },
				{ lum: Y0_5, value:  14 },
				{ lum: Y1_0, value:   8 },
				{ lum: Y1_8, value:  -5 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: -15 },
				{ lum: Y5_5, value: -35 },
				{ lum: Y7_5, value: -42 },
				{ lum: Y10,  value: -44 },

				// * MID ZONE * //
				{ lum: Y15,  value: -46 },
				{ lum: Y22,  value: -48 },
				{ lum: Y32,  value: -50 },
				{ lum: Y40,  value: -52 },
				{ lum: Y45,  value: -54 },
				{ lum: Y50,  value: -55 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value: -58 },
				{ lum: Y67,  value: -59 },
				{ lum: Y75,  value: -61 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value: -63 },
				{ lum: Y90,  value: -63 },
				{ lum: Y95,  value: -64 },
				{ lum: Y100, value: -64 }
			]
		};
		// #endregion

		// * GUARD SECTION * //
		// #region GUARD SECTION
		/**
		 * The minimum perceptual contrast ratios using APCA-derived values.
		 * @private @type {Object}
		 */
		this.minContrast = {
			accent: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 0.14 },
				{ lum: Y0_1, value: 0.15 },
				{ lum: Y0_2, value: 0.16 },
				{ lum: Y0_5, value: 0.17 },
				{ lum: Y1_0, value: 0.20 },
				{ lum: Y1_8, value: 0.24 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 0.26 },
				{ lum: Y5_5, value: 0.28 },
				{ lum: Y7_5, value: 0.29 },
				{ lum: Y10,  value: 0.30 },

				// * MID ZONE * //
				{ lum: Y15,  value: 0.31 },
				{ lum: Y22,  value: 0.31 },
				{ lum: Y32,  value: 0.31 },
				{ lum: Y40,  value: 0.31 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 0.31 },
				{ lum: Y50,  value: 0.31 },
				{ lum: Y60,  value: 0.31 },
				{ lum: Y67,  value: 0.32 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: 0.33 },
				{ lum: Y85,  value: 0.35 },
				{ lum: Y90,  value: 0.36 },
				{ lum: Y95,  value: 0.37 },
				{ lum: Y100, value: 0.38 }
			],

			progressBarBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 0.010 },
				{ lum: Y0_1, value: 0.011 },
				{ lum: Y0_2, value: 0.012 },
				{ lum: Y0_5, value: 0.012 },
				{ lum: Y1_0, value: 0.015 },
				{ lum: Y1_8, value: 0.018 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 0.025 },
				{ lum: Y5_5, value: 0.028 },
				{ lum: Y7_5, value: 0.030 },
				{ lum: Y10,  value: 0.032 },

				// * MID ZONE * //
				{ lum: Y15,  value: 0.032 },
				{ lum: Y22,  value: 0.032 },
				{ lum: Y32,  value: 0.035 },
				{ lum: Y40,  value: 0.035 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y45,  value: 0.035 },
				{ lum: Y50,  value: 0.035 },
				{ lum: Y60,  value: 0.035 },
				{ lum: Y67,  value: 0.038 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y75,  value: 0.040 },
				{ lum: Y85,  value: 0.045 },
				{ lum: Y90,  value: 0.047 },
				{ lum: Y95,  value: 0.050 },
				{ lum: Y100, value: 0.050 }
			]
		};

		/**
		 * The rescue boost keyframes for emergency contrast corrections.
		 * Lower values = less aggressive rescue (gentler adjustments).
		 * @private @type {Object}
		 */
		this.rescueBoostKeyframes = {
			accent: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value: 25 },
				{ lum: Y0_1, value: 24 },
				{ lum: Y0_2, value: 23 },
				{ lum: Y0_5, value: 23 },
				{ lum: Y1_0, value: 20 },
				{ lum: Y1_8, value: 18 },

				// * DARK ZONE * //
				{ lum: Y3_5, value: 16 },
				{ lum: Y5_5, value: 14 },
				{ lum: Y7_5, value: 12 },
				{ lum: Y10,  value: 11 },

				// * MID ZONE * //
				{ lum: Y15,  value: 10 },
				{ lum: Y22,  value:  9 },
				{ lum: Y32,  value:  8 },
				{ lum: Y40,  value:  7 },
				{ lum: Y45,  value:  6 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y50,  value:  5 },
				{ lum: Y60,  value:  4 },
				{ lum: Y67,  value:  3 },
				{ lum: Y75,  value:  2 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value:  1 },
				{ lum: Y90,  value:  0 },
				{ lum: Y95,  value:  0 },
				{ lum: Y100, value:  0 }
			],

			progressBarBg: [
				// * VERY DARK ZONE * //
				{ lum: Y0,   value:  6 },
				{ lum: Y0_1, value:  6 },
				{ lum: Y0_2, value:  6 },
				{ lum: Y0_5, value:  6 },
				{ lum: Y1_0, value:  5 },
				{ lum: Y1_8, value:  5 },

				// * DARK ZONE * //
				{ lum: Y3_5, value:  4 },
				{ lum: Y5_5, value:  4 },
				{ lum: Y7_5, value:  3 },
				{ lum: Y10,  value:  3 },

				// * MID ZONE * //
				{ lum: Y15,  value:  3 },
				{ lum: Y22,  value:  2 },
				{ lum: Y32,  value:  2 },
				{ lum: Y40,  value:  1 },
				{ lum: Y45,  value:  1 },
				{ lum: Y50,  value:  1 },

				// * MID-BRIGHT ZONE * //
				{ lum: Y60,  value:  1 },
				{ lum: Y67,  value:  0 },
				{ lum: Y75,  value:  0 },

				// * VERY BRIGHT ZONE * //
				{ lum: Y85,  value:  0 },
				{ lum: Y90,  value:  0 },
				{ lum: Y95,  value:  0 },
				{ lum: Y100, value:  0 }
			]
		};
		// #endregion

		// * CONFIG SECTION * //
		// #region CONFIG SECTION
		/**
		 * The static mapping of UI roles to their corresponding keyframe definitions.
		 * @type {Object<string, Object|Array>}
		 */
		this.keyframeRegistry = {
			accent: this.accentKeyframes,
			button: this.buttonKeyframes,
			scrollbar: this.scrollbarKeyframes,
			text: this.textKeyframes,
			line: this.lineKeyframes,
			nowPlaying: this.nowPlayingKeyframes,
			row: this.rowKeyframes,
			shadow: this.shadowKeyframes,
			sidemarker: this.sidemarkerKeyframes,
			noPhotoStub: this.noPhotoStubKeyframes,
			node: this.nodeKeyframes,
			menu: this.menuKeyframes,
			transport: this.transportKeyframes,
			progressBar: this.progressBarKeyframes,
			volumeBar: this.volumeBarKeyframes,
			peakmeterBar: this.peakmeterBarKeyframes,
			waveformBar: this.waveformBarKeyframes,
			details: this.detailsKeyframes,
			lowerBar: this.lowerBarKeyframes,
			style: this.styleKeyframes
		};

		/**
		 * The roles whose applyColor output is RGBA formed from baseColor + keyframe-derived alpha.
		 * Call sites pass RGB(r,g,b) as baseColor; the method packs alpha in via RGBtoRGBA.
		 * @private @type {Set<string>}
		 */
		this.roleOutputTypes = new Set([
			'shadow.panel',
			'shadow.discArt',
			'shadow.fill',
			'menu.styleBg',
			'menu.overlayBg',
			'menu.overlayRect',
			'transport.styleBg',
			'transport.styleTop',
			'transport.styleBottom',
			'progressBar.highlight',
			'progressBar.lineTop',
			'progressBar.lineBottom',
			'volumeBar.styleBg'
		]);

		/**
		 * The minimum visibility thresholds by role.
		 * Prevents invisible UI elements.
		 * @private @type {Object}
		 */
		this.minVisibilityConfig = {
			accent: 50,
			progressBarBg: 5,
			progressBarFill: 45,
			nowPlaying: 5,
			lineNormal: 15,
			linePlaying: 15,
			default: 6,
			// Special cases
			comboLineNormal: 20,
			comboLinePlaying: 18,
			nearWhiteBarBg: 10
		};

		/**
		 * The context modifiers configuration.
		 * Controls how different styling contexts affect color adjustments.
		 * @private @type {Object}
		 */
		this.modifiersConfig = {
			// When both bevel AND blend are active (exponential boost)
			combo: {
				accent: 0.995,
				barBgZones: [
					{ max: Y1_8, mult: 1.04 },
					{ max: Y22,  mult: 1.03 },
					{ max: Y60,  mult: 1.02 },
					{ max: 1.0,  mult: 1.015 }
				],
				line: 1.08,
				nowPlaying: 1.01
			},

			// Bevel only (3D depth compensation)
			bevel: {
				barBgTintZones: [
					{ max: Y0_5, mult: 1.22 },
					{ max: Y1_0, mult: 1.14 },
					{ max: Y1_8, mult: 1.09 },
					{ max: 1.0,  mult: 1.04 }
				],
				barBgShade: {
					threshold: Y7_5,
					dark: 0.93,
					light: 0.97
				},
				accent: 0.985,
				lineTint: 1.05,
				lineShade: 0.97
			},

			// Standard blend style (image texture)
			blend: {
				line: 1.12,
				accent: 0.975,
				barBg: 0.97
			},

			// Top and bottom blend2 style
			blend2: {
				reductionTable: [
					{ max: 0.15, reduction: 14 },
					{ max: 0.20, reduction: 12 },
					{ max: 0.25, reduction: 10 },
					{ max: 0.30, reduction: 8 },
					{ max: 0.40, reduction: 6 },
					{ max: 0.60, reduction: 3 },
					{ max: 1.0,  reduction: 1 }
				],
				bevelRescue: 0.72,
				barBg: {
					withBevel: 0.96,
					without: 0.94
				},
				line: {
					withBevel: 1.03,
					without: 1.05
				}
			}
		};

		/**
		 * The perceptual corrections configuration.
		 * @private @type {Object}
		 */
		this.perceptualConfig = {
			// Crossover smoothing (around 1.8% luminance flip point)
			crossover: {
				center: Y1_8,
				range: 0.012,
				tintDark: 1.09,
				tintLight: 1.04,
				shade: 0.93
			},

			// Helmholtz-Kohlrausch saturation boost
			saturation: {
				threshold: 0.75,
				factor: 0.45,
				enabledRoles: ['progressBar.bg', 'line']
			}
		};
		// #endregion

		/** @private @type {Object.<string, number>} The custom value overrides from debug overlay. */
		this.customOverrides = {};
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Maps luminance to adjustment value using perceptual gamma curve.
	 * @param {number} lum - The luminance (0.0-1.0).
	 * @param {number} darkVal - The value for dark backgrounds (lum → 0).
	 * @param {number} brightVal - The value for bright backgrounds (lum → 1).
	 * @param {boolean} inverse - The flag to inverse, higher lum = lower value (for shadows/alphas).
	 * @param {number} gamma - The curve strength (1.8 = perceptual standard, 1.0 = linear).
	 * @returns {number} The perceptually-mapped value.
	 */
	static MapLuminanceAPCA(lum, darkVal, brightVal, inverse = false, gamma = 1.8) {
		const t = Math.max(0, Math.min(1, lum));
		const curved = inverse ? 1 - (1 - t) ** gamma : t ** gamma;

		return Math.round(darkVal + curved * (brightVal - darkVal));
	}

	/**
	 * Converts HSP Perceived Brightness to APCA Y luminance for neutral grays ONLY.
	 *
	 * WARNING: This is a REFERENCE/DEBUGGING utility for neutral grays (r=g=b) only!
	 *
	 * VALID USES:
	 * - Understanding HSP↔APCA relationship for grays.
	 * - Converting anchor point reference values.
	 * - Debugging neutral gray calculations.
	 *
	 * INVALID USES:
	 * - Converting colored pixels (only works when r=g=b).
	 * - Production color conversions (use getRelativeLuminance).
	 *
	 * For actual color-to-luminance conversion, ALWAYS use getRelativeLuminance().
	 * which properly applies sRGB coefficients (0.2126R + 0.7152G + 0.0722B).
	 *
	 * @global
	 * @param {number} hspBrightness - The HSP Perceived Brightness value (0-255) for neutral gray where r=g=b.
	 * @returns {number} The APCA Y relative luminance (0.0-1.0).
	 * @example
	 * // Reference conversion for neutral gray:
	 * HSPToAPCA(125); // Returns ~0.18 (polarity switch point).
	 * HSPToAPCA(206); // Returns ~0.60 (body text minimum).
	 */
	static HSPToAPCA(hspBrightness) {
		return (hspBrightness / 255.0) ** 2.4;
	}

	/**
	 * Converts APCA Y luminance to neutral gray RGB value.
	 *
	 * VALID USES:
	 * - Creating neutral gray test colors for APCA contrast calculations.
	 * - Converting luminance targets to gray RGB values.
	 * - Reference tables and anchor point visualization.
	 *
	 * INVALID USES:
	 * - Recovering original colors from luminance (loses hue/saturation).
	 * - Converting non-gray colors (only works for r=g=b).
	 *
	 * @global
	 * @param {number} Y - The APCA Y relative luminance (0.0-1.0).
	 * @returns {number} The gray value (0-255) that produces this luminance.
	 * @example
	 * // Create test gray for APCA text detection:
	 * const testGray = APCAToHSP(0.185); // Returns 126 → RGB(126, 126, 126).
	 * const textColor = this.getTextColor(RGB(126, 126, 126), ...);
	 */
	static APCAToHSP(Y) {
		return Math.round(255 * (Y ** (1 / 2.4)));
	}
	// #endregion

	// * PUBLIC METHODS - APCA CALCULATIONS * //
	// #region PUBLIC METHODS - APCA CALCULATIONS
	/**
	 * Calculates the average luminance of an image using APCA.
	 * Applies the Helmholtz-Kohlrausch effect for saturated images.
	 * @param {GdiBitmap} image - The image to calculate luminance for.
	 * @param {Array} [colorCache] - The optional cache array.
	 * @returns {number} The average luminance (0.0-1.0).
	 */
	calcImgLuminance(image, colorCache) {
		if (!image) return 0;

		try {
			const colorSchemeArray = colorCache
				? GetAlbumArtColors(image, colorCache)
				: JSON.parse(image.GetColourSchemeJSON(14));

			if (colorSchemeArray.length === 0) return 0;

			let totalLuminance = 0;
			let totalWeight = 0;

			for (const v of colorSchemeArray) {
				const col = new Color(v.col);
				const lum = col.luminance;
				const sat = col.saturation;

				// Smooth saturation weighting - Helmholtz-Kohlrausch effect ~15%
				let satMultiplier = 1.0;
				if (sat > 10) {
					const boost = Math.min((sat - 10) / 50, 1.0);
					satMultiplier = 1.0 + (boost * 0.15);
				}

				const weight = v.freq * satMultiplier;
				totalLuminance += lum * weight;
				totalWeight += weight;
			}

			if (totalWeight === 0) return 0;

			const avgLuminance = totalLuminance / totalWeight;

			if (grCfg.settings.showDebugThemeLog) {
				console.log('APCA Image luminance:', avgLuminance.toFixed(3));
			}

			return avgLuminance;
		}
		catch (e) {
			console.log('\n>>> Error => calcImgLuminance failed!\n');
			return 0;
		}
	}

	/**
	 * Gets the brightest color from an array that meets luminance and frequency criteria.
	 * @param {Array<{col: Color, freq: number}>} colors - The array of color objects.
	 * @param {number} minLuminance - The minimum luminance.
	 * @param {number} maxLuminance - The maximum luminance.
	 * @param {number} minFrequency - The minimum frequency.
	 * @returns {Color|null} The best color or null.
	 */
	getBrightestColor(colors, minLuminance, maxLuminance, minFrequency) {
		// Filter colors that meet basic criteria
		const candidates = colors.filter(c =>
			c.col.luminance >= minLuminance && c.col.luminance <= maxLuminance && c.freq >= minFrequency
		);

		if (candidates.length === 0) return null;

		// Score each candidate: prefer higher saturation and luminance closer to 0.25
		let bestColor = null;
		let bestScore = -1;

		for (const c of candidates) {
			const lum = c.col.luminance;
			const sat = c.col.saturation;

			// Luminance score: favor 0.2-0.4 range
			const lumDiff = Math.abs(lum - 0.25);
			const lumScore = Math.max(0, 1 - lumDiff * 2);
			// Saturation score: heavily favor saturated colors
			const satScore = Math.max(sat / 100, 0.3);
			// Frequency score
			const freqScore = c.freq;

			// Combined score
			const score = lumScore * satScore * freqScore * (sat >= 40 ? 1.5 : 1.0);

			if (score > bestScore) {
				bestScore = score;
				bestColor = c.col;
			}
		}

		return bestColor;
	}

	/**
	 * Applies the APCA black-level soft-clip to raw relative luminance.
	 * This is a mandatory pre-processing step for contrast calculation to handle "black crunch."
	 * @see https://github.com/Myndex/SAPC-APCA/blob/master/documentation/APCA-W3-LaTeX.md
	 * @param {number} Y - The raw relative luminance (0.0 to 1.0).
	 * @returns {number} The soft-clipped luminance.
	 */
	getClippedLuminance(Y) {
		// APCA-W3 Constants
		const clampThres = 0.022; // Bthrsh
		const clampPower = 1.414; // Bclip

		return (
			Y < 0.0 ? 0.0 :
			Y < clampThres ? Y + (clampThres - Y) ** clampPower :
			Y
		);
	}

	/**
	 * Calculates relative luminance (Y) using APCA/WCAG 3.0 standard.
	 *
	 * @see https://github.com/Myndex/SAPC-APCA/blob/master/documentation/APCA-W3-LaTeX.md
	 * @param {Color} color - The color object containing r, g, b properties (0-255).
	 * @returns {number} The relative luminance (0.0 to 1.0).
	 */
	getRelativeLuminance(color) {
		// Simple power curve, no piecewise
		const toLinear = (c) => (c / 255.0) ** 2.4;

		// Official sRGB coefficients from APCA spec
		const r = 0.2126729 * toLinear(color.r);
		const g = 0.7151522 * toLinear(color.g);
		const b = 0.0721750 * toLinear(color.b);

		return r + g + b;
	}

	/**
	 * Calculates APCA contrast (WCAG 3.0) between text and background.
	 * Official APCA-W3 formula v0.0.98G-4g per Myndex specification.
	 *
	 * @see https://github.com/Myndex/SAPC-APCA/blob/master/documentation/APCA-W3-LaTeX.md
	 *
	 * IMPORTANT: Uses simple power curve (^2.4) for sRGB linearization,
	 * NOT the standard sRGB transfer function with piecewise linear segment.
	 *
	 * @param {number} bgColor - The background color (RGB).
	 * @param {number} txtColor - The text color (RGB).
	 * @returns {number} The APCA Lc value.
	 *   Positive = dark text on light bg (normal polarity).
	 *   Negative = light text on dark bg (reverse polarity).
	 *   Minimum thresholds: 45 (body text), 60 (preferred), 75 (high contrast).
	 */
	getContrast(bgColor, txtColor) {
		// APCA-W3 Constants
		const normalBg   = 0.56;  // Nbg - Normal polarity bg exponent
		const normalTxt  = 0.57;  // Ntx - Normal polarity txt exponent
		const reverseBg  = 0.65;  // Rbg - Reverse polarity bg exponent
		const reverseTxt = 0.62;  // Rtx - Reverse polarity txt exponent
		const scale      = 1.14;  // Wscale - Scaling factor
		const offset     = 0.027; // Woffset - Offset adjustment
		const clampMin   = 0.1;   // Wclamp - Minimum contrast before clamping to 0

		const txt = new Color(txtColor);
		const bg = new Color(bgColor);

		// Calculate luminance
		const Ybg = this.getClippedLuminance(this.getRelativeLuminance(bg));
		const Ytxt = this.getClippedLuminance(this.getRelativeLuminance(txt));

		// Calculate SAPC based on polarity
		const Sapc = Ybg > Ytxt
			? (Ybg ** normalBg - Ytxt ** normalTxt) * scale    // Normal polarity: dark text on light bg
			: (Ybg ** reverseBg - Ytxt ** reverseTxt) * scale; // Reverse polarity: light text on dark bg

		// Clamp minimum contrast, apply offset, and scale to Lc
		if (Math.abs(Sapc) < clampMin) return 0.0;

		const sapcWithOffset = Sapc > 0 ? Sapc - offset : Sapc + offset;

		// Final Lc value
		return sapcWithOffset * 100.0;
	}

	/**
	 * Gets APCA rating based on contrast value.
	 * @param {number} lc - The APCA Lc value (0-108).
	 * @returns {string} The rating: 'Preferred', 'Acceptable', 'Minimum', or 'Fail'.
	 */
	getRating(lc) {
		const abs = Math.abs(lc);

		if (abs >= 75) return 'Preferred';
		if (abs >= 60) return 'Acceptable';
		if (abs >= 45) return 'Minimum';

		return 'Fail';
	}

	/**
	 * Gets status color for APCA Lc values.
	 * @param {number|string} lc - The APCA Lc value (0-108).
	 * @returns {number} The GDI RGB color value for the status indicator.
	 */
	getStatusColor(lc) {
		const absLc = Math.abs(parseFloat(lc));
		// Preferred (Bright Green) - Lc 75+ - Highest readability
		if (absLc >= 75) return RGB(0, 255, 100);
		// Acceptable (Green) - Lc 60-75 - Good readability
		if (absLc >= 60) return RGB(80, 200, 80);
		// Minimum (Yellow) - Lc 45-60 - Minimum for body text
		if (absLc >= 45) return RGB(255, 190, 50);
		// Fail (Red) - Lc < 45 - Below minimum standards
		return RGB(255, 80, 80);
	}

	/**
	 * Determines best text color using APCA.
	 * @param {number|Color} bgColor - The background color.
	 * @param {number} [textColorLight] - The light text color option (default: RGB(220, 220, 220)).
	 * @param {number} [textColorDark] - The dark text color option (default: RGB(80, 80, 80)).
	 * @param {number} [minLc] - The minimum APCA contrast (45/60/75).
	 * @returns {object} The object { color, contrast, isLight, meetsAPCA, rating, lcLight, lcDark }.
	 */
	getTextColor(bgColor, textColorLight = RGB(220, 220, 220), textColorDark = RGB(80, 80, 80), minLc = 60) {
		const lcLight = this.getContrast(bgColor, textColorLight);
		const lcDark = this.getContrast(bgColor, textColorDark);

		const useLight = Math.abs(lcLight) > Math.abs(lcDark);
		const bestLc = useLight ? lcLight : lcDark;

		if (grCfg.settings.showDebugThemeLog) {
			console.log(`Pivot check: White Lc: ${lcLight.toFixed(2)}, Black Lc: ${lcDark.toFixed(2)} | Winner: ${useLight ? 'White' : 'Black'}`);
		}

		return {
			color: useLight ? textColorLight : textColorDark,
			contrast: Math.abs(bestLc),
			lc: bestLc,
			isLight: !useLight,
			meetsAPCA: Math.abs(bestLc) >= minLc,
			rating: this.getRating(bestLc),
			lcLight,
			lcDark
		};
	}

	/**
	 * Gets the shade variant for light backgrounds (dark elements).
	 * Comprehensive mapping for ALL UI element types.
	 * @private
	 */
	_getShadeVariant(baseColor, role) {
		const shadeMap = {
			'text.normal': 65,
			'text.muted': 75,
			'text.active': 100,
			'text.heading': 75,
			'node.plus': 75,
			'node.minus': 75,
			'button': 75,
			'scrollbar.button': 60,
			'scrollbar.thumb': 15,
			'menu.rect': 30,
			'menu.text': 75,
			'transport.icon': 65,
			'details.text': 75,
			'lowerBar.text': 75
		};

		return ShadeColor(baseColor, shadeMap[role] || 65);
	}

	/**
	 * Gets the tint variant for dark backgrounds (light elements).
	 * @private
	 */
	_getTintVariant(baseColor, role) {
		const tintMap = {
			'text.normal': 85,
			'text.muted': 80,
			'text.active': 100,
			'text.heading': 100,
			'node.plus': 80,
			'node.minus': 80,
			'button': 80,
			'scrollbar.button': 50,
			'scrollbar.thumb': 25,
			'menu.rect': 60,
			'menu.text': 80,
			'transport.icon': 80,
			'details.text': 100,
			'lowerBar.text': 100
		};

		return TintColor(baseColor, tintMap[role] || 80);
	}

	/**
	 * Determines if a role requires polarity-based switching (light/dark logic).
	 * Elements like buttons, text, and icons need different colors on light vs dark backgrounds.
	 * Structural elements like accents and bars use keyframe interpolation instead.
	 * @private
	 * @param {string} role - The UI element role.
	 * @returns {boolean} True if role needs polarity switching.
	 */
	_needsPolaritySwitch(role) {
		const exactRoles = new Set([
			'scrollbar.button',
			'scrollbar.buttonHovered',
			'scrollbar.thumb',
			// 'menu.rect',
			'menu.text',
			// 'transport.icon',
			'details.text',
			'lowerBar.text'
		]);

		// True role families - all sub-roles share the same polarity behavior
		const prefixFamilies = [
			'text.',  // text.normal, text.muted, text.active, text.heading
			'node.',  // node.plus, node.plusBg, node.minus
			'button.' // button.text, button.bg, button.icon
		];

		return exactRoles.has(role) || prefixFamilies.some(p => role.startsWith(p));
	}

	/**
	 * APCA-based background detection with perceptual blend compensation.
	 *
	 * DESIGN PHILOSOPHY:
	 * 1. Blurred images have stronger visual impact than alpha math suggests.
	 * 2. Helmholtz-Kohlrausch effect: saturated colors appear brighter.
	 * 3. When blend results are ambiguous, trust the image's original polarity.
	 *
	 * @param {number} bgColor - The background color.
	 * @param {number} [textColorLight] - The light text color option (default: RGB(220, 220, 220)).
	 * @param {number} [textColorDark] - The dark text color option (default: RGB(80, 80, 80)).
	 * @param {object} [options={}] - The configuration options.
	 * @returns {boolean} True if light bg (use dark text), false if dark bg (use light text).
	 */
	isLightBackground(bgColor, textColorLight = RGB(220, 220, 220), textColorDark = RGB(80, 80, 80), options = {}) {
		const {
			overlayColor, overlayAlpha, blurLevel, imgLuminance, imgSaturation,
			gradientColor, gradientWeight = 0.5,
			minLc = 60, forceLight = false, forceDark = false
		} = options;

		const { Y15, Y26, Y36_2, Y36_7, Y40, Y60, Y67 } = LUM;

		if (forceLight) return true;
		if (forceDark) return false;

		let effectiveColor = bgColor;

		// * PERCEPTUAL BLEND * //
		if (imgLuminance !== undefined && overlayAlpha !== undefined) {
			const bgLum = Color.LUM(bgColor);
			const alpha = overlayAlpha / 255;
			const finalLum = CalcPerceptualBlendLuminance(bgLum, imgLuminance, alpha, blurLevel, imgSaturation);

			// Convert to sRGB gray for APCA
			const grayValue = Math.round(255 * finalLum ** (1 / 2.4));
			effectiveColor = RGB(grayValue, grayValue, grayValue);

			if (grCfg.settings.showDebugThemeLog) {
				console.log(`Blend: bg=${bgLum.toFixed(3)}, img=${imgLuminance.toFixed(3)}, ${Unicode.Alpha}=${overlayAlpha} ${Unicode.RightArrow} ${finalLum.toFixed(3)} (gray=${grayValue})`);
			}
		}
		else if (overlayColor && overlayAlpha !== undefined) {
			effectiveColor = GetOverlayColor(effectiveColor, overlayColor, overlayAlpha);
		}

		// * Apply gradient * //
		if (gradientColor) {
			effectiveColor = BlendColors(effectiveColor, gradientColor, gradientWeight);
		}

		// * Get APCA result * //
		const result = this.getTextColor(effectiveColor, textColorLight, textColorDark, minLc);

		// * AMBIGUITY HANDLER * //
		const confidence = Math.abs(result.lc);

		if (confidence < 55 && imgLuminance !== undefined) {
			const bgLum = Color.LUM(bgColor);
			const contrastRatio = Math.abs(bgLum - imgLuminance);

			// CASE 1: Very dark background - blend never overcomes dark polarity
			// Y15 (0.151) = lower mid-range boundary, Y60 (0.599) = bright image threshold
			if (bgLum < Y15 && imgLuminance < Y60) {
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.WarningSign} Ambiguous (Lc ${confidence.toFixed(1)}): Very dark bg (${bgLum.toFixed(3)}) + sub-bright image → White text`);
				}
				return false; // White text
			}

			// CASE 2: Dark/mid image on light background
			// Y36_7 (0.367) = first stable Black text pivot; Y40 (0.400) = upper mid-range start
			if (imgLuminance < Y40 && bgLum > Y36_7) {
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.WarningSign} Ambiguous (Lc ${confidence.toFixed(1)}): Dark image (${imgLuminance.toFixed(3)}) on light bg → White text`);
				}
				return false; // White text
			}

			// CASE 3: Bright image on dark background
			// Y67 (0.671) = near key APCA thresholds; Y36_2 (0.362) = last stable White text
			if (imgLuminance > Y67 && bgLum < Y36_2) {
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.WarningSign} Ambiguous (Lc ${confidence.toFixed(1)}): Bright image (${imgLuminance.toFixed(3)}) on dark bg → Black text`);
				}
				return true; // Black text
			}

			// CASE 4: High saturation - image "pops" regardless of luminance
			if (imgSaturation > 70 && contrastRatio > 0.15) {
				const useLight = imgLuminance > Y40; // Y40 (0.400) = upper mid-range pivot
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.WarningSign} Ambiguous (Lc ${confidence.toFixed(1)}): High saturation (${imgSaturation.toFixed(1)}) → ${useLight ? 'Black' : 'White'} text`);
				}
				return useLight;
			}

			// CASE 5: Very low confidence + mid-luminance - use simple polarity
			// Y26 (0.267) = soft-mid lower bound; Y67 (0.671) = upper bright boundary
			if (confidence < 40 && imgLuminance > Y26 && imgLuminance < Y67) {
				const useLight = imgLuminance > Y40; // Y40 (0.400) as pivot
				if (grCfg.settings.showDebugThemeLog) {
					console.log(`  ${Unicode.WarningSign} Very ambiguous (Lc ${confidence.toFixed(1)}): Mid-luminance (${imgLuminance.toFixed(3)}) → ${useLight ? 'Black' : 'White'} text`);
				}
				return useLight;
			}
		}

		// * STANDARD APCA RESULT * //
		if (grCfg.settings.showDebugThemeLog) {
			console.log(`APCA: Base=${ColToRgb(bgColor)}, Effective=${ColToRgb(effectiveColor)}`);
			console.log(`  ${Unicode.RightArrow} ${result.isLight ? 'DARK text' : 'LIGHT text'} (Lc ${Math.abs(result.lc).toFixed(1)}) - ${result.rating}`);
		}

		return result.isLight;
	}

	/**
	 * Prints a detailed luminance mapping and verification table.
	 * Shows nominal Y, recomputed actual Y, Y difference, OKLCH Lightness, gray, and ideal gray.
	 * @param {number|Object.<string, {Y: number, L: number, gray: number}>|Array} [input] -
	 * The optional input: a single Y value, LUM_REF object (default), or array of anchors.
	 * @example
	 * ColorSystem.printLuminanceVerification();              // Full table (default: LUM_REF)
	 * ColorSystem.printLuminanceVerification(0.3621);        // Single value
	 * ColorSystem.printLuminanceVerification(LUM_REF.Y36_2); // Single anchor
	 */
	printLuminanceVerification(input = LUM_REF) {
		console.log('KEY\tNOM Y\tACT Y\tDIFF\tOKLCH L\tGRAY\tIDEAL G');
		console.log('------\t---------\t---------\t----------\t----------\t-------\t---------');

		const process = (nominalY, key, storedL, storedGray) => {
			if (key === undefined) key = 'VAL';

			const displayedL = storedL != null ? storedL : APCA_Luminance_to_OKLCH_Lightness(nominalY);
			const actualY = OKLCH_Lightness_to_APCA_Luminance(displayedL);
			const diff = actualY - nominalY;
			const idealGrayVal = (APCA_Luminance_to_GrayRGB(nominalY) >> 16) & 0xFF;
			const displayedGray = storedGray != null ? storedGray : idealGrayVal;

			const keyStr = String(key).padEnd(6);
			const nomStr = nominalY.toFixed(4).padStart(7);
			const actStr = actualY.toFixed(4).padStart(7);
			const diffStr = (diff >= 0 ? '+ ' : '- ') + Math.abs(diff).toFixed(4);
			const lStr = displayedL.toFixed(4).padStart(8);
			const grayStr = displayedGray.toString().padStart(4);
			const idealStr = idealGrayVal.toString().padStart(7);

			console.log(`${keyStr}\t${nomStr}\t${actStr}\t${diffStr}\t${lStr}\t${grayStr}\t${idealStr}`);
		};

		if (typeof input === 'number') {
			process(input);
		}
		else if (input && typeof input === 'object' && 'Y' in input) {
			process(input.Y, 'ANCHOR', input.L, input.gray);
		}
		else if (Array.isArray(input)) {
			input.forEach((item, idx) => {
				const val = (item && typeof item === 'object' && 'Y' in item) ? item.Y : item;
				process(val, `IDX${idx}`);
			});
		}
		else if (input && typeof input === 'object') {
			Object.keys(input).forEach((key) => {
				const ref = input[key];
				if (ref && typeof ref === 'object' && 'Y' in ref) {
					process(ref.Y, key, ref.L, ref.gray);
				}
			});
		}

		console.log('\nVerification complete: All DIFF ≈ 0.0000 and GRAY == IDEAL G confirms mathematical perfection!');
	}
	// #endregion

	// * PRIVATE METHODS - COLOR ADJUSTMENT ENGINE * //
	// #region PRIVATE METHODS - COLOR ADJUSTMENT ENGINE
	/**
	 * Initializes the shared state object used by all modifier stages.
	 * @private
	 * @param {number} amount - The raw keyframe amount.
	 * @param {string} role - The UI role string.
	 * @param {number} luminance - The background luminance.
	 * @param {Object} context - The full context object.
	 * @returns {Object} The normalized state with flags and derived values.
	 */
	_initializeModifierState(amount, role, luminance, context) {
		const absAmount = Math.abs(amount);

		return {
			absAmount,
			originalAmount: absAmount,
			sign: Math.sign(amount),
			role,
			luminance,
			context,
			hasBevel: context.bevel,
			hasBlend: context.blend,
			hasBlend2: context.blend2,
			hasAnyBlend: context.blend || context.blend2,
			hasComboMode: context.bevel && (context.blend || context.blend2),
			isAccent: role === 'accent' || role === 'progressBar.fill',
			isBarBg: role === 'progressBar.bg',
			isLine: role.startsWith('line'),
			isNowPlaying: role === 'nowPlaying'
		};
	}

	/**
	 * Applies combo-mode multipliers (when both bevel and blend are active).
	 * Combo mode uses exponential boosts to compensate for combined visual complexity.
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyComboModifiers(amount, state) {
		const { combo } = this.modifiersConfig;
		const { isAccent, isBarBg, isLine, isNowPlaying, luminance } = state;

		if (isAccent) return amount * combo.accent;

		if (isBarBg) {
			const zone = combo.barBgZones.find(z => luminance < z.max);
			const mult = zone ? zone.mult : combo.barBgZones[combo.barBgZones.length - 1].mult;
			return amount * mult;
		}

		if (isLine) return amount * combo.line;
		if (isNowPlaying) return amount * combo.nowPlaying;

		return amount;
	}

	/**
	 * Applies individual style modifiers when only bevel or blend is active.
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyIndividualModifiers(amount, state) {
		let result = amount;

		if (state.hasBevel) {
			result = this._applyBevelModifiers(result, state);
		}
		if (state.hasBlend) {
			result = this._applyBlendModifiers(result, state);
		}

		return result;
	}

	/**
	 * Applies bevel-specific adjustments (3D depth compensation).
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyBevelModifiers(amount, state) {
		const { bevel } = this.modifiersConfig;
		const { isBarBg, isAccent, isLine, luminance, sign } = state;

		if (isBarBg) {
			if (sign > 0) {
				const zone = bevel.barBgTintZones.find(z => luminance < z.max);
				const mult = zone ? zone.mult : bevel.barBgTintZones[bevel.barBgTintZones.length - 1].mult;
				return amount * mult;
			}

			const { threshold, dark, light } = bevel.barBgShade;
			return amount * (luminance < threshold ? dark : light);
		}

		if (isAccent) return amount * bevel.accent;
		if (isLine) return amount * (sign > 0 ? bevel.lineTint : bevel.lineShade);

		return amount;
	}

	/**
	 * Applies standard blend mode multipliers (image texture compensation).
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyBlendModifiers(amount, state) {
		const { blend } = this.modifiersConfig;
		const { isLine, isAccent, isBarBg } = state;

		if (isLine) return amount * blend.line;
		if (isAccent) return amount * blend.accent;
		if (isBarBg) return amount * blend.barBg;

		return amount;
	}

	/**
	 * Applies blend2 style compensation based on image luminance.
	 * Includes bevel rescue logic and hard minimums for accents.
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyBlend2Compensation(amount, state) {
		if (!state.hasBlend2 || state.context.imgLuminance === undefined) {
			return amount;
		}

		const { blend2 } = this.modifiersConfig;
		const { isAccent, isBarBg, isLine, hasBevel, role, context } = state;
		const imgLum = context.imgLuminance;

		if (isAccent) {
			const entry = blend2.reductionTable.find(z => imgLum < z.max);
			const reduction = entry ? entry.reduction : 1;
			const rescue = hasBevel ? blend2.bevelRescue : 1.0;
			const minVal = role === 'accent' ? this.minVisibilityConfig.accent : this.minVisibilityConfig.progressBarFill;
			return Math.max(amount - (reduction * rescue), minVal);
		}
		if (isBarBg) {
			return amount * (hasBevel ? blend2.barBg.withBevel : blend2.barBg.without);
		}
		if (isLine) {
			return amount * (hasBevel ? blend2.line.withBevel : blend2.line.without);
		}

		return amount;
	}

	/**
	 * Applies perceptual corrections: crossover smoothing and saturation boost.
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The modified amount.
	 */
	_applyPerceptualCorrections(amount, state) {
		let result = amount;
		const { crossover, saturation } = this.perceptualConfig;

		// Crossover smoothing (progressBarBg only, bevel without blend)
		if (state.isBarBg && state.hasBevel && !state.hasBlend && Math.abs(state.luminance - crossover.center) < crossover.range) {
			const distance = Math.abs(state.luminance - crossover.center);
			const t = Math.min(distance / crossover.range, 1);
			const smoothT = t * t * (3 - 2 * t);
			const tintSide = state.luminance < crossover.center ? crossover.tintDark : crossover.tintLight;
			const factor = tintSide + (crossover.shade - tintSide) * smoothT;
			result *= factor;

			if (grCfg.settings.showDebugThemeLog) {
				console.log(`[CROSSOVER SMOOTH] lum=${state.luminance.toFixed(4)}, factor=${factor.toFixed(3)}`);
			}
		}

		// Saturation boost (Helmholtz-Kohlrausch effect)
		if (state.context.saturation > saturation.threshold && state.luminance < LUM.Y7_5) {
			const isRelevant = saturation.enabledRoles.some(r => state.role.includes(r));

			if (isRelevant) {
				const boost = 1 + ((state.context.saturation - saturation.threshold) * saturation.factor);
				result *= boost;
			}
		}

		return result;
	}

	/**
	 * Applies final safety constraints: minimum visibility and near-white trap protection.
	 * @private
	 * @param {number} amount - The current absolute amount.
	 * @param {Object} state - The shared modifier state.
	 * @returns {number} The final constrained amount.
	 */
	_applySafetyConstraints(amount, state) {
		const { role, isLine, hasBevel, hasAnyBlend, luminance, isBarBg, context } = state;

		// Base minimum
		let min = (isLine && hasBevel && hasAnyBlend)
			? (role === 'lineNormal' ? this.minVisibilityConfig.comboLineNormal : this.minVisibilityConfig.comboLinePlaying)
			: (this.minVisibilityConfig[role] || this.minVisibilityConfig.default);

		// Near-white trap protection
		const hasImgLuminance = context && context.imgLuminance !== undefined;
		const isNearWhiteTrap = hasAnyBlend && isBarBg && (luminance > LUM.Y85) &&
								hasImgLuminance && (context.imgLuminance < luminance * 0.6);

		if (isNearWhiteTrap) {
			min = Math.max(min, this.minVisibilityConfig.nearWhiteBarBg);
		}

		return Math.max(amount, min);
	}

	/**
	 * Resolves which keyframe column to use based on active style context.
	 * Single source of truth for style-to-column mapping.
	 *
	 * Priority order:
	 *   1. bevel + (blend|blend2) + inner column present → 'inner'
	 *   2. bevel + bevel column present                  → 'bevel'
	 *   3. (blend|blend2) + inner column present         → 'inner'
	 *   4. emboss + emboss column present                → 'emboss'
	 *   5. hovered + hovered column present              → 'hovered'
	 *   6. value column present (standard keyframes)     → 'value'
	 *   7. fallback                                      → 'base'
	 *
	 * @private
	 * @param {Object} context - The style context flags.
	 * @param {boolean} [context.bevel] - The flag to enable bevel style compensation.
	 * @param {boolean} [context.blend] - The flag to enable blend style compensation.
	 * @param {boolean} [context.blend2] - The flag to enable blend2 style compensation.
	 * @param {boolean} [context.emboss] - The flag to enable emboss style compensation.
	 * @param {boolean} [context.hovered] - The flag to enable hovered state compensation.
	 * @param {Array} keyframes - The keyframe array to inspect for available columns.
	 * @returns {string} The column name to use during interpolation.
	 */
	_resolveStyleProp(context, keyframes, role = '') {
		const first = keyframes[0];
		if (!first) return 'value';

		if ('value' in first && !('base' in first)) {
			return 'value';
		}

		// Map role group → the style string already on ctx
		const group = role.split('.')[0];
		const groupStyleMap = {
			menu: context.menuStyle,
			progressBar: context.progressBarStyle,
			transport: context.transportStyle,
			volumeBar: context.volumeBarStyle
		};

		// Explicit override wins, then role-based, then null
		const style = context.style || groupStyleMap[group] || null;
		if (style && style in first) return style;

		// Global style flags (BEVEL, BLEND, BLEND2) for shadow and structural roles
		if (context.bevel && (context.blend || context.blend2) && 'inner' in first) {
			return 'inner';
		}
		if (context.bevel && 'bevel' in first) {
			return 'bevel';
		}
		if ((context.blend || context.blend2) && 'inner' in first) {
			return 'inner';
		}
		if (context.hovered && 'hovered' in first) {
			return 'hovered';
		}

		return 'base';
	}
	// #endregion

	// * PUBLIC METHODS - COLOR ADJUSTMENT ENGINE * //
	// #region PUBLIC METHODS - COLOR ADJUSTMENT ENGINE
	/**
	 * Applies final color transformation based on amount and colorspace.
	 * Respects keyframe sign: positive = tint, negative = shade.
	 *
	 * @param {number|null} baseColor - The RGB color to transform (null for alpha-only overlays).
	 * @param {number} amount - The transformation amount. Sign indicates direction: + = tint, - = shade.
	 * @param {string} colorspace - The color space: 'rgb' or 'oklch'.
	 * @param {string} role - The UI element role (used for 'auto' mode).
	 * @returns {number} The transformed RGB color or alpha value (0-255).
	 */
	applyColorTransform(baseColor, amount, colorspace, role) {
		// Alpha-only (overlays)
		if (baseColor === null) {
			return Math.max(0, Math.min(255, Math.round(Math.abs(amount))));
		}

		const absAmount = Math.abs(amount);
		const isTint = amount > 0;
		const opacity = Math.max(0, Math.min(100, absAmount));

		if (colorspace !== 'rgb' && colorspace !== 'oklch') {
			console.log(`${Unicode.WarningSign} Invalid colorspace '${colorspace}' for ${role}, defaulting to 'rgb'`);
			colorspace = 'rgb';
		}

		// OKLCH
		if (colorspace === 'oklch') {
			return isTint ? TintColorOKLCH(baseColor, opacity) : ShadeColorOKLCH(baseColor, opacity);
		}

		// RGB
		return isTint ? TintColor(baseColor, opacity) : ShadeColor(baseColor, opacity);
	}

	/**
	 * Applies context-based modifiers to color adjustment amounts.
	 * Handles special cases for:
	 * - Bevel style (subtle adjustments for 3D effects).
	 * - Blend style (compensation for image overlays).
	 * - Blend2 style (compensation for top and bottom image overlays).
	 * - Saturation boost (extra contrast for highly saturated colors).
	 * - Crossover smoothing (smooth transition around tint↔shade flip point).
	 *
	 * @param {number} amount - The base adjustment amount from keyframes.
	 * @param {string} role - The UI element role.
	 * @param {number} luminance - The APCA luminance (0.0-1.0).
	 * @param {Object} [context={}] - The context object for additional parameters.
	 * @param {boolean} [context.bevel] - The flag to enable bevel style compensation.
	 * @param {boolean} [context.blend] - The flag to enable blend style compensation.
	 * @param {boolean} [context.blend2] - The flag to enable blend2 style compensation.
	 * @param {number} [context.imgLuminance] - The image luminance for blend calculations (0.0-1.0).
	 * @param {number} [context.saturation] - The color saturation for post-crossover boost (0.0-1.0).
	 * @returns {number} The modified adjustment amount with applied context modifiers.
	 *
	 * @example
	 * const baseAmount = 60; // From keyframes
	 * const modified = apca.applyContextModifiers(baseAmount, 'accent', 0.15, {
	 *   blend2: true, imgLuminance: 0.12, saturation: 0.85
	 * });
	 */
	applyContextModifiers(amount, role, luminance, context = {}) {
		const state = this._initializeModifierState(amount, role, luminance, context);

		if (grCfg.settings.showDebugThemeLog && state.hasComboMode) {
			console.log(`[COMBO MODE] ${role}: Starting adjustment`);
		}

		let modified = state.absAmount;

		// * Step 1: Combo or individual * //
		modified = state.hasComboMode
			? this._applyComboModifiers(modified, state)
			: this._applyIndividualModifiers(modified, state);

		// * Step 2: Blend2 * //
		modified = this._applyBlend2Compensation(modified, state);

		// * Step 3: Crossover + Saturation * //
		modified = this._applyPerceptualCorrections(modified, state);

		// ** Step 4: Minimums + Near-white * //
		modified = this._applySafetyConstraints(modified, state);

		// * Final score * //
		const finalAmount = Math.round(modified) * state.sign;

		if (grCfg.settings.showDebugThemeLog && Math.abs(finalAmount - amount) > 0.5) {
			console.log(
				`[applyContextModifiers] ${role}: ${amount} ${Unicode.RightArrow} ${finalAmount} ` +
				`(lum=${luminance.toFixed(3)}, bevel=${state.hasBevel}, blend=${state.hasBlend})`
			);
		}

		return finalAmount;
	}

	/**
	 * Applies context-based color transformation for any UI element.
	 *
	 * Three output modes, selected automatically:
	 *   1. roleOutputTypes roles → RGBtoRGBA(baseColor, keyframeAlpha).
	 *   2. blendAlpha roles      → RGBtoRGBA(transformedColor, blendAlpha).
	 *   3. All others            → solid transformed color.
	 *
	 * The style column (base/bevel/inner/emboss/hovered) is resolved entirely from
	 * context flags - role strings never carry style suffixes.
	 *
	 * @param {number|null} baseColor  - RGB color. Pass RGB(0,0,0) for dark overlays, RGB(255,255,255) for light overlays.
	 * @param {number} luminance  - The APCA luminance (0.0–1.0).
	 * @param {string} colorspace - The 'rgb' or 'oklch' colorspace to use.
	 * @param {string} role - The element role identifier.
	 * @param {Object} [context={}] - The context object for additional parameters.
	 * @param {boolean} [context.bevel] - The flag to enable bevel style compensation.
	 * @param {boolean} [context.blend] - The flag to enable blend style compensation.
	 * @param {boolean} [context.blend2] - The flag to enable blend2 style compensation.
	 * @param {boolean} [context.emboss] - The flag to enable emboss style compensation.
	 * @param {boolean} [context.hovered] - The flag to enable hovered state compensation.
	 * @param {boolean} [context.rebornBlack] - The flag to enable reborn black style compensation.
	 * @param {number} [context.imgLuminance] - The image luminance for blend calculations (0.0-1.0).
	 * @param {number} [context.saturation] - The color saturation for post-crossover boost (0.0-1.0).
	 * @param {boolean} [context.isLightBg] - The flag to check if the background color is light or dark.
	 * @returns {number} The adjusted RGB or RGBA color value.
	 */
	applyColor(baseColor, luminance, colorspace, role, context = {}) {
		// * Polarity-aware switching for text / button / icon roles * //
		if (this._needsPolaritySwitch(role) && context.isLightBg !== undefined) {
			return context.isLightBg
				? this._getShadeVariant(baseColor, role)
				: this._getTintVariant(baseColor, role);
		}

		// * Unified path - all other roles * //
		const baseKey = this.getCustomOverrideKey(luminance, role, 'base');
		const baseOverride = this.getCustomOverrideValue(baseKey);
		const rawKeyframes = this.getKeyframesByRole(role);
		const prop = this._resolveStyleProp(context, rawKeyframes, role);

		// Normalize to {lum, value} using resolved column, with safe fallbacks
		const mappedKeyframes = rawKeyframes.map(kf => ({
			lum: kf.lum,
			value: kf[prop] !== undefined ? kf[prop] : kf.base !== undefined ? kf.base : (kf.value || 0)
		}));

		const easingFn = role.includes('accent')
			? (t) => Easing('gamma', t, 1.25)
			: role.startsWith('style.')
			? (t) => Easing('smoothStep', t)
			: (t) => Easing('linear', t);

		const amount = baseOverride !== undefined ? baseOverride
			: this.interpolateKeyframes(mappedKeyframes, luminance, 'value', easingFn);

		if (amount === undefined) {
			console.log(`${Unicode.WarningSign} Unknown role: ${role}`);
			return baseColor;
		}

		const modKey = this.getCustomOverrideKey(luminance, role, 'mod');
		const modOverride = this.getCustomOverrideValue(modKey);
		const modified = modOverride !== undefined ? modOverride : this.applyContextModifiers(amount, role, luminance, context);
		const safe = this.getSecureVisibility(modified, role);

		// * Alpha-output roles → pack interpolated alpha into baseColor * //
		if (this.roleOutputTypes.has(role)) {
			const alpha = Math.max(0, Math.min(255, Math.round(Math.abs(safe))));

			if (grCfg.settings.showDebugThemeLog) {
				console.log(
					`[alphaOutput] ${role}: alpha=${alpha}, col=${prop} ` +
					`(lum=${luminance.toFixed(3)}, bevel=${context.bevel}, ` +
					`blend=${context.blend}, emboss=${context.emboss}, hovered=${context.hovered})`
				);
			}

			return RGBtoRGBA(baseColor, alpha);
		}

		// * Blend alpha - RGBA for nowPlaying, library bg, etc. * //
		if (context.blend || context.blend2) {
			const mode = context.blend2 ? 'blend2' : 'blend';
			const alpha = this.interpolateBlendAlpha(rawKeyframes, luminance, mode);

			if (alpha !== null) {
				const color = this.applyColorTransform(baseColor, safe, colorspace, role);

				if (grCfg.settings.showDebugThemeLog) {
					console.log(
						`[blendAlpha] ${role}: ${mode} ${Unicode.RightArrow} alpha=${alpha} ` +
						`(lum=${luminance.toFixed(3)}, color=${ColToRgb(color)})`
					);
				}

				return RGBtoRGBA(color, alpha);
			}
		}

		// * Standard solid color transform * //
		return this.applyColorTransform(baseColor, safe, colorspace, role);
	}

	/**
	 * Retrieves the appropriate keyframe table based on the element role.
	 * Supports both flat roles (e.g. 'progressBar.bg') and nested syntax (e.g. 'line.normal').
	 * @param {string} role - The role identifier.
	 * @returns {colorSystemKeyframe[]} The corresponding keyframe table.
	 */
	getKeyframesByRole(role) {
		const parts = role.split('.');
		const totalParts = parts.length;

		// Initial lookup
		let current = this.keyframeRegistry[parts[0]];
		if (!current) return this.textKeyframes.primary;

		// Walk the path
		for (let i = 1; i < totalParts - 1; i++) {
			current = current[parts[i]];
			if (!current) return this.textKeyframes.primary;
		}

		// Handle the final segment
		if (totalParts > 1) {
			const lastKey = parts[totalParts - 1];

			if (Array.isArray(current) && current.length > 0 && typeof current[0][lastKey] !== 'undefined') {
				return current.map((kf) => ({
					lum: kf.lum,
					value: kf[lastKey]
				}));
			}

			// Standard object drill-down
			current = current[lastKey];
		}

		return Array.isArray(current) ? current : this.textKeyframes.primary;
	}

	/**
	 * Gets the custom override key for current luminance and role.
	 * @param {number} luminance - The APCA luminance.
	 * @param {string} role - The UI role.
	 * @param {string} type - The override type ('base', 'mod', 'rescue').
	 * @returns {string} The override key.
	 */
	getCustomOverrideKey(luminance, role, type) {
		const tones = grm.colorDebug.apcaGrayscaleTones;
		let closestTone = tones[0];
		let minDiff = Math.abs(luminance - closestTone.ref.Y);

		for (const tone of tones) {
			const diff = Math.abs(luminance - tone.ref.Y);
			if (diff < minDiff) {
				minDiff = diff;
				closestTone = tone;
			}
		}

		return `${role}_${closestTone.name}_${type}`;
	}

	/**
	 * Gets a custom override value if it exists.
	 * @param {string} key - The override key.
	 * @returns {number|undefined} The override value or undefined.
	 */
	getCustomOverrideValue(key) {
		return this.customOverrides[key];
	}

	/**
	 * Sets a custom override value for debugging/calibration.
	 * @param {string} key - The override key (format: "role_toneName_type").
	 * @param {number} value - The override value.
	 */
	setCustomOverrideValue(key, value) {
		this.customOverrides[key] = value;
	}
	// #endregion

	// * PUBLIC METHODS - KEYFRAME INTERPOLATION * //
	// #region PUBLIC METHODS - KEYFRAME INTERPOLATION
	/**
	 * Interpolates the blend-mode alpha value from keyframes when the property is present.
	 *
	 * Enables luminance-aware RGBA output for roles that declare `blendAlpha` (or
	 * `blend2Alpha`) in their keyframe tables. Alpha varies across the luminance range
	 * rather than using a fixed value, matching the APCA-driven philosophy of the system.
	 *
	 * Priority resolution:
	 * 1. If `mode === 'blend2'` and `blend2Alpha` exists on keyframes → use `blend2Alpha`.
	 * 2. If `blendAlpha` exists on keyframes → use `blendAlpha`.
	 * 3. Otherwise → return null (no RGBA output for this role).
	 *
	 * @param {Array} keyframes - The keyframe array, potentially containing 'blendAlpha' / 'blend2Alpha'.
	 * @param {number} luminance - The aPCA luminance (0.0-1.0).
	 * @param {string} [mode] - The active blend mode: 'blend' or 'blend2'.
	 * @returns {number|null} The interpolated alpha (0-255), or null if the role has no blend alpha.
	 *
	 * @example
	 * // Used internally by applyColor when context.blend || context.blend2 is true:
	 * const alpha = this.interpolateBlendAlpha(keyframes, 0.12, 'blend');
	 * // Returns ~138 for nowPlaying.bg at dark luminance
	 */
	interpolateBlendAlpha(keyframes, luminance, mode = 'blend') {
		if (!keyframes || !keyframes.length) return null;

		// Prefer mode-specific property, fall back to shared blendAlpha
		const property =
			(mode === 'blend2' && 'blend2Alpha' in keyframes[0]) ? 'blend2Alpha' :
			('blendAlpha' in keyframes[0]) ? 'blendAlpha' :
			null;

		if (!property) return null;

		const alpha = this.interpolateKeyframes(
			keyframes, luminance, property, (t) => Easing('smoothStep', t)
		);

		return Math.max(0, Math.min(255, Math.round(alpha)));
	}

	/**
	 * Performs generic keyframe interpolation with optional easing.
	 * Finds the two keyframes surrounding the target luminance, then interpolates between them
	 * using the specified easing function for smooth, perceptually-aware transitions.
	 *
	 * The interpolation process:
	 * 1. Boundary check: Returns exact keyframe value if luminance is outside range.
	 * 2. Binary search: Finds surrounding keyframes (lower and upper).
	 * 3. Normalization: Calculates position t between keyframes (0.0-1.0).
	 * 4. Easing: Applies easing function to t for non-linear curves.
	 * 5. Interpolation: Linear interpolation between keyframe values using eased t.
	 *
	 * @param {Array} keyframes - The keyframe array with {lum, ...} structure.
	 * @param {number} luminance - The current luminance (0.0-1.0) to interpolate at.
	 * @param {string} property - The keyframe property to interpolate ('accent', 'progressBar.bg', 'value', etc.).
	 * @param {Function} [easingFn] - The easing function (t) => easedT. Defaults to linear easing.
	 * @returns {number} The interpolated value for the specified property.
	 *
	 * @example
	 * // Linear interpolation for structural elements (progressBarBg, line)
	 * const amount = apca.interpolateKeyframes(
	 *   apca.PROGRESS_BAR_KEYFRAMES, 0.15, 'value', (t) => Easing('linear', t)
	 * );
	 *
	 * // Gamma easing for perceptual uniformity (accents)
	 * const accentAmount = apca.interpolateKeyframes(
	 *   apca.ACCENT_KEYFRAMES, 0.25, 'value', (t) => Easing('gamma', t, 1.25)
	 * );
	 *
	 * // Smoothstep for gradient transitions
	 * const gradientValue = apca.interpolateKeyframes(
	 *   apca.GRADIENT_KEYFRAMES.normal, 0.35, 'value', (t) => Easing('smoothStep', t)
	 * );
	 */
	interpolateKeyframes(keyframes, luminance, property, easingFn = (t) => Easing('linear', t)) {
		const lum = Math.max(0, Math.min(1, luminance));
		const lastIdx = keyframes.length - 1;

		// Handle edge cases
		if (lum <= keyframes[0].lum) {
			const val = keyframes[0][property];
			return (val != null) ? val : 0;
		}
		if (lum >= keyframes[lastIdx].lum) {
			const val = keyframes[lastIdx][property];
			return (val != null) ? val : 0;
		}

		// Binary search
		let i = 0;
		while (i < lastIdx && lum > keyframes[i + 1].lum) i++;
		const lower = keyframes[i];
		const upper = keyframes[i + 1];

		// Calculate normalized position with easing
		const range = upper.lum - lower.lum;
		const t = range > 0 ? (lum - lower.lum) / range : 0;
		const easedT = easingFn(t);

		const v1_raw = lower[property];
		const v2_raw = upper[property];
		const v1 = (v1_raw != null) ? v1_raw : 0;
		const v2 = (v2_raw != null) ? v2_raw : 0;

		return Lerp(v1, v2, easedT);
	}
	// #endregion

	// * PUBLIC METHODS - CONTRAST VALIDATION * //
	// #region PUBLIC METHODS - CONTRAST VALIDATION
	/**
	 * Gets adaptive rescue boost based on luminance zone and color type.
	 * Progressive boost values ensure proper contrast across all brightness levels.
	 *
	 * Accent boost strategy (aggressive tinting):
	 * - Very dark (< 1.0%): +30% - Maximum boost for near-black backgrounds.
	 * - Dark (1.0-7.5%): +22-25% - Strong boost for dark themes.
	 * - Mid (7.5-32%): +18-20% - Moderate boost for medium tones.
	 * - Bright (> 32%): +15% - Minimal boost for light backgrounds.
	 *
	 * progressBar.bg boost strategy (conservative shading):
	 * - Base: +8-10% depending on luminance.
	 * - Post-crossover (1.8-3.5%): Additional saturation-aware boost.
	 *
	 * @param {number} bgLum - The background luminance (0.0-1.0).
	 * @param {string} type - The color type: 'accent' or 'progressBar.bg'.
	 * @param {Object} [ctx={}] - The additional context parameters.
	 * @param {number} [ctx.saturation] - The color saturation for progressBarBg post-crossover boost (0.0-1.0).
	 * @returns {number} The rescue boost percentage (0-30).
	 *
	 * @example
	 * const accentBoost = apca.getAdaptiveRescueBoost(0.08, 'accent');
	 * // Returns 22 for dark zone
	 *
	 * const barBgBoost = apca.getAdaptiveRescueBoost(0.025, 'progressBar.bg', { saturation: 0.85 });
	 * // Returns base boost + saturation boost for post-crossover zone
	 */
	getAdaptiveRescueBoost(bgLum, type, ctx = {}) {
		const keyframes = this.rescueBoostKeyframes[type];
		if (!keyframes) return 0;

		// Check for rescue override
		const role = type === 'accent' ? 'accent' : 'progressBar.bg';
		const rescueKey = this.getCustomOverrideKey(bgLum, role, 'rescue');
		const rescueOverride = this.getCustomOverrideValue(rescueKey);

		if (rescueOverride !== undefined) {
			return rescueOverride;
		}

		return this.interpolateKeyframes(keyframes, bgLum, 'value', (t) => Easing('smoothStep', t));
	}

	/**
	 * Ensures no invisible UI elements by preventing zero-crossing.
	 * Enforces minimum visibility thresholds for structural elements (not accents).
	 *
	 * @param {number} amount - The adjustment amount (tint/shade value).
	 * @param {string} role - The UI element role.
	 * @returns {number} The secured amount with minimum visibility enforced.
	 *
	 * @example
	 * const unsafe = 2; // Too small, could be invisible
	 * const safe = apca.getSecureVisibility(unsafe, 'progressBar.bg'); // Returns 5 (minimum for structural elements)
	 *
	 * const accentOk = 2;
	 * const stillOk = apca.getSecureVisibility(accentOk, 'accent'); // Returns 2 (accents exempt from minimum)
	 */
	getSecureVisibility(amount, role) {
		if (role.includes('accent')) return amount;

		const absAmount = Math.abs(amount);

		if (absAmount < 5) {
			const minShift = role.startsWith('line') ? 6 : 5;
			return amount >= 0 ? minShift : -minShift;
		}

		return amount;
	}

	/**
	 * Gets validator configuration for the specified color type.
	 * Returns an object with methods for delta calculation, minimum requirements,
	 * validation checks, and rescue procedures.
	 *
	 * Validator interface:
	 * - calculateDelta(bgLum, targetLum): Calculates perceptual difference.
	 * - getMinDelta(bgLum, ctx): Returns minimum required contrast.
	 * - isValid(delta, minDelta, bgLum, ctx): Checks if contrast is sufficient.
	 * - rescue(bgColor, bgLum, ctx, origAmt): Applies rescue adjustments.
	 *
	 * @param {string} type - The validation type: 'accent', 'progressBar.bg', or 'fusion'.
	 * @returns {Object|null} The validator configuration object, or null if type is unknown.
	 *
	 * @example
	 * const accentValidator = apca.getValidator('accent');
	 * const delta = accentValidator.calculateDelta(0.15, 0.40);
	 */
	getValidator(type) {
		const validators = {
			// * ACCENT VALIDATOR * //
			// Accents should always be LIGHTER (higher luminance) than background
			// Uses interpolated minimum contrast from APCA tables
			accent: {
				calculateDelta: (bgLum, targetLum) => targetLum - bgLum,

				getMinDelta: (bgLum, ctx) => this.interpolateKeyframes(this.minContrast.accent, bgLum, 'value', t => Easing('smoothStep', t)),

				isValid: (delta, minDelta) => delta >= minDelta,

				rescue: (bgColor, bgLum, ctx, origAmt) => {
					const baseAmt = origAmt ? origAmt : this.interpolateKeyframes(this.accentKeyframes, bgLum, 'value');
					const rescueBoost = this.getAdaptiveRescueBoost(bgLum, 'accent', ctx);
					const rescueOpacity = Math.min(Math.abs(baseAmt) + rescueBoost, 95);

					if (grCfg.settings.showDebugThemeLog) {
						console.log(`${Unicode.WarningSign} Accent rescue: boost=${rescueBoost}%, final=${rescueOpacity}%`);
					}

					return TintColor(bgColor, rescueOpacity);
				}
			},

			// * PROGRESS_BAR VALIDATOR * //
			// progressBar.bg use POLARITY LOGIC based on luminance zones:
			// - Very dark (< 1.0%): Should be LIGHTER (tinted) for visibility
			// - Standard (≥ 1.0%): Should be DARKER (shaded) for depth
			'progressBar.bg': {
				calculateDelta: (bgLum, targetLum) => {
					// Polarity switch: lighter in very dark zone, darker otherwise
					return bgLum < LUM.Y1_0 ? targetLum - bgLum : bgLum - targetLum;
				},

				getMinDelta: (bgLum, ctx) => {
					// Very dark zone: minimal 1.5% delta
					if (bgLum < LUM.Y1_0) return 0.015;
					// Standard zone: interpolated minimum
					return this.interpolateKeyframes(this.minContrast.progressBarBg, bgLum, 'value', t => Easing('smoothStep', t));
				},

				isValid: (delta, minDelta) => delta >= minDelta,

				rescue: (bgColor, bgLum, ctx, origAmt) => {
					// Very dark zone: tint for visibility
					if (bgLum < LUM.Y0_5) {
						const tintAmount = bgLum < LUM.Y0_1 ? 10 : 6;
						if (grCfg.settings.showDebugThemeLog) {
							console.log(`${Unicode.WarningSign} PROGRESS BAR BG rescue (tint): amount=${tintAmount}%`);
						}
						return TintColor(bgColor, tintAmount);
					}

					// Standard zone: shade with adaptive boost
					const baseAmt = origAmt ? origAmt : this.interpolateKeyframes(this.progressBarKeyframes.bg, bgLum, 'value');
					let rescueBoost = this.getAdaptiveRescueBoost(bgLum, 'progressBar.bg', ctx);

					// Post-crossover saturation boost (critical zone: 1.8-3.5%)
					if (bgLum >= LUM.Y1_8 && bgLum < LUM.Y3_5 && ctx.saturation) {
						const satBoost =
							ctx.saturation > 0.9 ? 12 :
							ctx.saturation > 0.8 ?  9 :
							ctx.saturation > 0.6 ?  7 : 6;

						rescueBoost += satBoost;

						if (grCfg.settings.showDebugThemeLog) {
							console.log(`${Unicode.Fire} Post-crossover boost: +${satBoost}% (sat=${ctx.saturation.toFixed(2)})`);
						}
					}

					const rescueAmount = Math.abs(baseAmt) + rescueBoost;

					if (grCfg.settings.showDebugThemeLog) {
						console.log(`${Unicode.WarningSign} PROGRESS BAR BG rescue (shade): amount=${rescueAmount}%`);
					}

					return ShadeColor(bgColor, Math.round(rescueAmount));
				}
			},

			// * FUSION VALIDATOR * //
			// Validates raw primary colors against display backgrounds
			// Minimally adjusts (25-30% scale) to preserve color identity
			fusion: {
				calculateDelta: (bgLum, targetLum) => Math.abs(targetLum - bgLum),

				getMinDelta: (bgLum, ctx) => this.interpolateKeyframes(this.minContrast.accent, bgLum, 'value', t => Easing('smoothStep', t)),

				isValid: (delta, minDelta) => delta >= minDelta,

				rescue: (bgColor, bgLum, ctx, origAmt) => {
					const role = ctx.role || 'accent';
					const colorLum = ctx.colorLum || Color.LUM(bgColor);

					// Get base adjustment for the color's own luminance
					const keyframes = this.getKeyframesByRole(role);
					const baseAmount = this.interpolateKeyframes(keyframes, colorLum, 'value');
					const modified = this.applyContextModifiers(baseAmount, role, colorLum, ctx);

					// Minimal adjustment to preserve hue
					const scaleFactor = role === 'accent' ? 0.25 : 0.30;
					const adjustAmount = Math.min(Math.abs(modified) * scaleFactor, 30);

					// Determine direction
					const needsLightening = colorLum < bgLum;

					if (grCfg.settings.showDebugThemeLog) {
						console.log(`${Unicode.WarningSign} Fusion ${role}: ${needsLightening ? 'tint' : 'shade'} by ${adjustAmount.toFixed(0)}%`);
					}

					return needsLightening
						? TintColor(bgColor, Math.round(adjustAmount))
						: ShadeColor(bgColor, Math.round(adjustAmount));
				}
			}
		};

		return validators[type] || null;
	}

	/**
	 * Unified validation logic for all color types (accent, progressBarBg, fusion).
	 * Orchestrates validation by delegating to type-specific validators with rescue logic.
	 *
	 * Validation flow:
	 * 1. Calculate perceptual delta using validator's formula.
	 * 2. Get minimum required delta from interpolated contrast tables.
	 * 3. Check validity against requirements.
	 * 4. Apply rescue logic if validation fails.
	 *
	 * @param {number} bgColor - The background color (RGB).
	 * @param {number} targetColor - The color to validate (RGB).
	 * @param {number} bgLuminance - The background APCA luminance (0.0-1.0).
	 * @param {string} type - The validation type: 'accent', 'progressBar.bg', or 'fusion'.
	 * @param {Object} [context={}] - The validation context with additional parameters.
	 * @param {boolean} [context.bevel] - The flag to enable bevel style compensation.
	 * @param {boolean} [context.blend] - The flag to enable blend style compensation.
	 * @param {boolean} [context.blend2] - The flag to enable blend2 style compensation.
	 * @param {number} [context.imgLuminance] - The image luminance for blend calculations (0.0-1.0).
	 * @param {number} [context.saturation] - The color saturation for post-crossover boost (0.0-1.0).
	 * @param {string} [context.role] - THe UI element role for fusion validation.
	 * @param {number} [context.colorLum] - THe color luminance for fusion calculation.
	 * @param {number} [originalAmount] - The original keyframe amount for rescue calculation.
	 * @returns {number} The validated/rescued color (RGB).
	 *
	 * @example
	 * // Validate accent color
	 * const validAccent = apca.validateColorContrast(
	 *   RGB(50, 50, 50), RGB(100, 100, 100), 0.12, 'accent',
	 *   { bevel: true, blend2: true, imgLuminance: 0.10 }
	 * );
	 *
	 * // Validate progressBarBg with saturation boost
	 * const validBarBg = apca.validateColorContrast(
	 *   RGB(80, 80, 80), RGB(70, 70, 70), 0.15, 'progressBar.bg',
	 *   { saturation: 0.85 }
	 * );
	 */
	validateColorContrast(bgColor, targetColor, bgLuminance, type, context = {}, originalAmount = null) {
		const bgLum = Color.LUM(bgColor);
		const targetLum = Color.LUM(targetColor);
		const validator = this.getValidator(type);

		if (!validator) {
			console.log(`${Unicode.WarningSign} Unknown validation type: ${type}`);
			return targetColor;
		}

		// Calculate perceptual delta
		const delta = validator.calculateDelta(bgLum, targetLum);
		// Get minimum required delta
		const minDelta = validator.getMinDelta(bgLuminance, context);

		// Check if valid
		if (validator.isValid(delta, minDelta, bgLuminance, context)) {
			if (grCfg.settings.showDebugThemeLog) {
				console.log(`${Unicode.WhiteHeavyCheckMark} ${type}: ${Unicode.Delta}${(delta * 100).toFixed(1)}% ${Unicode.GreaterThanOrEqualTo} min ${(minDelta * 100).toFixed(0)}%`);
			}
			return targetColor;
		}

		// Apply rescue logic
		return validator.rescue(bgColor, bgLuminance, context, originalAmount);
	}
	// #endregion
}
