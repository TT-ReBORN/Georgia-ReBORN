/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Display                              * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-12-18                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {number} Default display dots per inch setting. */
let DPI = 96;
/** @type {boolean} State variable for 4K resolution. */
let RES_4K = false;
/** @type {boolean} State variable for QHD resolution. */
let RES_QHD = false;
/** @type {boolean} Setup variable for 4K check. */
let sizeInitialized = false;
/** @type {boolean} Setup variable for 4K check. */
let lastSize;

// * Check and set the actual display DPI number via reading the Windows registry value.
try { DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI'); } catch (e) {}


/////////////////
// * HELPERS * //
/////////////////
/**
 * NOT USED AT THE MOMENT.
 * Converts a size value from points to pixels using the DPI value.
 * @param {number} size The size in pixels.
 * @returns {number} The size in points.
 */
function Scale(size) {
	return Math.round(size * DPI / 72);
}


/**
 * Scales the value based on 4K mode or not.
 * @param {number} val The value that needs to be scaled for 4K resolution.
 * @returns {number} The value doubled.
 */
function SCALE(val) {
	return RES_4K ? val * 2 : val;
}


/////////////////
// * DISPLAY * //
/////////////////
/**
 * Manages and sets the window size based on active display resolution, layout setting and player size.
 * @type {Object} Sets the windows size via UIHacks.
 */
class Display {
	/**
	 * @class
	 */
	constructor() {
		/**
		 * Saves last used active window width and height.
		 */
		this.fbHandle = '';

		/**
		 * Contains all available predefined player sizes in Georgia-ReBORN.
		 * Based on active `Options > Layout` and `Options > Display` settings.
		 * @type {Object}
		 */
		this.playerSize = {
			default: {
				'4K': {
					small:  { name: 'small',  size: '2300x1470', width: 2300, height: 1470 },
					normal: { name: 'normal', size: '2800x1720', width: 2800, height: 1720 },
					large:  { name: 'large',  size: '3400x2020', width: 3400, height: 2020 }
				},
				'QHD': {
					small:  { name: 'small',  size: '1280x800',  width: 1280, height: 800  },
					normal: { name: 'normal', size: '1802x1061', width: 1802, height: 1061 },
					large:  { name: 'large',  size: '2280x1300', width: 2280, height: 1300 }
				},
				'HD': {
					small:  { name: 'small',  size: '1140x730',  width: 1140, height: 730  },
					normal: { name: 'normal', size: '1600x960',  width: 1600, height: 960  },
					large:  { name: 'large',  size: '1802x1061', width: 1802, height: 1061 }
				}
			},
			artwork: {
				'4K': {
					small:  { name: 'small',  size: '1052x1372', width: 1052, height: 1372 },
					normal: { name: 'normal', size: '1400x1720', width: 1400, height: 1720 },
					large:  { name: 'large',  size: '1699x2020', width: 1699, height: 2020 }
				},
				'QHD': {
					small:  { name: 'small',  size: '640x800',   width: 640,  height: 800  },
					normal: { name: 'normal', size: '901x1061',  width: 901,  height: 1061 },
					large:  { name: 'large',  size: '1140x1300', width: 1140, height: 1300 }
				},
				'HD': {
					small:  { name: 'small',  size: '526x686',  width: 526, height: 686  },
					normal: { name: 'normal', size: '700x860',  width: 700, height: 860  },
					large:  { name: 'large',  size: '901x1062', width: 901, height: 1062 }
				}
			},
			compact: {
				'4K': {
					small:  { name: 'small',  size: '964x1470',  width: 964,  height: 1470 },
					normal: { name: 'normal', size: '964x1720',  width: 964,  height: 1720 },
					large:  { name: 'large',  size: '2800x1720', width: 2800, height: 1720 }
				},
				'QHD': {
					small:  { name: 'small',  size: '540x800',   width: 540,  height: 800  },
					normal: { name: 'normal', size: '540x1061',  width: 540,  height: 1061 },
					large:  { name: 'large',  size: '2080x1300', width: 2080, height: 1300 }
				},
				'HD': {
					small:  { name: 'small',  size: '484x730',  width: 484,  height: 730 },
					normal: { name: 'normal', size: '484x960',  width: 484,  height: 960 },
					large:  { name: 'large',  size: '1600x960', width: 1600, height: 960 }
				}
			}
		};
	}

	// * INITIALIZATION * //

	/**
	 * Display auto-detection used in Options > Display or for the very first foobar startup and when factory resetting the theme.
	 */
	async autoDetectRes() {
		const resetSize = async () => {
			RES_4K = false;
			RES_QHD = false;
			pref.displayRes = 'HD';
			pref.playerSize_4K_small = false;
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small = true;
			this.setSizesFor4KorHD();
		};

		const check4k = async () => {
			this.setWindowSize(2800, 1720); // Check if player size 'Normal' for 4K can be attained
			if (ww > 2560 && wh > 1600) {
				RES_4K = true;
				RES_QHD = false;
				pref.displayRes = '4K';
				pref.playerSize_4K_normal = true;
				pref.playerSize_QHD_small = false;
				pref.playerSize_HD_small = false;
				this.setSizesFor4KorHD();
			}
		};

		const checkQHD = async () => {
			if (ww < 2800 && wh < 1720) {
				this.setWindowSize(2500, 1400); // Check if this resolution for QHD can be attained
				if (ww < 2500 && wh < 1400) { // If not, set to HD mode
					resetSize();
				}
				else { // Set to QHD mode
					RES_4K = true;
					RES_QHD = true;
					pref.displayRes = 'QHD';
					pref.playerSize_4K_normal = false;
					pref.playerSize_QHD_small = true;
					pref.playerSize_HD_small = false;
					this.setSizesForQHD();
				}
			}
		};

		const updatePanels = async () => {
			if (pref.layout === 'default') {
				display.layoutDefault();
			}
			else if (pref.layout === 'artwork') {
				display.layoutArtwork();
			}
			else if (pref.layout === 'compact') {
				display.layoutCompact();
			}
			initPanels();
		};

		// * Start detection
		await resetSize();
		await check4k();
		await checkQHD();
		await updatePanels();
	}

	/**
	 * Checks and sets the player size and display resolution mode.
	 * Also marks Options > Player size to 'Small', 'Normal', 'Large' if current window size matches a predfined size.
	 * Called from on_size() when window size changes.
	 */
	checkRes() {
		// * Set and update the player size based on active layout
		pref[`savedWidth_${pref.layout}`]  = ww;
		pref[`savedHeight_${pref.layout}`] = wh;

		// * Check current player size
		const res  = `${ww}x${wh}`;
		const size = this.playerSize[pref.layout][pref.displayRes];

		if (size) {
			const sizes = Object.values(size);
			const matchingSize = sizes.find(size => size.size === res);
			pref.playerSize = matchingSize ? matchingSize.name : 'custom';
		}

		// * Check and set display monitor resolution mode for 4K or QHD
		RES_4K  = pref.displayRes === '4K'  || (ww > 2560 && wh > 1600);
		RES_QHD = pref.displayRes === 'QHD' || (ww > 2500 && ww <= 2560 && wh > 1400 && wh <= 1600);

		if (lastSize !== RES_4K) {
			sizeInitialized = false;
			lastSize = RES_4K;
		}

		this.setWindowSizeFix();
	}

	/**
	 * Initializes the current player size and called from setThemeSettings(), used to save player size in the config file.
	 */
	initPlayerSize() {
		if (pref.layout === 'default') {
			pref.savedWidth_default  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Default)');
			pref.savedHeight_default = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Default)');
			this.setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
		} else if (pref.layout === 'artwork') {
			pref.savedWidth_artwork  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Artwork)');
			pref.savedHeight_artwork = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Artwork)');
			this.setWindowSize(pref.savedWidth_artwork, pref.savedHeight_artwork);
		} else if (pref.layout === 'compact') {
			pref.savedWidth_compact  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Compact)');
			pref.savedHeight_compact = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Compact)');
			this.setWindowSize(pref.savedWidth_compact, pref.savedHeight_compact);
		}
	}

	// * PLAYER SIZE * //

	/**
	 * Sets the player size based on active display resolution mode and layout.
	 * @param {object} size The playerSizes object containing width and height.
	 */
	setPlayerSize(size) {
		if (UIHacks.FullScreen) {
			UIHacks.FullScreen = false;
		} else if (this.fbHandle) {
			pref.savedWidth_default  = this.fbHandle.Width;
			pref.savedHeight_default = this.fbHandle.Height;
		}

		if (size) this.setWindowSize(size.width, size.height);
	}

	/**
	 * Sets the Default layout -> Options > Layout > Default.
	 */
	layoutDefault() {
		this.setPlayerSize(this.playerSize[pref.layout][pref.displayRes].small);
	}

	/**
	 * Sets the Artwork layout -> Options > Layout > Artwork.
	 */
	layoutArtwork() {
		this.setPlayerSize(this.playerSize[pref.layout][pref.displayRes].small);
	}

	/**
	 * Sets the Compact layout -> Options > Layout > Compact.
	 */
	layoutCompact() {
		this.setPlayerSize(this.playerSize[pref.layout][pref.displayRes].small);
	}

	/**
	 * Sets the player size Small for 4K res -> Options > Player size > Small.
	 */
	playerSize_4K_small() {
		this.setPlayerSize(this.playerSize[pref.layout]['4K'].small);
	}

	/**
	 * Sets the player size Normal for 4K res -> Options > Player size > Normal.
	 */
	playerSize_4K_normal() {
		this.setPlayerSize(this.playerSize[pref.layout]['4K'].normal);
	}

	/**
	 * Sets the player size Large for 4K res -> Options > Player size > Large.
	 */
	playerSize_4K_large() {
		this.setPlayerSize(this.playerSize[pref.layout]['4K'].large);
	}

	/**
	 * Sets the player size Small for QHD res -> Options > Player size > Small.
	 */
	playerSize_QHD_small() {
		this.setPlayerSize(this.playerSize[pref.layout].QHD.small);
	}

	/**
	 * Sets the player size Normal for QHD res -> Options > Player size > Normal.
	 */
	playerSize_QHD_normal() {
		this.setPlayerSize(this.playerSize[pref.layout].QHD.normal);
	}

	/**
	 * Sets the player size Large for QHD res -> Options > Player size > Large.
	 */
	playerSize_QHD_large() {
		this.setPlayerSize(this.playerSize[pref.layout].QHD.large);
	}

	/**
	 * Sets the player size Small for HD res -> Options > Player size > Small.
	 */
	playerSize_HD_small() {
		this.setPlayerSize(this.playerSize[pref.layout].HD.small);
	}

	/**
	 * Sets the player size Normal for HD res -> Options > Player size > Normal.
	 */
	playerSize_HD_normal() {
		this.setPlayerSize(this.playerSize[pref.layout].HD.normal);
	}

	/**
	 * Sets the player size Large for HD res -> Options > Player size > Large.
	 */
	playerSize_HD_large() {
		this.setPlayerSize(this.playerSize[pref.layout].HD.large);
	}

	// * RESOLUTION SETTINGS * //

	/**
	 * Sets the font and button sizes for 4K and HD display resolution.
	 */
	setSizesFor4KorHD() {
		RES_QHD = false;

		// * Main
		pref.menuFontSize_default = 12;
		pref.menuFontSize_artwork = 12;
		pref.menuFontSize_compact = 12;
		pref.lowerBarFontSize_default = 18;
		pref.lowerBarFontSize_artwork = 16;
		pref.lowerBarFontSize_compact = 16;
		pref.transportButtonSize_default = 32;
		pref.transportButtonSize_artwork = 32;
		pref.transportButtonSize_compact = 32;

		// * Details
		pref.gridArtistFontSize_default = 18;
		pref.gridArtistFontSize_artwork = 18;
		pref.gridTrackNumFontSize_default = 18;
		pref.gridTrackNumFontSize_artwork = 18;
		pref.gridTitleFontSize_default = 18;
		pref.gridTitleFontSize_artwork = 18;
		pref.gridAlbumFontSize_default = 18;
		pref.gridAlbumFontSize_artwork = 18;
		pref.gridKeyFontSize_default = 17;
		pref.gridKeyFontSize_artwork = 17;
		pref.gridValueFontSize_default = 17;
		pref.gridValueFontSize_artwork = 17;

		// * Playlist
		pref.playlistHeaderFontSize_default = 15;
		pref.playlistHeaderFontSize_artwork = 15;
		pref.playlistHeaderFontSize_compact = 15;
		pref.playlistFontSize_default = 12;
		pref.playlistFontSize_artwork = 12;
		pref.playlistFontSize_compact = 12;

		if (RES_4K) {
			ppt.baseFontSize_default = 24; // * Library
			ppt.baseFontSize_artwork = 24; // * Library
			pptBio.baseFontSizeBio_default = 24; // * Biography
			pptBio.baseFontSizeBio_artwork = 24; // * Biography
		} else {
			ppt.baseFontSize_default = 12; // * Library
			ppt.baseFontSize_artwork = 12; // * Library
			pptBio.baseFontSizeBio_default = 12; // * Biography
			pptBio.baseFontSizeBio_artwork = 12; // * Biography
		}

		// * Lyrics
		pref.lyricsFontSize_default = 20;
		pref.lyricsFontSize_artwork = 20;
	}

	/**
	 * Sets the font and button sizes for QHD display resolution.
	 */
	setSizesForQHD() {
		RES_4K = false;
		RES_QHD = true;
		pref.playerSize_4K_normal = false;
		pref.playerSize_QHD_small = true;
		pref.playerSize_HD_small  = false;

		// * Main
		pref.menuFontSize_default = 14;
		pref.menuFontSize_artwork = 14;
		pref.menuFontSize_compact = 14;
		pref.lowerBarFontSize_default = 20;
		pref.lowerBarFontSize_artwork = 18;
		pref.lowerBarFontSize_compact = 18;
		pref.transportButtonSize_default = 34;
		pref.transportButtonSize_artwork = 34;
		pref.transportButtonSize_compact = 34;

		// * Details
		pref.gridArtistFontSize_default = 20;
		pref.gridArtistFontSize_artwork = 20;
		pref.gridTrackNumFontSize_default = 20;
		pref.gridTrackNumFontSize_artwork = 20;
		pref.gridTitleFontSize_default = 20;
		pref.gridTitleFontSize_artwork = 20;
		pref.gridAlbumFontSize_default = 20;
		pref.gridAlbumFontSize_artwork = 20;
		pref.gridKeyFontSize_default = 19;
		pref.gridKeyFontSize_artwork = 19;
		pref.gridValueFontSize_default = 19;
		pref.gridValueFontSize_artwork = 19;

		// * Playlist
		pref.playlistHeaderFontSize_default = 17;
		pref.playlistHeaderFontSize_artwork = 17;
		pref.playlistHeaderFontSize_compact = 17;
		pref.playlistFontSize_default = 14;
		pref.playlistFontSize_artwork = 14;
		pref.playlistFontSize_compact = 14;

		// * Library
		ppt.baseFontSize_default = 14;
		ppt.baseFontSize_artwork = 14;

		// * Biography
		pptBio.baseFontSizeBio_default = 14;
		pptBio.baseFontSizeBio_artwork = 14;

		// * Lyrics
		pref.lyricsFontSize_default = 22;
		pref.lyricsFontSize_artwork = 22;
	}

	// * WINDOW CONTROL * //

	/**
	 * Sets temporarily top menu caption to be able to drag foobar around.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	setWindowDrag(x, y) {
		if (!componentUIHacks) return;
		// * Disable mouse middle btn (wheel) to be able to use Library & Biography mouse middle actions
		UIHacks.MoveStyle = displayLibrary && mouseInLibrary(x, y) || displayBiography && mouseInBiography(x, y) ? 0 : 3;
		try {
			if (mouseInControl || downButton) {
				UIHacks.SetPseudoCaption(0, 0, 0, 0);
				if (UIHacks.FrameStyle === 3) UIHacks.DisableSizing = true;
				pseudoCaption = false;
			}
			else if (!pseudoCaption || pseudoCaptionWidth !== ww) {
				UIHacks.SetPseudoCaption(0, 0, ww, pref.layout !== 'default' ? geo.topMenuHeight + SCALE(5) : geo.topMenuHeight);
				if (UIHacks.FrameStyle === 3 && !pref.lockPlayerSize) UIHacks.DisableSizing = false;
				pseudoCaption = true;
				pseudoCaptionWidth = ww;
			}
		} catch (e) {}
	}

	/**
	 * Sets the window size via UIHacks.
	 * @param {number} width The window width.
	 * @param {number} height The window height.
	 */
	setWindowSize(width, height) {
		// * Avoid resizing bugs, when the window is bigger\smaller than the saved one.
		UIHacks.MinSize.Enabled = false;
		UIHacks.MaxSize.Enabled = false;
		UIHacks.MinSize.Width   = width;
		UIHacks.MinSize.Height  = height;
		UIHacks.MaxSize.Width   = width;
		UIHacks.MaxSize.Height  = height;

		UIHacks.MaxSize.Enabled = true;
		UIHacks.MaxSize.Enabled = false;
		UIHacks.MinSize.Enabled = true;
		UIHacks.MinSize.Enabled = false;
	}

	/**
	 * Sets and forces window size limits based on layout and display resolution, also fixes window size for messed up settings or properties.
	 * @return {boolean} Whether the window size needs to be fixed.
	 */
	setWindowSizeFix() {
		this.setWindowSizeLimitsForLayouts(pref.layout);

		const lastW = this.fbHandle ? this.fbHandle.Width : '';
		const lastH = this.fbHandle ? this.fbHandle.Height : '';
		const systemFirstLaunch = !this.fbHandle ? pref.systemFirstLaunch : '';

		return this.fbHandle ? lastW !== this.fbHandle.Width || lastH !== this.fbHandle.Height : systemFirstLaunch;
	}

	/**
	 * Sets the minimum and maximum sizes of the window based on different screen resolutions.
	 * @param {number} min_w The minimum width.
	 * @param {number} max_w The maximum width.
	 * @param {number} min_h The minimum height.
	 * @param {number} max_h The maximum height.
	 */
	setWindowSizeLimits(min_w, max_w, min_h, max_h) {
		UIHacks.MinSize.Enabled = !!min_w;
		UIHacks.MinSize.Width   =   min_w;

		UIHacks.MaxSize.Enabled = !!max_w;
		UIHacks.MaxSize.Width   =   max_w;

		UIHacks.MinSize.Enabled = !!min_h;
		UIHacks.MinSize.Height  =   min_h;

		UIHacks.MaxSize.Enabled = !!max_h;
		UIHacks.MaxSize.Height  =   max_h;
	}

	/**
	 * Sets the window size limits for each layout.
	 */
	setWindowSizeLimitsForLayouts() {
		let min_w = 0; const max_w = 0;
		let min_h = 0; const max_h = 0;
		const size = this.playerSize[pref.layout][pref.displayRes];

		min_w = size && size.small.width
		min_h = size && size.small.height;

		this.setWindowSizeLimits(min_w, max_w, min_h, max_h);
	}
}

/** @type {Object} Creates the Display handler object. */
const display = new Display();
