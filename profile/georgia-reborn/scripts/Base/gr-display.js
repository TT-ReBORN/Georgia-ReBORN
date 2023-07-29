/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Display                              * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-07-27                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * VARIABLES * //
///////////////////
/** @type {number} Default display dots per inch setting. */
let DPI = 96;
/** @type {boolean} State variable for 4k resolution. */
let RES_4K = false;
/** @type {boolean} State variable for QHD resolution. */
let RES_QHD = false;
/** @type {boolean} Setup variable for 4k check. */
let sizeInitialized = false;
/** @type {boolean} Setup variable for 4k check. */
let lastSize;

// * Check and set the actual display DPI number via reading the Windows registry value.
try { DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI'); } catch (e) {}

/**
 * All predefined HD res player sizes ( Options > Player size ) for each layout ( Options > Layout ).
 */
const playerSizesHD = {
	default: {
		'1140x730': 'small',
		'1600x960': 'normal',
		'1802x1061': 'large'
	},
	artwork: {
		'526x686': 'small',
		'700x860': 'normal',
		'901x1062': 'large'
	},
	compact: {
		'484x730': 'small',
		'484x960': 'normal',
		'1600x960': 'large'
	}
};

/**
 * All predefined QHD res player sizes ( Options > Player size ) for each layout ( Options > Layout ).
 */
const playerSizesQHD = {
	default: {
		'1280x800': 'small',
		'1802x1061': 'normal',
		'2280x1300': 'large'
	},
	artwork: {
		'640x800': 'small',
		'901x1061': 'normal',
		'1140x1300': 'large'
	},
	compact: {
		'540x800': 'small',
		'540x1061': 'normal',
		'2080x1300': 'large'
	}
};

/**
 * All predefined 4K res player sizes ( Options > Player size ) for each layout ( Options > Layout ).
 */
const playerSizes4K = {
	default: {
		'2300x1470': 'small',
		'2800x1720': 'normal',
		'3400x2020': 'large'
	},
	artwork: {
		'1052x1372': 'small',
		'1400x1720': 'normal',
		'1699x2020': 'large'
	},
	compact: {
		'964x1470': 'small',
		'964x1720': 'normal',
		'2800x1720': 'large'
	}
};


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
 * Scales the value based on 4k mode or not.
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
 * Display auto-detection used in Options > Display or for the very first foobar startup and when factory resetting the theme.
 */
async function autoDetectRes() {
	const resetSize = async () => {
		RES_4K = false;
		RES_QHD = false;
		setSizesFor4KorHD();
		pref.displayRes = 'HD';
		pref.playerSize_4k_small = false;
		pref.playerSize_QHD_small = false;
		pref.playerSize_HD_small = 'playerSize_HD_small';
	};

	const check4k = async () => {
		setWindowSize(2800, 1720); // Check if player size 'Normal' for 4k can be attained
		if (ww > 2560 && wh > 1600) {
			RES_4K = true;
			setSizesFor4KorHD();
			pref.displayRes = '4k';
			pref.playerSize_4k_normal = 'playerSize_4k_normal';
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small = false;
		}
	};

	const checkQHD = async () => {
		if (ww < 2800 && wh < 1720) {
			setWindowSize(2500, 1400); // Check if this resolution for QHD can be attained
			if (ww < 2500 && wh < 1400) { // If not, set to HD mode
				resetSize();
			}
			else { // Set to QHD mode
				RES_QHD = true;
				setSizesForQHD();
				pref.displayRes = 'QHD';
				pref.playerSize_4k_normal = false;
				pref.playerSize_QHD_small = 'playerSize_QHD_small';
				pref.playerSize_HD_small = false;
			}
		}
	};

	const updatePanels = async () => {
		if (pref.layout === 'default') {
			windowHandler.layoutDefault();
		}
		else if (pref.layout === 'artwork') {
			windowHandler.layoutArtwork();
		}
		else if (pref.layout === 'compact') {
			windowHandler.layoutCompact();
		}
		initPanels();
	};

	const startDetection = async () => {
		await resetSize();
		await check4k();
		await checkQHD();
		await updatePanels();
	};

	startDetection();
}


/**
 * Checks the current used monitor resolution.
 * @param {number} w
 * @param {number} h
 */
function checkForRes(w, h) {
	if (pref.displayRes === '4k') {
		RES_4K = true;
		RES_QHD = false;
		pref.savedWidth_default  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Default)',  2800);
		pref.savedHeight_default = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Default)', 1720);
		pref.savedWidth_artwork  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Artwork)',  1052);
		pref.savedHeight_artwork = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Artwork)', 1372);
		pref.savedWidth_compact  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Compact)',   964);
		pref.savedHeight_compact = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Compact)', 1720);
	}
	else if (pref.displayRes === 'QHD') {
		RES_4K = false;
		RES_QHD = true;
		pref.savedWidth_default  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Default)',  1280);
		pref.savedHeight_default = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Default)',  800);
		pref.savedWidth_artwork  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Artwork)',   640);
		pref.savedHeight_artwork = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Artwork)',  800);
		pref.savedWidth_compact  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Compact)',   540);
		pref.savedHeight_compact = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Compact)',  800);
	}
	else if (pref.displayRes === 'HD') {
		RES_4K = false;
		RES_QHD = false;
		pref.savedWidth_default  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Default)', 1140);
		pref.savedHeight_default = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Default)', 730);
		pref.savedWidth_artwork  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Artwork)',  526);
		pref.savedHeight_artwork = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Artwork)', 686);
		pref.savedWidth_compact  = window.SetProperty('Georgia-ReBORN - 16. System: Saved width (Compact)',  484);
		pref.savedHeight_compact = window.SetProperty('Georgia-ReBORN - 16. System: Saved height (Compact)', 730);
	}
	if (lastSize !== RES_4K) {
		sizeInitialized = false;
		lastSize = RES_4K;
	}
}


/**
 * Checks the player size and called from on_size(), used as an indicator for top menu Options > Player size.
 */
function checkForPlayerSize() {
	const res = `${ww}x${wh}`;

	if (!RES_4K && !RES_QHD) {
		pref.playerSize = playerSizesHD[pref.layout][res] || 'custom';
	} else if (RES_QHD) {
		pref.playerSize = playerSizesQHD[pref.layout][res] || 'custom';
	} else if (RES_4K) {
		pref.playerSize = playerSizes4K[pref.layout][res] || 'custom';
	}
}


/**
 * Sets the font and button sizes for 4k and HD display resolution.
 */
function setSizesFor4KorHD() {
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
function setSizesForQHD() {
	RES_4K = false;
	RES_QHD = true;
	pref.playerSize_4k_normal = false;
	pref.playerSize_QHD_small = 'playerSize_QHD_small';
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


/**
 * Sets the window size via UIHacks.
 * @param {number} width
 * @param {number} height
 */
function setWindowSize(width, height) {
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

	window.NotifyOthers('layout_state_size', layoutHandler.layout.state);
}


/**
 * Sets the minimum and maximum sizes of the window based on different screen resolutions.
 * @param {number} min_w_4k
 * @param {number} max_w_4k
 * @param {number} min_h_4k
 * @param {number} max_h_4k
 * @param {number} min_w_QHD
 * @param {number} max_w_QHD
 * @param {number} min_h_QHD
 * @param {number} max_h_QHD
 * @param {number} min_w_HD
 * @param {number} max_w_HD
 * @param {number} min_h_HD
 * @param {number} max_h_HD
 */
function setWindowSizeLimits(min_w_4k, max_w_4k, min_h_4k, max_h_4k, min_w_QHD, max_w_QHD, min_h_QHD, max_h_QHD, min_w_HD, max_w_HD, min_h_HD, max_h_HD) {
	UIHacks.MinSize.Enabled = !!min_w_4k || !!min_w_QHD || !!min_w_HD;
	UIHacks.MinSize.Width   =   min_w_4k ||   min_w_QHD ||   min_w_HD;

	UIHacks.MaxSize.Enabled = !!max_w_4k || !!max_w_QHD || !!max_w_HD;
	UIHacks.MaxSize.Width   =   max_w_4k ||   max_w_QHD ||   max_w_HD;

	UIHacks.MinSize.Enabled = !!min_h_4k || !!min_h_QHD || !!min_h_HD;
	UIHacks.MinSize.Height  =   min_h_4k ||   min_h_QHD ||   min_h_HD;

	UIHacks.MaxSize.Enabled = !!max_h_4k || !!max_h_QHD || !!max_h_HD;
	UIHacks.MaxSize.Height  =   max_h_4k ||   max_h_QHD ||   max_h_HD;
}


////////////////////////
// * LAYOUT HANDLER * //
////////////////////////
/** @type {Object} Creates the layout handler object. */
const layoutHandler = new LayoutHandler();

/**
 * Saves and reads the layout and playerSize property of the current layout and playerSize state.
 * @type {Object} Creates a StateObject class that is used to read and write state files.
 * @class
 */
function LayoutHandler() {
	// private:
	const statePath = `${fb.ProfilePath}georgia-reborn\\configs\\`;
	CreateFolder(statePath, true);

	/** @type {StateObject} */
	this.layout = new StateObject('_state_layout_cache', ['default', 'artwork', 'compact'], 'default');
	this.playerSize = new StateObject('_state_player_size_cache', ['playerSize_HD_small', 'playerSize_HD_normal', 'playerSize_HD_large', 'playerSize_QHD_small', 'playerSize_QHD_normal', 'playerSize_QHD_large', 'playerSize_4k_small', 'playerSize_4k_normal', 'playerSize_4k_large'], 'playerSize_HD_small');

	/**
	 * Reads and writes state files.
	 * @param {string} name The name of the state, must be unique in the file system.
	 * @param {Array<string>} states_list The list of states that can be read and written.
	 * @param {string} default_state The default state for the object.
	 * @class
	 */
	function StateObject(name, states_list, default_state) {
		let curState;

		// private:
		const initialize = () => {
			curState = readState(name);
		};

		const readState = () => {
			const pathToState = `${statePath}\\${name}_`;
			let state = null;

			states_list.forEach((item, i) => {
				if (fso.FileExists(pathToState + i)) {
					state = item;
					return false;
				}
			});

			if (state !== null) {
				return state;
			}

			const defaultIndex = states_list.indexOf(default_state);
			fso.CreateTextFile(pathToState + defaultIndex, true).Close();
			return default_state;
		};

		const writeState = (new_state) => {
			const pathToState = `${statePath}\\${name}_`;
			const indexNew = states_list.indexOf(new_state);

			if (indexNew === -1) {
				throw Error(`Argument Error:\nUnknown state ${new_state}`);
			}

			states_list.forEach((item, i) => {
				DeleteFile(pathToState + i);
			});

			if (!fso.FileExists(pathToState + indexNew)) {
				fso.CreateTextFile(pathToState + indexNew, true).Close();
			}

			window.NotifyOthers(`${name}_state`, new_state);

			if (fb.IsPlaying) { // * Refresh panel
				fb.RunMainMenuCommand('Playback/Play or Pause');
				fb.RunMainMenuCommand('Playback/Play or Pause');
			}
			else {
				fb.RunMainMenuCommand('Playback/Play');
				fb.RunMainMenuCommand('Playback/Stop');
			}
		};

		// public:
		Object.defineProperty(this, 'state', {
			/**
			 * @returns {string}
			 */
			get() {
				return curState;
			},

			/**
			 * @param {string} val
			 */
			set(val) {
				curState = val;
				writeState(val);
			}
		});

		/**
		 * Refreshes the state.
		 */
		this.refresh = () => {
			writeState(curState);
		};

		initialize();
	}
};


////////////////////////
// * WINDOW HANDLER * //
////////////////////////
/** @type {Object} Creates the window handler object. */
const windowHandler = new WindowHandler();

/**
 * Manages and sets the window size based on active display resolution, layout setting and player size.
 * @type {Object} Sets the windows size via UIHacks.
 * @class
 */
function WindowHandler() {
	let fbHandle;

	/**
	 * Sets the Default layout -> Options > Layout > Default.
	 */
	this.layoutDefault = () => {
		const newLayoutState = 'default';
		if (newLayoutState !== 'default') return;

		if (UIHacks.FullScreen) {
			UIHacks.FullScreen = false;
		}
		else if (fbHandle) {
			pref.savedWidth_default = fbHandle.Width;
			pref.savedHeight_default = fbHandle.Height;
		}
		layoutHandler.layout.state = newLayoutState;

		if (pref.displayRes === '4k') {
			pref.playerSize_4k_normal = 'playerSize_4k_normal';
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = false;
			UIHacks.MinSize.Width   = 2300;
			UIHacks.MinSize.Height  = 1470;
			UIHacks.MinSize.Enabled = true;
			setWindowSize(2800, 1720);
		}
		else if (pref.displayRes === 'QHD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = 'playerSize_QHD_small';
			pref.playerSize_HD_small  = false;
			UIHacks.MinSize.Width   = 1280;
			UIHacks.MinSize.Height  = 800;
			UIHacks.MinSize.Enabled = true;
			setWindowSize(1280, 800);
		}
		else if (pref.displayRes === 'HD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = 'playerSize_HD_small';
			UIHacks.MinSize.Width   = 1140;
			UIHacks.MinSize.Height  = 730;
			UIHacks.MinSize.Enabled = true;
			setWindowSize(1140, 730);
		}
	};

	/**
	 * Sets the Artwork layout -> Options > Layout > Artwork.
	 */
	this.layoutArtwork = () => {
		const newLayoutState = 'artwork';
		if (newLayoutState !== 'artwork') return;

		if (UIHacks.FullScreen) {
			UIHacks.FullScreen = false;
		}
		else if (fbHandle) {
			pref.savedWidth_artwork = fbHandle.Width;
			pref.savedHeight_artwork = fbHandle.Height;
		}
		layoutHandler.layout.state = newLayoutState;

		if (pref.displayRes === '4k') {
			pref.playerSize_4k_small  = 'playerSize_4k_small';
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = false;
			setWindowSize(1052, 1372);
		}
		else if (pref.displayRes === 'QHD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = 'playerSize_QHD_small';
			pref.playerSize_HD_small  = false;
			setWindowSize(640, 800);
		}
		else if (pref.displayRes === 'HD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = 'playerSize_HD_small';
			setWindowSize(526, 686);
		}
	};

	/**
	 * Sets the Compact layout -> Options > Layout > Compact.
	 */
	this.layoutCompact = () => {
		const newLayoutState = 'compact';
		if (newLayoutState !== 'compact') return;

		if (UIHacks.FullScreen) {
			UIHacks.FullScreen = false;
		}
		else if (fbHandle) {
			pref.savedWidth_compact = fbHandle.Width;
			pref.savedHeight_compact = fbHandle.Height;
		}
		layoutHandler.layout.state = newLayoutState;

		if (pref.displayRes === '4k') {
			pref.playerSize_4k_normal = 'playerSize_4k_normal';
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = false;
			setWindowSize(964, 1720);
		}
		else if (pref.displayRes === 'QHD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = 'playerSize_QHD_small';
			pref.playerSize_HD_small  = false;
			setWindowSize(540, 800);
		}
		else if (pref.displayRes === 'HD') {
			pref.playerSize_4k_normal = false;
			pref.playerSize_QHD_small = false;
			pref.playerSize_HD_small  = 'playerSize_HD_small';
			setWindowSize(484, 730);
		}
	};

	/**
	 * Sets the player size Small for HD res -> Options > Player size > Small.
	 */
	this.playerSize_HD_small = () => {
		const newPlayerSizeState = 'playerSize_HD_small';
		if (newPlayerSizeState === 'playerSize_HD_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 1140;
				UIHacks.MinSize.Height  = 730;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(1140, 730);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(526, 686);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(484, 730);
		}
	};

	/**
	 * Sets the player size Normal for HD res -> Options > Player size > Normal.
	 */
	this.playerSize_HD_normal = () => {
		const newPlayerSizeState = 'playerSize_HD_normal';
		if (newPlayerSizeState === 'playerSize_HD_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 1600;
				UIHacks.MinSize.Height  = 960;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(1600, 960);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(700, 860);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(484, 960);
		}
	};

	/**
	 * Sets the player size Large for HD res -> Options > Player size > Large.
	 */
	this.playerSize_HD_large = () => {
		const newPlayerSizeState = 'playerSize_HD_large';
		if (newPlayerSizeState === 'playerSize_HD_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 1802;
				UIHacks.MinSize.Height  = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(1802, 1061);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(901, 1062);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(1600, 960);
		}
	};

	/**
	 * Sets the player size Small for QHD res -> Options > Player size > Small.
	 */
	this.playerSize_QHD_small = () => {
		const newPlayerSizeState = 'playerSize_QHD_small';
		if (newPlayerSizeState === 'playerSize_QHD_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 1280;
				UIHacks.MinSize.Height  = 800;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(1280, 800);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(640, 800);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(540, 800);
		}
	};

	/**
	 * Sets the player size Normal for QHD res -> Options > Player size > Normal.
	 */
	this.playerSize_QHD_normal = () => {
		const newPlayerSizeState = 'playerSize_QHD_normal';
		if (newPlayerSizeState === 'playerSize_QHD_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 1802;
				UIHacks.MinSize.Height  = 1061;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(1802, 1061);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(901, 1061);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(540, 1061);
		}
	};

	/**
	 * Sets the player size Large for QHD res -> Options > Player size > Large.
	 */
	this.playerSize_QHD_large = () => {
		const newPlayerSizeState = 'playerSize_QHD_large';
		if (newPlayerSizeState === 'playerSize_QHD_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 2100;
				UIHacks.MinSize.Height  = 1300;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(2280, 1300);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(1140, 1300);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(2080, 1300);
		}
	};

	/**
	 * Sets the player size Small for 4K res -> Options > Player size > Small.
	 */
	this.playerSize_4k_small = () => {
		const newPlayerSizeState = 'playerSize_4k_small';
		if (newPlayerSizeState === 'playerSize_4k_small') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 2300;
				UIHacks.MinSize.Height  = 1470;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(2300, 1470);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(1052, 1372);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(964, 1470);
		}
	};

	/**
	 * Sets the player size Normal for 4K res -> Options > Player size > Normal.
	 */
	this.playerSize_4k_normal = () => {
		const newPlayerSizeState = 'playerSize_4k_normal';
		if (newPlayerSizeState === 'playerSize_4k_normal') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 2800;
				UIHacks.MinSize.Height  = 1720;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(2800, 1720);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(1400, 1720);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(964, 1720);
		}
	};

	/**
	 * Sets the player size Large for 4K res -> Options > Player size > Large.
	 */
	this.playerSize_4k_large = () => {
		const newPlayerSizeState = 'playerSize_4k_large';
		if (newPlayerSizeState === 'playerSize_4k_large') {
			if (UIHacks.FullScreen) {
				UIHacks.FullScreen = false;
			}
			else if (fbHandle) {
				pref.savedWidth_default = fbHandle.Width;
				pref.savedHeight_default = fbHandle.Height;
			}
			layoutHandler.playerSize.state = newPlayerSizeState;
			if (pref.layout === 'default') {
				// setWindowSize(pref.savedWidth_default, pref.savedHeight_default);
				UIHacks.MinSize.Width   = 3400;
				UIHacks.MinSize.Height  = 2020;
				UIHacks.MinSize.Enabled = true;
			}
		}
		if (pref.layout === 'default') {
			setWindowSize(3400, 2020);
		}
		else if (pref.layout === 'artwork') {
			setWindowSize(1699, 2020);
		}
		else if (pref.layout === 'compact') {
			setWindowSize(2800, 1720);
		}
	};

	/**
	 * Sets the window size limits for each layout.
	 * @param {string} layout The three available layouts -> Options > Layout.
	 */
	this.setWindowSizeLimitsForLayouts = (layout) => {
		let min_w_4k  = 0; const max_w_4k  = 0; let min_h_4k  = 0; const max_h_4k  = 0;
		let min_w_QHD = 0; const max_w_QHD = 0; let min_h_QHD = 0; const max_h_QHD = 0;
		let min_w_HD  = 0; const max_w_HD  = 0; let min_h_HD  = 0; const max_h_HD  = 0;

		if (layout === 'default') {
			if (RES_4K) {
				min_w_4k = 2300;
				min_h_4k = 1470;
			} else if (RES_QHD) {
				min_w_QHD = 1280;
				min_h_QHD = 800;
			} else if (!RES_4K && !RES_QHD) {
				min_w_HD = 1140;
				min_h_HD = 730;
			}
		}
		else if (layout === 'artwork') {
			if (RES_4K) {
				min_w_4k = 1052;
				min_h_4k = 1372;
			} else if (RES_QHD) {
				min_w_QHD = 640;
				min_h_QHD = 800;
			} else if (!RES_4K && !RES_QHD) {
				min_w_HD = 526;
				min_h_HD = 686;
			}
		}
		else if (layout === 'compact') {
			if (RES_4K) {
				min_w_4k = 964;
				min_h_4k = 1470;
			} else if (RES_QHD) {
				min_w_QHD = 540;
				min_h_QHD = 800;
			} else if (!RES_4K && !RES_QHD) {
				min_w_HD = 484;
				min_h_HD = 730;
			}
		}

		setWindowSizeLimits(min_w_4k, max_w_4k, min_h_4k, max_h_4k, min_w_QHD, max_w_QHD, min_h_QHD, max_h_QHD, min_w_HD, max_w_HD, min_h_HD, max_h_HD);
	};

	/**
	 * Fixes window size for messed up settings or properties.
	 * @return {boolean} Whether the window size needs to be fixed.
	 */
	this.fixWindowSize = function () {
		this.setWindowSizeLimitsForLayouts(layoutHandler.layout.state);

		const lastW = fbHandle ? fbHandle.Width : '';
		const lastH = fbHandle ? fbHandle.Height : '';
		const systemFirstLaunch = !fbHandle ? pref.systemFirstLaunch : '';

		return fbHandle ? lastW !== fbHandle.Width || lastH !== fbHandle.Height : systemFirstLaunch;
	};
}
