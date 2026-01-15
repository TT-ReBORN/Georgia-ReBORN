/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Display                                  * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    15-01-2026                                              * //
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
		/** @private @type {object} Saves last used active window width and height. */
		this.lastPlayerSize = { w: window.Width, h: window.Height };

		// * UI WIZARD * //
		/** @public @type {boolean} UI Wizard pseudo caption state, used in setWindowDrag. */
		this.pseudoCaption = false;
		/** @public @type {number} UI Wizard sets pseudo caption width when dragging foobar, used in setWindowDrag. */
		this.pseudoCaptionWidth = 0;
		/** Preferences > Display > UI Wizard > Frame style: No border. */
		UIWizard.FrameStyle = 3;
		/** Preferences > Display > UI Wizard > Move with: Any method. */
		UIWizard.MoveStyle = 3;
		/** Preferences > Display > UI Wizard > Constraints: Disable window maximizing. */
		UIWizard.DisableWindowMaximizing = false;

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

		// * INITIALIZE * //
		grm.ui.ww = window.Width;  // These are actually only needed here for cosmetic reasons: to update child window when the user changes the hardcoded frame style to 3 (NoBorder).
		grm.ui.wh = window.Height; // These are actually only needed here for cosmetic reasons: to update child window when the user changes the hardcoded frame style to 3 (NoBorder).
		RES._4K = grSet.displayRes === '4K' || window.Width > 2560 && window.Height > 1600;
		this.setWindowSizeLimitsForLayouts(window.Width, window.Height);
	}

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Display auto-detection used in Options > Display or for the very first foobar startup and when factory resetting the theme.
	 * @returns {Promise<void>} A promise that resolves when the initialization has finished.
	 */
	async autoDetectRes() {
		const displayModeUIW = UIWizard.DisplayResolutionMode || 'HD';
		const displayMode = ['4K', 'QHD', 'HD'].includes(displayModeUIW) ? displayModeUIW : '4K';

		RES._4K = displayMode === '4K';
		RES._QHD = displayMode === 'QHD';
		grSet.displayRes = displayMode;

		this.setSizesForDisplay();

		setTimeout(() => {
			this.setPlayerSize('small');
			grm.ui.initPanels();
		}, 1);
	}

	/**
	 * Checks and sets the player size and display resolution mode.
	 * Also marks Options > Player size to 'Small', 'Normal', 'Large' if current window size matches a predefined size.
	 * Called from on_size() when window size changes.
	 */
	checkRes() {
		// * Set and update the player size based on active layout
		grSet.savedWidth_layout = grm.ui.ww;
		grSet.savedHeight_layout = grm.ui.wh;

		// * Check current player size
		const res  = `${grm.ui.ww}x${grm.ui.wh}`;
		const size = this.playerSize[grSet.layout][grSet.displayRes];

		if (size) {
			const sizes = Object.values(size);
			const matchingSize = sizes.find(size => size.size === res);
			grSet.playerSize = matchingSize ? matchingSize.name : 'custom';
		}

		// * Check and set display monitor resolution mode for 4K or QHD
		RES._4K  = grSet.displayRes === '4K'  || UIWizard.DisplayResolutionMode === '4K';
		RES._QHD = grSet.displayRes === 'QHD' || UIWizard.DisplayResolutionMode === 'QHD';

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
		const layout = { default: 'Default', artwork: 'Artwork', compact: 'Compact' };
		const layoutStr = layout[grSet.layout] || layout.default;

		const ww = grSet[`savedWidth_${grSet.layout}`]  = window.GetProperty(`Georgia-ReBORN - 16. System: Saved layout width (${layoutStr})`);
		const wh = grSet[`savedHeight_${grSet.layout}`] = window.GetProperty(`Georgia-ReBORN - 16. System: Saved layout height (${layoutStr})`);

		this.setWindowSize(ww, wh);
	}
	// #endregion

	// * PUBLIC METHODS - PLAYER SIZE * //
	// #region PUBLIC METHODS - PLAYER SIZE
	/**
	 * Checks and returns the size ('small', 'normal', 'large') based on the given width, height, layout, and resolution.
	 * @param {number} width - The window width to check.
	 * @param {number} height - The window height to check.
	 * @param {string} layout - The layout to check in the playerSize table.
	 * @param {string} resolution - The resolution to check in the playerSize table.
	 * @returns {string|null} - Returns 'small', 'normal', 'large' if a match is found, otherwise null.
	 * @example
	 * this.checkPlayerSize(window.Width, window.Height, 'default', '4K');
	 */
	checkPlayerSize(width, height, layout, resolution) {
		const sizes = this.playerSize[layout] && this.playerSize[layout][resolution];

		if (width > sizes.normal.width && height > sizes.normal.height) {
			return 'large';
		}
		else if (width > sizes.small.width && height > sizes.small.height) {
			return 'normal';
		}
		else {
			return 'small';
		}
	}

	/**
	 * Gets the player size from the table of this.playerSize object based on the current display resolution and layout.
	 * @param {string} sizeName - The size name - 'small', 'normal', 'large'.
	 * @returns {{ width: number, height: number }} The player size dimensions.
	 */
	getPlayerSize(sizeName) {
		const { width, height } = this.playerSize[grSet.layout][grSet.displayRes][sizeName];
		const scaled = grSet.displayScale !== 100;
		const scaleFactor = RES._4K ? 0.5 : 1; // Need to halve the scale factor for 4K to prevent double scaling

		return {
			width:  scaled ? SCALE(width  * scaleFactor) : width,
			height: scaled ? SCALE(height * scaleFactor) : height
		};
	}

	/**
	 * Checks if the player size has changed since the last check.
	 * @returns {boolean} - Returns `true` if the player size has changed, otherwise `false`.
	 */
	hasPlayerSizeChanged() {
		const currentWidth = grm.ui.ww;
		const currentHeight = grm.ui.wh;

		if (this.lastPlayerSize.w === currentWidth && this.lastPlayerSize.h === currentHeight) {
			return false;
		}

		this.lastPlayerSize = { w: currentWidth, h: currentHeight };
		return true;
	}

	/**
	 * Sets the player size based on active display resolution mode and layout.
	 * @param {string} sizeName - The size name - 'small', 'normal', 'large'.
	 */
	setPlayerSize(sizeName) {
		if (!sizeName) return;

		if (UIWizard.WindowState === WindowState.FullScreen) {
			UIWizard.ExitFullscreen();
		} else {
			grSet.savedWidth_default = this.lastPlayerSize.w = window.Width;
			grSet.savedHeight_default = this.lastPlayerSize.h = window.Height;
		}

		const size = this.getPlayerSize(sizeName);
		this.setWindowSize(size.width, size.height);
	}

	/**
	 * Updates and resizes the player size based on player size name.
	 * @param {string} sizeName - The size name - 'small', 'normal', 'large'.
	 * @param {boolean} setSizesForDisplay - Sets the font and button sizes for the current display resolution mode.
	 */
	updatePlayerSize(sizeName, setSizesForDisplay) {
		this.sizeInitialized = false;
		if (setSizesForDisplay) this.setSizesForDisplay();
		this.setPlayerSize(sizeName);
		this.setWindowSizeLimitsForLayouts(window.Width, window.Height);
		grm.ui.clearCache('metrics');
		grm.details.clearCache('metrics');
		PlaylistHeader.img_cache.clear();
	}
	// #endregion

	// * PUBLIC METHODS - RESOLUTION SETTINGS * //
	// #region PUBLIC METHODS - RESOLUTION SETTINGS
	/**
	 * Sets the font and button sizes for the current display resolution mode.
	 */
	setSizesForDisplay() {
		// * Main
		grSet.menuFontSize_default = HD_QHD_4K(12, 14);
		grSet.menuFontSize_artwork = HD_QHD_4K(12, 14);
		grSet.menuFontSize_compact = HD_QHD_4K(12, 14);
		grSet.lowerBarFontSize_default = HD_QHD_4K(18, 20);
		grSet.lowerBarFontSize_artwork = HD_QHD_4K(16, 18);
		grSet.lowerBarFontSize_compact = HD_QHD_4K(16, 18);
		grSet.transportButtonSize_default = HD_QHD_4K(32, 34);
		grSet.transportButtonSize_artwork = HD_QHD_4K(32, 34);
		grSet.transportButtonSize_compact = HD_QHD_4K(32, 34);

		// * Details
		grSet.gridArtistFontSize_default = HD_QHD_4K(18, 20);
		grSet.gridArtistFontSize_artwork = HD_QHD_4K(18, 20);
		grSet.gridTrackNumFontSize_default = HD_QHD_4K(18, 20);
		grSet.gridTrackNumFontSize_artwork = HD_QHD_4K(18, 20);
		grSet.gridTitleFontSize_default = HD_QHD_4K(18, 20);
		grSet.gridTitleFontSize_artwork = HD_QHD_4K(18, 20);
		grSet.gridAlbumFontSize_default = HD_QHD_4K(18, 20);
		grSet.gridAlbumFontSize_artwork = HD_QHD_4K(18, 20);
		grSet.gridKeyFontSize_default = HD_QHD_4K(17, 19);
		grSet.gridKeyFontSize_artwork = HD_QHD_4K(17, 19);
		grSet.gridValueFontSize_default = HD_QHD_4K(17, 19);
		grSet.gridValueFontSize_artwork = HD_QHD_4K(17, 19);

		// * Playlist
		grSet.playlistHeaderFontSize_default = HD_QHD_4K(15, 17);
		grSet.playlistHeaderFontSize_artwork = HD_QHD_4K(15, 17);
		grSet.playlistHeaderFontSize_compact = HD_QHD_4K(15, 17);
		grSet.playlistFontSize_default = HD_QHD_4K(12, 14);
		grSet.playlistFontSize_artwork = HD_QHD_4K(12, 14);
		grSet.playlistFontSize_compact = HD_QHD_4K(12, 14);

		// * Library
		grSet.libraryFontSize_default = HD_QHD_4K(12, 14);
		grSet.libraryFontSize_artwork = HD_QHD_4K(12, 14);

		// * Biography
		grSet.biographyFontSize_default = HD_QHD_4K(12, 14);
		grSet.biographyFontSize_artwork = HD_QHD_4K(12, 14);

		// * Lyrics
		grSet.lyricsFontSize_default = HD_QHD_4K(20, 22);
		grSet.lyricsFontSize_artwork = HD_QHD_4K(20, 22);
	}
	// #endregion

	// * PUBLIC METHODS - SCALING - CONTROL * //
	// #region PUBLIC METHODS - SCALING - CONTROL
	/**
	 * Handles display scale adjustments based on key actions.
	 * @param {string} action - The action to perform ('increase', 'decrease', 'reset').
	 */
	handleDisplayScaleKeyAction(action) {
		const scales = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150];
		let currentScaleIndex = scales.indexOf(grSet.displayScale);

		if (action === 'reset') {
			grSet.displayScale = 100;
		} else {
			if (action === 'increase') {
				currentScaleIndex = Math.min(currentScaleIndex + 1, scales.length - 1);
			}
			else if (action === 'decrease') {
				currentScaleIndex = Math.max(currentScaleIndex - 1, 0);
			}
			grSet.displayScale = scales[currentScaleIndex];
		}

		const size = this.checkPlayerSize(grm.ui.ww, grm.ui.wh, grSet.layout, grSet.displayRes);
		this.updatePlayerSize(size, true);
	}
	// #endregion

	// * PUBLIC METHODS - SCALING - FONT SIZES * //
	// #region PUBLIC METHODS - SCALING - FONT SIZES
	/**
	 * Sets the top menu font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setMenuFontSize(size) {
		const currentSize = grSet.menuFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 8),
			'1' : () => Math.min(currentSize + 1, 16),
			'0' : () => HD_QHD_4K(12, 14)
		};
		const newSize = getSize[size] || (() => size);
		grSet.menuFontSize_layout = newSize();

		grm.ui.createFonts();
		grm.button.createButtons(grm.ui.ww, grm.ui.wh);
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the lower bar font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setLowerBarFontSize(size) {
		const currentSize = grSet.lowerBarFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 26),
			'0' : () => HD_QHD_4K(18, 20)
		};
		const newSize = getSize[size] || (() => size);
		grSet.lowerBarFontSize_layout = newSize();

		grm.ui.clearCache('metrics');
		grm.ui.createFonts();
		grm.button.createButtons(grm.ui.ww, grm.ui.wh);
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the notification area font size directly to the specified size.
	 * @param {number} size - The new font size for the notification area.
	 */
	setNotificationFontSize(size) {
		grSet.notificationFontSize_layout = size;
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the popup font size directly to the specified size.
	 * @param {number} size - The new font size for popups.
	 */
	setPopupFontSize(size) {
		grSet.popupFontSize_layout = size;
		grm.ui.createFonts();
		if (grm.ui.displayCustomThemeMenu) {
			grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg');
		} else if (grm.ui.displayMetadataGridMenu) {
			grm.ui.gridMenu.initMetadataGridMenu();
		}
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the tooltip font size directly to the specified size.
	 * @param {number} size - The new font size for tooltips.
	 */
	setTooltipFontSize(size) {
		grSet.tooltipFontSize_layout = size;
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the metadata grid artist font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setGridArtistFontSize(size) {
		const currentSize = grSet.gridArtistFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 24),
			'0' : () => HD_QHD_4K(18, 20)
		};
		const newSize = getSize[size] || (() => size);
		grSet.gridArtistFontSize_layout = newSize();

		grm.details.clearCache('metrics');
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the metadata grid title font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setGridTitleFontSize(size) {
		const currentSize = grSet.gridTitleFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 24),
			'0' : () => HD_QHD_4K(18, 20)
		};
		const newSize = getSize[size] || (() => size);
		grSet.gridTrackNumFontSize_layout = grSet.gridTitleFontSize_layout = newSize();

		grm.details.clearCache('metrics');
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the metadata grid album font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setGridAlbumFontSize(size) {
		const currentSize = grSet.gridAlbumFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 24),
			'0' : () => HD_QHD_4K(18, 20)
		};
		const newSize = getSize[size] || (() => size);
		grSet.gridAlbumFontSize_layout = newSize();

		grm.details.clearCache('metrics');
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the metadata grid tag key font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setGridTagKeyFontSize(size) {
		const currentSize = grSet.gridKeyFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 24),
			'0' : () => HD_QHD_4K(17, 19)
		};
		const newSize = getSize[size] || (() => size);
		grSet.gridKeyFontSize_layout = newSize();

		grm.details.clearCache('metrics');
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the metadata grid tag value font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setGridTagValueFontSize(size) {
		const currentSize = grSet.gridValueFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 24),
			'0' : () => HD_QHD_4K(17, 19)
		};
		const newSize = getSize[size] || (() => size);
		grSet.gridValueFontSize_layout = newSize();

		grm.details.clearCache('metrics');
		grm.ui.createFonts();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the Playlist size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setPlaylistFontSize(size) {
		const currentSize = grSet.playlistHeaderFontSize_layout;
		const getSize = {
			'-1': () => ({
				headerSize: Math.max(currentSize - 1, 10),
				fontSize: Math.max(currentSize - 3, 8)
			}),
			'1': () => ({
				headerSize: Math.min(currentSize + 1, 26),
				fontSize: Math.min(currentSize - 1, 24)
			}),
			'0': () => ({
				headerSize: HD_QHD_4K(15, 17),
				fontSize: HD_QHD_4K(12, 14)
			})
		};
		const newSize = getSize[size] || (() => ({ headerSize: size, fontSize: size - (size === 15 || size === 17 ? 3 : 2) }));
		grSet.playlistHeaderFontSize_layout = newSize().headerSize;
		grSet.playlistFontSize_layout = newSize().fontSize;

		grm.ui.createFonts();
		grm.button.createButtons(grm.ui.ww, grm.ui.wh);

		PlaylistRescale(true);
		PlaylistHeader.img_cache.clear();
		grm.ui.initPlaylist();
		grm.ui.setPlaylistSize();
		if (grSet.libraryThumbnailSize === 'playlist') grm.ui.setLibrarySize();
		if (grSet.libraryLayout === 'split') {
			lib.pop.createImages();
			lib.panel.zoomReset();
		}
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the Library font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setLibraryFontSize(size) {
		const currentSize = grSet.libraryFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 8),
			'1' : () => Math.min(currentSize + 1, 26),
			'0' : () => HD_QHD_4K(12, 14)
		};
		const newSize = getSize[size] || (() => size);
		grSet.libraryFontSize_layout = newSize();

		grm.ui.setLibrarySize();
		lib.panel.zoomReset();
		lib.pop.createImages();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the Biography font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setBiographyFontSize(size) {
		const currentSize = grSet.biographyFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 8),
			'1' : () => Math.min(currentSize + 1, 26),
			'0' : () => HD_QHD_4K(12, 14)
		};
		const newSize = getSize[size] || (() => size);
		grSet.biographyFontSize_layout = newSize();

		grm.ui.setBiographySize();
		bio.but.resetZoom();
		bio.but.createImages();
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the Lyrics font size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setLyricsFontSize(size) {
		const currentSize = grSet.lyricsFontSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 10),
			'1' : () => Math.min(currentSize + 1, 50),
			'0' : () => HD_QHD_4K(20, 22)
		};
		const newSize = getSize[size] || (() => size);
		grSet.lyricsFontSize_layout = newSize();
		grSet.lyricsInfoFontSize_default = Clamp(grSet.lyricsFontSize_layout, 10, grm.ui.wh < 860 ? 20 : 30);

		grm.ui.createFonts();
		grm.ui.displayLyrics && grm.lyrics.initLyrics();
	}

	/**
	 * Sets the Lyrics line spacing size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1).
	 */
	setLyricsLineSpacingSize(size) {
		const currentSize = grSet.lyricsLineSpacing;
		const getSize = {
			'-1': () => Math.max(currentSize - 4, 20),
			'1': () => Math.min(currentSize + 4, 60),
			'0': () => 40
		};
		const newSize = getSize[size] || (() => currentSize);
		grSet.lyricsLineSpacing = newSize();
		grm.ui.displayLyrics && grm.lyrics.initLyrics();
	}

	/**
	 * Sets the Lyrics sentence spacing size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1).
	 */
	setLyricsSentenceSpacingSize(size) {
		const currentSize = grSet.lyricsSentenceSpacing;
		const getSize = {
			'-1': () => Math.max(currentSize - 4, 10),
			'1': () => Math.min(currentSize + 4, 50),
			'0': () => 30
		};
		const newSize = getSize[size] || (() => currentSize);
		grSet.lyricsSentenceSpacing = newSize();
		grm.ui.displayLyrics && grm.lyrics.initLyrics();
	}
	// #endregion

	// * PUBLIC METHODS - SCALING - LOWER BAR TRANSPORT BUTTONS * //
	// #region PUBLIC METHODS - SCALING - LOWER BAR TRANSPORT BUTTONS
	/**
	 * Sets the lower bar transport button size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setTransportBtnSize(size) {
		const currentSize = grSet.transportButtonSize_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 28),
			'1' : () => Math.min(currentSize + 1, grSet.layout === 'default' ? 42 : 36),
			'0' : () => HD_QHD_4K(32, 34)
		};
		const newSize = getSize[size] || (() => size);
		grSet.transportButtonSize_layout = newSize();

		grm.ui.createFonts();
		grm.button.createButtons(grm.ui.ww, grm.ui.wh);
		grm.debug.repaintWindow();
	}

	/**
	 * Sets the lower bar transport button spacing size based on the provided size.
	 * @param {number} size - The size adjustment (-1, 0, 1) or a specific size.
	 */
	setTransportBtnSpacing(size) {
		const currentSize = grSet.transportButtonSpacing_layout;
		const getSize = {
			'-1': () => Math.max(currentSize - 1, 3),
			'1' : () => Math.min(currentSize + 1, 15),
			'0' : () => 5
		};
		const newSize = getSize[size] || (() => size);
		grSet.transportButtonSpacing_layout = newSize();

		grm.button.createButtons(grm.ui.ww, grm.ui.wh);
		grm.debug.repaintWindow();
	}
	// #endregion

	// * PUBLIC METHODS - WINDOW CONTROL * //
	// #region PUBLIC METHODS - WINDOW CONTROL
	/**
	 * Manages and adjusts the window state based on various triggers such as key presses, button clicks, and double-click events on the top menu bar.
	 * This method handles toggling between fullscreen and normal window states, maximizing/restoring the window, and adjusting window state during specific UI interactions.
	 * @param {string} triggeredBy - Specifies the type of trigger that invoked the method. Expected values are 'key', 'minimize', 'maximize', or 'doubleClick'.
	 * The method distinguishes between different types of triggers:
	 * - 'key': Handles key press events, specifically for F11 to toggle fullscreen, respecting certain conditions.
	 * - 'minimize': Handles minimize button click events.
	 * - 'maximize': Handles maximize button click events.
	 * - 'doubleClick': Handles double-click events on the top menu bar, adjusting the window state based on fullscreen mode or specific layout settings.
	 * It also includes condition checks for:
	 * - Disabling specific functionality in certain layouts (e.g., 'Artwork' layout).
	 * - Ensuring fullscreen mode can be toggled or exited appropriately.
	 * - Handling exceptions that may occur during the state adjustment process.
	 */
	handleWindowControl(triggeredBy) {
		const isKeyF10 = triggeredBy === 'key' && utils.IsKeyPressed(VKey.F10);
		const isKeyF11 = triggeredBy === 'key' && utils.IsKeyPressed(VKey.F11);
		const isMinimize = triggeredBy === 'minimize';
		const isMaximize = triggeredBy === 'maximize';

		try {
			if (isMinimize) {
				UIWizard.WindowMinimize();
			}
			if (isKeyF10) {
				UIWizard.ToggleMaximize();
			}
			else if (grSet.layout === 'default' && (isKeyF11 || (isMaximize && grSet.fullscreenMaximize))) {
				UIWizard.ToggleFullscreen();
			}
			if (grSet.layout !== 'default' && UIWizard.WindowState === WindowState.Maximized) {
				UIWizard.ExitMaximize();
			}
		}
		catch (e) {}
	}

	/**
	 * Handle the window mouse cursor appearance based on position and application state.
	 * @param {number} x - The current x-coordinate of the mouse.
	 * @param {number} y - The current y-coordinate of the mouse.
	 */
	handleWindowCursor(x, y) {
		if (!mouseInLibrarySearch(x, y)) {
			SetCursor('Arrow');
		}
		if (grCfg.settings.hideCursor && fb.IsPlaying) {
			grm.ui.clearTimer('hideCursor');
			grm.ui.hideCursorTimeout = setTimeout(() => {
				if (!grm.ui.activeMenu && fb.IsPlaying) {
					SetCursor('Hide');
				}
			}, 10000);
		}
	}

	/**
	 * Sets temporarily top menu caption to be able to drag foobar around.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	setWindowDrag(x, y) {
		// * Disable mouse middle btn (wheel) to be able to use Library & Biography mouse middle actions
		UIWizard.MoveStyle = grm.ui.displayLibrary && mouseInLibrary(x, y) || grm.ui.displayBiography && mouseInBiography(x, y) ? 0 : 3;
		try {
			if (grm.button.mouseInControl || grm.button.downButton) {
				UIWizard.SetCaptionAreaSize(0, 0, 0, 0);
				if (UIWizard.FrameStyle === 3) UIWizard.DisableWindowSizing = true;
				this.pseudoCaption = false;
			}
			else if (!this.pseudoCaption || this.pseudoCaptionWidth !== grm.ui.ww) {
				UIWizard.SetCaptionAreaSize(0, 0, grm.ui.ww, grSet.layout !== 'default' ? grm.ui.topMenuHeight + SCALE(5) : grm.ui.topMenuHeight);
				if (UIWizard.FrameStyle === 3 && !grSet.lockPlayerSize) UIWizard.DisableWindowSizing = false;
				this.pseudoCaption = true;
				this.pseudoCaptionWidth = grm.ui.ww;
			}
		} catch (e) {}
	}

	/**
	 * Sets the window size via UI Wizard.
	 * @param {number} width - The window width.
	 * @param {number} height - The window height.
	 */
	setWindowSize(width, height) {
		UIWizard.SetWindowSize(width, height);
	}

	/**
	 * Sets and forces window size limits based on layout and display resolution, also fixes window size for messed up settings or properties.
	 * @returns {boolean} Whether the window size needs to be fixed.
	 */
	setWindowSizeFix() {
		const lastW = this.lastPlayerSize.w ? this.lastPlayerSize.w : window.Width;
		const lastH = this.lastPlayerSize.h ? this.lastPlayerSize.h : window.Height;
		const systemFirstLaunch = !this.lastPlayerSize.w ? grSet.systemFirstLaunch : false;

		this.setWindowSizeLimitsForLayouts(lastW, lastH);

		return lastW !== window.Width || lastH !== window.Height || systemFirstLaunch;
	}

	/**
	 * Sets the minimum and maximum sizes of the window based on different screen resolutions.
	 * @param {number} min_w - The minimum width.
	 * @param {number} min_h - The minimum height.
	 * @param {number} max_w - The maximum width.
	 * @param {number} max_h - The maximum height.
	 */
	setWindowSizeLimits(min_w, min_h, max_w, max_h) {
		UIWizard.WindowMinSize = true;
		UIWizard.WindowMaxSize = false;
		UIWizard.SetWindowSizeLimits(min_w, min_h, max_w, max_h);
	}

	/**
	 * Sets the window size limits for each layout.
	 * @param {number} width - The window width.
	 * @param {number} height - The window height.
	 */
	setWindowSizeLimitsForLayouts(width, height) {
		let min_w = 0;
		let min_h = 0;
		const max_w = 9999;
		const max_h = 9999;

		const size = this.playerSize[grSet.layout][grSet.displayRes];

		if (grSet.displayScale !== 100) {
			const scaledWidth  = Math.floor(size.small.width  * (grSet.displayScale / 100));
			const scaledHeight = Math.floor(size.small.height * (grSet.displayScale / 100));
			min_w = Math.min(scaledWidth, width);
			min_h = Math.min(scaledHeight, height);
		} else {
			min_w = size ? size.small.width  : grm.ui.ww;
			min_h = size ? size.small.height : grm.ui.wh;
		}

		this.setWindowSizeLimits(min_w, min_h, max_w, max_h);
	}
	// #endregion
}
