/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Display                                  * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////
// * DISPLAY * //
/////////////////
/**
 * A class that manages and sets the window size based on active display resolution, layout setting and player size.
 */
class Display {
	/**
	 * Creates the `Display` instance.
	 * Initializes variables to check for 4K display and to save the last used window dimensions.
	 * Sets up predefined player sizes based on active layout and display settings.
	 */
	constructor() {
		/** @public @type {boolean} Setup variable for 4K check. */
		this.sizeInitialized = false;
		/** @private @type {boolean} Setup variable for 4K check. */
		this.lastSize = undefined;
		/** @private @type {boolean} Saves last used active window width and height. */
		this.fbHandle = undefined;

		// * UIHACKS * //
		/** @public @type {boolean} UIHacks pseudo caption state, used in setWindowDrag. */
		this.pseudoCaption = false;
		/** @public @type {number} UIHacks sets pseudo caption width when dragging foobar, used in setWindowDrag. */
		this.pseudoCaptionWidth = 0;
		/** Preferences > Display > Main Window > Frame style: No border. */
		UIHacks.FrameStyle = 3;
		/** Preferences > Display > Main Window > Move with: Any method. */
		UIHacks.MoveStyle = 3;
		/** Preferences > Display > Main Window > Aero effects: Glass frame. */
		UIHacks.Aero.Effect = 2;
		/** Preferences > Display > Main Window > Aero top: 1 px fix for window drop shadow. */
		UIHacks.Aero.Top = 1;
		/** Preferences > Display > Main Window > Constraints: Disable window maximization. */
		UIHacks.BlockMaximize = false;

		/**
		 * Contains all available predefined player sizes in Georgia-ReBORN.
		 * These sizes are based on active `Options > Layout` and `Options > Display` settings.
		 * @type {{ [resolution: string]: { [size: string]: { name: string, size: string, width: number, height: number } } }}
		 * @public
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

		// * INITIALIZE 4K PROPERTY * //
		RES._4K = grSet.displayRes === '4K' || window.Width > 2560 && window.Height > 1600;
	}

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Display auto-detection used in Options > Display or for the very first foobar startup and when factory resetting the theme.
	 */
	async autoDetectRes() {
		const resetSize = async () => {
			RES._4K = false;
			RES._QHD = false;
			grSet.displayRes = 'HD';
			grSet.playerSize_4K_small = false;
			grSet.playerSize_QHD_small = false;
			grSet.playerSize_HD_small = true;
			this.setSizesFor4KorHD();
		};

		const check4k = async () => {
			this.setWindowSize(2800, 1720); // Check if player size 'Normal' for 4K can be attained
			if (grm.ui.ww > 2560 && grm.ui.wh > 1600) {
				RES._4K = true;
				RES._QHD = false;
				grSet.displayRes = '4K';
				grSet.playerSize_4K_normal = true;
				grSet.playerSize_QHD_small = false;
				grSet.playerSize_HD_small = false;
				this.setSizesFor4KorHD();
			}
		};

		const checkQHD = async () => {
			if (grm.ui.ww < 2800 && grm.ui.wh < 1720) {
				this.setWindowSize(2500, 1400); // Check if this resolution for QHD can be attained
				if (grm.ui.ww < 2500 && grm.ui.wh < 1400) { // If not, set to HD mode
					resetSize();
				}
				else { // Set to QHD mode
					RES._4K = true;
					RES._QHD = true;
					grSet.displayRes = 'QHD';
					grSet.playerSize_4K_normal = false;
					grSet.playerSize_QHD_small = true;
					grSet.playerSize_HD_small = false;
					this.setSizesForQHD();
				}
			}
		};

		const updatePanels = async () => {
			if (grSet.layout === 'default') {
				grm.display.layoutDefault();
			}
			else if (grSet.layout === 'artwork') {
				grm.display.layoutArtwork();
			}
			else if (grSet.layout === 'compact') {
				grm.display.layoutCompact();
			}
			grm.ui.initPanels();
		};

		// * Start detection
		await resetSize();
		await check4k();
		await checkQHD();
		await updatePanels();
	}

	/**
	 * Checks and sets the player size and display resolution mode.
	 * Also marks Options > Player size to 'Small', 'Normal', 'Large' if current window size matches a predefined size.
	 * Called from on_size() when window size changes.
	 */
	checkRes() {
		// * Set and update the player size based on active layout
		grSet[`savedWidth_${grSet.layout}`]  = grm.ui.ww;
		grSet[`savedHeight_${grSet.layout}`] = grm.ui.wh;

		// * Check current player size
		const res  = `${grm.ui.ww}x${grm.ui.wh}`;
		const size = this.playerSize[grSet.layout][grSet.displayRes];

		if (size) {
			const sizes = Object.values(size);
			const matchingSize = sizes.find(size => size.size === res);
			grSet.playerSize = matchingSize ? matchingSize.name : 'custom';
		}

		// * Check and set display monitor resolution mode for 4K or QHD
		RES._4K  = grSet.displayRes === '4K'  || (grm.ui.ww > 2560 && grm.ui.wh > 1600);
		RES._QHD = grSet.displayRes === 'QHD' || (grm.ui.ww > 2500 && grm.ui.ww <= 2560 && grm.ui.wh > 1400 && grm.ui.wh <= 1600);

		if (this.lastSize !== RES._4K) {
			this.sizeInitialized = false;
			this.lastSize = RES._4K;
		}

		this.setWindowSizeFix();
	}

	/**
	 * Initializes the current player size and called from setThemeSettings(), used to save player size in the config file.
	 */
	initPlayerSize() {
		if (grSet.layout === 'default') {
			grSet.savedWidth_default  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Default)');
			grSet.savedHeight_default = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Default)');
			this.setWindowSize(grSet.savedWidth_default, grSet.savedHeight_default);
		} else if (grSet.layout === 'artwork') {
			grSet.savedWidth_artwork  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Artwork)');
			grSet.savedHeight_artwork = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Artwork)');
			this.setWindowSize(grSet.savedWidth_artwork, grSet.savedHeight_artwork);
		} else if (grSet.layout === 'compact') {
			grSet.savedWidth_compact  = window.GetProperty('Georgia-ReBORN - 16. System: Saved width (Compact)');
			grSet.savedHeight_compact = window.GetProperty('Georgia-ReBORN - 16. System: Saved height (Compact)');
			this.setWindowSize(grSet.savedWidth_compact, grSet.savedHeight_compact);
		}
	}
	// #endregion

	// * PUBLIC METHODS - PLAYER SIZE * //
	// #region PUBLIC METHODS - PLAYER SIZE
	/**
	 * Sets the player size based on active display resolution mode and layout.
	 * @param {object} size - The playerSizes object containing width and height.
	 */
	setPlayerSize(size) {
		if (UIHacks.FullScreen) {
			UIHacks.FullScreen = false;
		} else if (this.fbHandle) {
			grSet.savedWidth_default  = this.fbHandle.Width;
			grSet.savedHeight_default = this.fbHandle.Height;
		}

		if (size) this.setWindowSize(size.width, size.height);
	}

	/**
	 * Sets the Default layout -> Options > Layout > Default.
	 */
	layoutDefault() {
		this.setPlayerSize(this.playerSize[grSet.layout][grSet.displayRes].small);
	}

	/**
	 * Sets the Artwork layout -> Options > Layout > Artwork.
	 */
	layoutArtwork() {
		this.setPlayerSize(this.playerSize[grSet.layout][grSet.displayRes].small);
	}

	/**
	 * Sets the Compact layout -> Options > Layout > Compact.
	 */
	layoutCompact() {
		this.setPlayerSize(this.playerSize[grSet.layout][grSet.displayRes].small);
	}

	/**
	 * Sets the player size Small for 4K res -> Options > Player size > Small.
	 */
	playerSize_4K_small() {
		this.setPlayerSize(this.playerSize[grSet.layout]['4K'].small);
	}

	/**
	 * Sets the player size Normal for 4K res -> Options > Player size > Normal.
	 */
	playerSize_4K_normal() {
		this.setPlayerSize(this.playerSize[grSet.layout]['4K'].normal);
	}

	/**
	 * Sets the player size Large for 4K res -> Options > Player size > Large.
	 */
	playerSize_4K_large() {
		this.setPlayerSize(this.playerSize[grSet.layout]['4K'].large);
	}

	/**
	 * Sets the player size Small for QHD res -> Options > Player size > Small.
	 */
	playerSize_QHD_small() {
		this.setPlayerSize(this.playerSize[grSet.layout].QHD.small);
	}

	/**
	 * Sets the player size Normal for QHD res -> Options > Player size > Normal.
	 */
	playerSize_QHD_normal() {
		this.setPlayerSize(this.playerSize[grSet.layout].QHD.normal);
	}

	/**
	 * Sets the player size Large for QHD res -> Options > Player size > Large.
	 */
	playerSize_QHD_large() {
		this.setPlayerSize(this.playerSize[grSet.layout].QHD.large);
	}

	/**
	 * Sets the player size Small for HD res -> Options > Player size > Small.
	 */
	playerSize_HD_small() {
		this.setPlayerSize(this.playerSize[grSet.layout].HD.small);
	}

	/**
	 * Sets the player size Normal for HD res -> Options > Player size > Normal.
	 */
	playerSize_HD_normal() {
		this.setPlayerSize(this.playerSize[grSet.layout].HD.normal);
	}

	/**
	 * Sets the player size Large for HD res -> Options > Player size > Large.
	 */
	playerSize_HD_large() {
		this.setPlayerSize(this.playerSize[grSet.layout].HD.large);
	}
	// #endregion

	// * PUBLIC METHODS - RESOLUTION SETTINGS * //
	// #region PUBLIC METHODS - RESOLUTION SETTINGS
	/**
	 * Sets the font and button sizes for 4K and HD display resolution.
	 */
	setSizesFor4KorHD() {
		RES._QHD = false;

		// * Main
		grSet.menuFontSize_default = 12;
		grSet.menuFontSize_artwork = 12;
		grSet.menuFontSize_compact = 12;
		grSet.lowerBarFontSize_default = 18;
		grSet.lowerBarFontSize_artwork = 16;
		grSet.lowerBarFontSize_compact = 16;
		grSet.transportButtonSize_default = 32;
		grSet.transportButtonSize_artwork = 32;
		grSet.transportButtonSize_compact = 32;

		// * Details
		grSet.gridArtistFontSize_default = 18;
		grSet.gridArtistFontSize_artwork = 18;
		grSet.gridTrackNumFontSize_default = 18;
		grSet.gridTrackNumFontSize_artwork = 18;
		grSet.gridTitleFontSize_default = 18;
		grSet.gridTitleFontSize_artwork = 18;
		grSet.gridAlbumFontSize_default = 18;
		grSet.gridAlbumFontSize_artwork = 18;
		grSet.gridKeyFontSize_default = 17;
		grSet.gridKeyFontSize_artwork = 17;
		grSet.gridValueFontSize_default = 17;
		grSet.gridValueFontSize_artwork = 17;

		// * Playlist
		grSet.playlistHeaderFontSize_default = 15;
		grSet.playlistHeaderFontSize_artwork = 15;
		grSet.playlistHeaderFontSize_compact = 15;
		grSet.playlistFontSize_default = 12;
		grSet.playlistFontSize_artwork = 12;
		grSet.playlistFontSize_compact = 12;

		if (RES._4K) {
			libSet.baseFontSize_default = 24; // * Library
			libSet.baseFontSize_artwork = 24; // * Library
			bioSet.baseFontSizeBio_default = 24; // * Biography
			bioSet.baseFontSizeBio_artwork = 24; // * Biography
		} else {
			libSet.baseFontSize_default = 12; // * Library
			libSet.baseFontSize_artwork = 12; // * Library
			bioSet.baseFontSizeBio_default = 12; // * Biography
			bioSet.baseFontSizeBio_artwork = 12; // * Biography
		}

		// * Lyrics
		grSet.lyricsFontSize_default = 20;
		grSet.lyricsFontSize_artwork = 20;
	}

	/**
	 * Sets the font and button sizes for QHD display resolution.
	 */
	setSizesForQHD() {
		RES._4K = false;
		RES._QHD = true;
		grSet.playerSize_4K_normal = false;
		grSet.playerSize_QHD_small = true;
		grSet.playerSize_HD_small  = false;

		// * Main
		grSet.menuFontSize_default = 14;
		grSet.menuFontSize_artwork = 14;
		grSet.menuFontSize_compact = 14;
		grSet.lowerBarFontSize_default = 20;
		grSet.lowerBarFontSize_artwork = 18;
		grSet.lowerBarFontSize_compact = 18;
		grSet.transportButtonSize_default = 34;
		grSet.transportButtonSize_artwork = 34;
		grSet.transportButtonSize_compact = 34;

		// * Details
		grSet.gridArtistFontSize_default = 20;
		grSet.gridArtistFontSize_artwork = 20;
		grSet.gridTrackNumFontSize_default = 20;
		grSet.gridTrackNumFontSize_artwork = 20;
		grSet.gridTitleFontSize_default = 20;
		grSet.gridTitleFontSize_artwork = 20;
		grSet.gridAlbumFontSize_default = 20;
		grSet.gridAlbumFontSize_artwork = 20;
		grSet.gridKeyFontSize_default = 19;
		grSet.gridKeyFontSize_artwork = 19;
		grSet.gridValueFontSize_default = 19;
		grSet.gridValueFontSize_artwork = 19;

		// * Playlist
		grSet.playlistHeaderFontSize_default = 17;
		grSet.playlistHeaderFontSize_artwork = 17;
		grSet.playlistHeaderFontSize_compact = 17;
		grSet.playlistFontSize_default = 14;
		grSet.playlistFontSize_artwork = 14;
		grSet.playlistFontSize_compact = 14;

		// * Library
		libSet.baseFontSize_default = 14;
		libSet.baseFontSize_artwork = 14;

		// * Biography
		bioSet.baseFontSizeBio_default = 14;
		bioSet.baseFontSizeBio_artwork = 14;

		// * Lyrics
		grSet.lyricsFontSize_default = 22;
		grSet.lyricsFontSize_artwork = 22;
	}
	// #endregion

	// * PUBLIC METHODS - WINDOW CONTROL * //
	// #region PUBLIC METHODS - WINDOW CONTROL
	/**
	 * Sets temporarily top menu caption to be able to drag foobar around.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	setWindowDrag(x, y) {
		// * Disable mouse middle btn (wheel) to be able to use Library & Biography mouse middle actions
		UIHacks.MoveStyle = grm.ui.displayLibrary && mouseInLibrary(x, y) || grm.ui.displayBiography && mouseInBiography(x, y) ? 0 : 3;
		try {
			if (grm.button.mouseInControl || grm.button.downButton) {
				UIHacks.SetPseudoCaption(0, 0, 0, 0);
				if (UIHacks.FrameStyle === 3) UIHacks.DisableSizing = true;
				this.pseudoCaption = false;
			}
			else if (!this.pseudoCaption || this.pseudoCaptionWidth !== grm.ui.ww) {
				UIHacks.SetPseudoCaption(0, 0, grm.ui.ww, grSet.layout !== 'default' ? grm.ui.topMenuHeight + SCALE(5) : grm.ui.topMenuHeight);
				if (UIHacks.FrameStyle === 3 && !grSet.lockPlayerSize) UIHacks.DisableSizing = false;
				this.pseudoCaption = true;
				this.pseudoCaptionWidth = grm.ui.ww;
			}
		} catch (e) {}
	}

	/**
	 * Sets the window size via UIHacks.
	 * @param {number} width - The window width.
	 * @param {number} height - The window height.
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
	 * @returns {boolean} Whether the window size needs to be fixed.
	 */
	setWindowSizeFix() {
		this.setWindowSizeLimitsForLayouts(grSet.layout);

		const lastW = this.fbHandle ? this.fbHandle.Width : '';
		const lastH = this.fbHandle ? this.fbHandle.Height : '';
		const systemFirstLaunch = !this.fbHandle ? grSet.systemFirstLaunch : '';

		return this.fbHandle ? lastW !== this.fbHandle.Width || lastH !== this.fbHandle.Height : systemFirstLaunch;
	}

	/**
	 * Sets the minimum and maximum sizes of the window based on different screen resolutions.
	 * @param {number} min_w - The minimum width.
	 * @param {number} max_w - The maximum width.
	 * @param {number} min_h - The minimum height.
	 * @param {number} max_h - The maximum height.
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
		const size = this.playerSize[grSet.layout][grSet.displayRes];

		min_w = size && size.small.width
		min_h = size && size.small.height;

		this.setWindowSizeLimits(min_w, max_w, min_h, max_h);
	}
	// #endregion
}
