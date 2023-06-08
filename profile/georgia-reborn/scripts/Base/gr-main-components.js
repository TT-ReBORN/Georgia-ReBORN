/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Main Components                      * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-06                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * IMAGE CACHING * //
///////////////////////
/**
 * @typedef {Object} ArtCacheObj
 * @property {GdiBitmap} image
 * @property {number} filesize
 */
class ArtCache {
	/**
	 * Create ArtCache. ArtCache is a Least-Recently Used cache meaning that each cache hit
	 * will bump that image to be the last image to be removed from the cache (if maxCacheSize is exceeded).
	 * @param {number} maxCacheSize Maximum number of images to keep in the cache.
	 */
	constructor(maxCacheSize) {
		/** @private @type {Object.<string, ArtCacheObj>} */
		this.cache = {};
		/** @private @type {string[]} */
		this.cacheIndexes = [];
		/** @private */ this.cacheMaxSize = maxCacheSize;
		/** @private */ this.imgMaxWidth = scaleForDisplay(1440); // * These are the maximum width and height an image can be displayed in Georgia-ReBORN
		/** @private */ this.imgMaxHeight = scaleForDisplay(872);
	}

	/**
	 * Get cached image if it exists under the location string. If image is found, move it's index to the end of the cacheIndexes.
	 * @param {string} location String value to check if image is cached under.
	 * @return {GdiBitmap}
	 */
	getImage(location) {
		if (this.cache[location]) {
			const f = fso.GetFile(location);
			const pathIndex = this.cacheIndexes.indexOf(location);
			this.cacheIndexes.splice(pathIndex, 1);

			if (!f || f.Size === this.cache[location].filesize) {
				this.cacheIndexes.push(location);
				debugLog('cache hit:', location);
				return this.cache[location].image;
			}
			// Size of file on disk has changed
			debugLog(`cache entry was stale: ${location} [old size: ${this.cache[location].filesize}, new size: ${f.Size}]`);
			delete this.cache[location]; // Was removed from cacheIndexes already
		}
		return null;
	}

	/**
	 * Adds a rescaled image to the cache under string `location` and returns the cached image.
	 * @param {GdiBitmap} img
	 * @param {string} location String value to cache image under. Does not need to be a path.
	 * @return {GdiBitmap}
	 */
	encache(img, location) {
		try {
			let h = img.Height;
			let w = img.Width;
			if (w > this.imgMaxWidth || h > this.imgMaxHeight) {
				let scaleFactor = w / this.imgMaxWidth;
				if (scaleFactor < h / this.imgMaxHeight) {
					scaleFactor = h / this.imgMaxHeight;
				}
				h = Math.min(h / scaleFactor);
				w = Math.min(w / scaleFactor);
			}
			const f = fso.GetFile(location);
			this.cache[location] = { image: img.Resize(w, h), filesize: f.Size };
			img = null;
			const pathIndex = this.cacheIndexes.indexOf(location);
			if (pathIndex !== -1) {
				// Remove from middle of cache and put on end
				this.cacheIndexes.splice(pathIndex, 1);
			}
			this.cacheIndexes.push(location);
			if (this.cacheIndexes.length > this.cacheMaxSize) {
				const remove = this.cacheIndexes.shift();
				debugLog('Removing img from cache:', remove);
				delete this.cache[remove];
			}
		} catch (e) {
			// Do not console.log inverted band logo and label images in the process of being created
			if (invertedBandLogo) console.log(`<Error: Image could not be properly parsed: ${location}>`);
		}
		if (this.cache[location]) {
			return this.cache[location].image;
		}
		return img;
	}

	/**
	 * Completely clear all cached entries and release memory held by scaled bitmaps.
	 */
	clear() {
		while (this.cacheIndexes.length) {
			const remove = this.cacheIndexes.shift();
			this.cache[remove] = null;
			delete this.cache[remove];
		}
	}
}


//////////////
// * MENU * //
//////////////
/** Helper class for creating Menus, submenus, radio groups, toggle items, etc. */
class Menu {
	/**
	 * @param {string=} title Title of the menu. If this is the parent menu, should be undefined.
	 */
	constructor(title = '') {
		_MenuItemIndex++;
		this.menu = window.CreatePopupMenu();
		this.title = title;
		this.systemMenu = false;
		this.menuManager = null;
	}

	/**
	 * Creates default foobar menu corresponding to `name`.
	 * @param {string} name
	 */
	initFoobarMenu(name) {
		if (name) {
			this.systemMenu = true;
			this.menuManager = fb.CreateMainMenuManager();
			this.menuManager.Init(name);
			this.menuManager.BuildMenu(this.menu, 1, 1000);
		}
	}

	/**
	 * Adds a separator to the menu.
	 */
	addSeparator() {
		this.menu.AppendMenuSeparator();
	}

	/**
	 *
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {Function} callback
	 * @param {boolean=} [disabled=false]
	 */
	addItem(label, checked, callback, disabled = false) {
		this.addItemWithVariable(label, checked, undefined, callback, disabled);
	}

	/**
	 * Similar to addItem, but takes an object and property name which will automatically be set when the callback is called,
	 * before calling any user specified callback. If the property you wish to toggle is options.repeat, then propertiesObj
	 * is options, and the propertyName must be "repeat" as a string.
	 * @param {string} label
	 * @param {object} propertiesObj An object which contains propertyName
	 * @param {string} propertyName The name of the property to toggle on/off
	 * @param {?Function} callback
	 * @param {?boolean=} [disabled=false]
	 */
	addToggleItem(label, propertiesObj, propertyName, callback = () => { }, disabled = false) {
		this.addItem(label, propertiesObj[propertyName], () => {
			propertiesObj[propertyName] = !propertiesObj[propertyName];
			if (callback) {
				callback();
			}
		}, disabled);
	}

	/**
	 * Creates a set of radio items and checks the value specified
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 */
	addRadioItems(labels, selectedValue, variables, callback = () => { }, disabled = false) {
		const startIndex = _MenuItemIndex;
		let selectedIndex;
		for (let i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MF_STRING | (disabled ? MF_DISABLED | MF_GRAYED : 0), _MenuItemIndex, labels[i]);
			_MenuCallbacks[_MenuItemIndex] = callback;
			_MenuVariables[_MenuItemIndex] = variables[i];
			if (selectedValue === variables[i]) {
				selectedIndex = _MenuItemIndex;
			}
			_MenuItemIndex++;
		}
		if (selectedIndex) {
			this.menu.CheckMenuRadioItem(startIndex, _MenuItemIndex - 1, selectedIndex);
		}
	}

	/**
	 * Creates a submenu consisting of radio items
	 * @param {string} subMenuName
	 * @param {string[]} labels Array of strings which corresponds to each radio item
	 * @param {*} selectedValue Value of the radio item to be checked
	 * @param {*[]} variables Array of values which correspond to each radio entry. `selectedValue` will be checked against these values.
	 * @param {Function} callback
	 * @param {boolean=} [disabled=false]
	 */
	createRadioSubMenu(subMenuName, labels, selectedValue, variables, callback, disabled = false) {
		const subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, selectedValue, variables, callback);
		subMenu.appendTo(this, disabled);
	}

	/**
	 * @param {string} label
	 * @param {boolean} checked Should the menu item be checked
	 * @param {*} variable Variable which will be passed to callback when item is clicked
	 * @param {Function} callback
	 * @param {boolean} disabled
	 */
	addItemWithVariable(label, checked, variable, callback, disabled) {
		this.menu.AppendMenuItem(MF_STRING | (disabled ? MF_DISABLED | MF_GRAYED : 0), _MenuItemIndex, label);
		this.menu.CheckMenuItem(_MenuItemIndex, checked);
		_MenuCallbacks[_MenuItemIndex] = callback;
		if (typeof variable !== 'undefined') {
			_MenuVariables[_MenuItemIndex] = variable;
		}
		_MenuItemIndex++;
	}

	/**
	 * Appends menu to a parent menu
	 * @param {Menu} parentMenu The Menu to append the subMenu to
	 * @param {boolean=} [disabled=false]
	 */
	appendTo(parentMenu, disabled = false) {
		this.menu.AppendTo(parentMenu.menu, MF_STRING | (disabled ? MF_DISABLED | MF_GRAYED : 0), this.title);
	}

	/**
	 * Handles callback and automatically disposes menu
	 * @param {number} idx Value of the menu item's callback to call. Comes from menu.trackPopupMenu(x, y).
	 */
	doCallback(idx) {
		if (idx > menuStartIndex && _MenuCallbacks[idx]) {
			_MenuCallbacks[idx](_MenuVariables[idx]);
		} else if (this.systemMenu && idx) {
			this.menuManager.ExecuteByID(idx - 1);
			this.menuManager = null;
		}
		this.menu = null;
		// Reset globals as menu is about to be destroyed
		_MenuCallbacks = [];
		_MenuVariables = [];
		_MenuItemIndex = menuStartIndex;
	}

	/**
	 * @return {number} Index of the menu item clicked on
	 */
	trackPopupMenu(x, y) {
		return this.menu.TrackPopupMenu(x, y);
	}
}


/////////////////
// * TOOLTIP * //
/////////////////
class TooltipTimer {
	constructor() {
		this.tooltip_timer = undefined;
		this.tt_caller = undefined;
	}

	start(id, text) {
		const old_caller = this.tt_caller;
		this.tt_caller = id;

		if (!this.tooltip_timer && g_tooltip.Text) {
			this.tt(text, old_caller !== this.tt_caller);
		}
		else { // * There can be only one tooltip present at all times, so we can kill the timer w/o any worries
			if (this.tooltip_timer) {
				this.forceStop();
			}

			if (!this.tooltip_timer) {
				this.tooltip_timer = setTimeout(() => {
					this.tt(text);
					this.tooltip_timer = null;
				}, 300);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) { // Do not stop other callers
			this.forceStop();
		}
	}

	forceStop() {
		this.tt('');
		if (this.tooltip_timer) {
			clearTimeout(this.tooltip_timer);
			this.tooltip_timer = null;
			this.tt_caller = null;
		}
	}

	/**
	 * Actually displays the tooltip
	 * @param {string} text The text to show in the tooltip
	 * @param {boolean=} force Activate the tooltip whether or not text has changed
	 */
	tt(text, force) {
		if (g_tooltip.Text !== text.toString() || force) {
			g_tooltip.Text = text;
			g_tooltip.Activate();
		}
	}
}


class TooltipHandler {
	constructor() {
		this.id = Math.ceil(Math.random() * 10000);
		this.timer = g_tooltip_timer;
	}

	/**
	 * Show tooltip after delay (300ms)
	 * @param {string} text
	 */
	showDelayed(text) {
		styledTooltipText = text;
		styledTooltipReady = true;
		if (!pref.showStyledTooltips) {
			this.timer.start(this.id, text);
		}
	}

	/**
	 * Show tooltip now
	 * @param {string} text
	 */
	showImmediate(text) {
		styledTooltipText = text;
		styledTooltipReady = true;
		if (!pref.showStyledTooltips) {
			this.timer.stop(this.id);
			this.timer.tt(text);
		}
	}

	/**
	 * Clear this tooltip if this handler created it
	 */
	clear() {
		styledTooltipReady = false;
		this.timer.stop(this.id);
	}

	/**
	 * Clear tooltip regardless of which handler created it
	 */
	stop() {
		styledTooltipReady = false;
		this.timer.forceStop();
	}
}


///////////////////////////////////////
// * DETAILS METADATA GRID TOOLTIP * //
///////////////////////////////////////
class MetadataGridTooltip {
	constructor(height) {
		this.x = 0;
		this.y = 0;
		this.w = albumArtSize.x;
		this.h = height;
		this.tooltipText = '';
	}

	// * METHODS * //

	setSize(x, y, width) {
		if (this.x !== x || this.y !== y || this.w !== width) {
			this.x = x;
			this.y = y;
			this.w = width;
		}
	}

	setHeight(height) {
		this.h = height;
	}

	draw(gr) {
		const showGridArtist      = pref.layout === 'artwork' ? pref.showGridArtist_artwork      : pref.showGridArtist_default;
		const showGridTitle       = pref.layout === 'artwork' ? pref.showGridTitle_artwork       : pref.showGridTitle_default;
		const showGridTimeline    = pref.layout === 'artwork' ? pref.showGridTimeline_artwork    : pref.showGridTimeline_default;
		const showGridArtistFlags = pref.layout === 'artwork' ? pref.showGridArtistFlags_artwork : pref.showGridArtistFlags_default;
		const textLeft            = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		const textRight           = scaleForDisplay(20);
		const lineSpacing         = scaleForDisplay(8);
		const trackNumSpacing     = scaleForDisplay(8);
		const timelineHeight      = showGridTimeline ? scaleForDisplay(55) : scaleForDisplay(20);
		const top                 = albumArtSize.y ? albumArtSize.y + textLeft : geo.topMenuHeight + textLeft;
		const gridAlbumFontSize   = pref.layout === 'artwork' ? pref.gridAlbumFontSize_artwork : pref.gridAlbumFontSize_default;
		const flagSize =
		flagImgs.length >=  6 ? scaleForDisplay(84 + gridAlbumFontSize * 6) :
		flagImgs.length === 5 ? scaleForDisplay(70 + gridAlbumFontSize * 5) :
		flagImgs.length === 4 ? scaleForDisplay(56 + gridAlbumFontSize * 4) :
		flagImgs.length === 3 ? scaleForDisplay(42 + gridAlbumFontSize * 3) :
		flagImgs.length === 2 ? scaleForDisplay(28 + gridAlbumFontSize * 2) :
		flagImgs.length === 1 ? scaleForDisplay(14 + gridAlbumFontSize) : '';
		const availableFlags = showGridArtistFlags && flagImgs.length ? flagSize : 0;

		this.gridSpace = Math.floor((!albumArt && discArt ? discArtSize.x : albumArtSize.x) - geo.discArtShadow - textLeft - textRight);

		if (showGridArtist) {
			this.artistWidthTrailingSpace = Math.ceil(gr.MeasureString(str.artist, ft.grd_artist, 0, 0, 0, 0, g_string_format.measure_trailing_spaces).Width);
			this.artistWidth              = Math.ceil(gr.MeasureString(str.artist, ft.grd_artist, 0, 0, 0, 0).Width + availableFlags - this.artistWidthTrailingSpace);
			this.artistHeight             = gr.MeasureString(str.artist, ft.grd_artist, 0, 0, 0, 0).Height;
			this.artistTxtRec             = gr.MeasureString(str.artist, ft.grd_artist, 0, 0, this.gridSpace, 0);
			this.artistNumLines           = Math.min(3, this.artistTxtRec.Lines);
			this.artistNumLinesHeight     = this.artistNumLines === 3 ? this.artistHeight * 2 : (this.artistNumLines === 2 || this.artistWidth > this.gridSpace) ? this.artistHeight * 2 : this.artistHeight;
		}
		if (showGridTitle) {
			this.titleWidthTrailingSpace  = Math.ceil(gr.MeasureString(str.title, ft.grd_title, 0, 0, 0, 0, g_string_format.measure_trailing_spaces).Width);
			this.trackNumWidth            = Math.ceil(gr.MeasureString(str.tracknum, ft.grd_tracknum, 0, 0, 0, 0).Width);
			this.titleWidth               = Math.ceil(gr.MeasureString(str.title, ft.grd_title, 0, 0, 0, 0).Width + this.trackNumWidth + trackNumSpacing - this.titleWidthTrailingSpace);
			this.titleHeight              = gr.MeasureString(str.title, ft.grd_title, 0, 0, 0, 0).Height;
			this.titleTxtRec              = gr.MeasureString(isStreaming ? str.tracknum + str.title : str.tracknum === '' ? str.title : `${str.tracknum}\xa0${str.title}`, ft.grd_title, 0, 0, this.gridSpace, wh);
			this.titleNumLines            = Math.min(3, this.titleTxtRec.Lines);
			this.titleNumLinesHeight      = this.titleNumLines === 3 ? this.titleHeight * 2 : (this.titleNumLines === 2 || this.titleWidth > this.gridSpace) ? this.titleHeight * 2 : this.titleHeight;
		}
			this.albumWidthTrailingSpace  = Math.ceil(gr.MeasureString(str.album, ft.grd_album, 0, 0, 0, 0, g_string_format.measure_trailing_spaces).Width);
			this.albumWidth               = Math.ceil(gr.MeasureString(str.album, ft.grd_album, 0, 0, 0, 0).Width - this.albumWidthTrailingSpace);
			this.albumHeight              = gr.MeasureString(str.album, ft.grd_album, 0, 0, 0, 0).Height;
			this.albumTxtRec              = gr.MeasureString(str.album, ft.grd_album, 0, 0, this.gridSpace, 0);
			this.albumNumLines            = Math.min(!showGridArtist && !showGridTitle ? 4 : 3, this.albumTxtRec.Lines);
			this.albumNumLinesHeight      = !showGridArtist && !showGridTitle || this.albumNumLines === 3 ? this.albumHeight * 3 : this.albumNumLines === 2 ? this.albumHeight * 2 : this.albumHeight;

			// * NumLines corrections used for line breaks. Happens on single large words in artist or in title where only country flags or track number stays on first line
			this.artistNumLinesFix = this.artistWidth > this.gridSpace ? this.artistHeight : 0;
			this.titleNumLinesFix  = this.titleWidth  > this.gridSpace ? this.titleHeight  : 0;


		// * Artist tooltip zone
		if (showGridArtist) {
			this.topArtist = top;
		}

		// * Title tooltip zone
		if (showGridTitle && !showGridArtist) {
			this.topTitle = top;
		}
		else if (showGridTitle && showGridArtist && this.artistNumLines === 1) {
			this.topTitle = top + this.artistHeight + lineSpacing + this.artistNumLinesFix;
		}
		else if (showGridTitle && showGridArtist && this.artistNumLines >= 2) {
			this.topTitle = top + this.artistHeight * 2 + lineSpacing;
		}

		// * Album tooltip zone
		if (!showGridArtist && !showGridTitle) {
			this.topAlbum = top;
		}
		// Artist
		else if (showGridArtist && !showGridTitle && this.artistNumLines === 1) {
			this.topAlbum = top + timelineHeight + lineSpacing + this.artistNumLinesFix;
		}
		else if (showGridArtist && !showGridTitle && this.artistNumLines >= 2) {
			this.topAlbum = top + this.artistHeight + timelineHeight + lineSpacing;
		}
		else if (showGridArtist && showGridTitle && this.artistNumLines === 1 && this.titleNumLines === 1) {
			this.topAlbum = top + this.artistHeight + this.titleHeight + timelineHeight + this.artistNumLinesFix + this.titleNumLinesFix;
		}
		else if (showGridArtist && showGridTitle && this.artistNumLines === 1 && this.titleNumLines >= 2) {
			this.topAlbum = top + this.artistHeight + this.titleHeight * 2 + timelineHeight + this.artistNumLinesFix;
		}
		else if (showGridArtist && showGridTitle && this.artistNumLines >= 2 && this.titleNumLines === 1) {
			this.topAlbum = top + this.artistHeight * 2 + this.titleHeight + timelineHeight + this.titleNumLinesFix;
		}
		else if (showGridArtist && showGridTitle && this.artistNumLines >= 2 && this.titleNumLines >= 2) {
			this.topAlbum = top + this.artistHeight * 2 + this.titleHeight * 2 + timelineHeight;
		}
		// Title
		else if (showGridTitle && !showGridArtist && this.titleNumLines === 1) {
			this.topAlbum = top + timelineHeight + lineSpacing + this.titleNumLinesFix;
		}
		else if (showGridTitle && !showGridArtist && this.titleNumLines >= 2) {
			this.topAlbum = top + this.titleHeight + timelineHeight + lineSpacing;
		}
		else if (showGridTitle && showGridArtist && this.titleNumLine === 1 && this.artistNumLines === 1) {
			this.topAlbum = top + this.titleHeight + this.artistHeight + timelineHeight + this.titleNumLinesFix + this.artistNumLinesFix;
		}
		else if (showGridTitle && showGridArtist && this.titleNumLine === 1 && this.artistNumLines >= 2) {
			this.topAlbum = top + this.titleHeight + this.artistHeight * 2 + timelineHeight + this.titleNumLinesFix;
		}
		else if (showGridTitle && showGridArtist && this.titleNumLine >= 2 && this.artistNumLines === 1) {
			this.topAlbum = top + this.titleHeight * 2 + this.artistHeight + timelineHeight + this.artistNumLinesFix;
		}
		else if (showGridTitle && showGridArtist && this.titleNumLine >= 2 && this.artistNumLines >= 2) {
			this.topAlbum = top + this.titleHeight * 2 + this.artistHeight * 2 + timelineHeight;
		}
	}

	clearTooltip() {
		this.tooltipText = '';
		tt.stop();
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		this.metadataGridTooltipArtist = x >= this.x && x < this.x + this.w && y >= this.topArtist && y < this.topArtist + this.artistNumLinesHeight;
		this.metadataGridTooltipTitle  = x >= this.x && x < this.x + this.w && y >= this.topTitle  && y < this.topTitle  + this.titleNumLinesHeight;
		this.metadataGridTooltipAlbum  = x >= this.x && x < this.x + this.w && y >= this.topAlbum  && y < this.topAlbum  + this.albumNumLinesHeight;
		this.metadataGridTooltipAll    = this.metadataGridTooltipArtist + this.metadataGridTooltipTitle + this.metadataGridTooltipAlbum;

		if (!this.metadataGridTooltipAll && this.tooltipText.length) {
			this.clearTooltip();
		}
		return this.metadataGridTooltipAll;
	}

	on_mouse_move(x, y, m) {
		if (pref.showTooltipMain || pref.showTooltipTruncated) {
			let tooltip = '';
			const showGridArtist       = pref.layout === 'artwork' ? pref.showGridArtist_artwork       : pref.showGridArtist_default;
			const showGridTitle        = pref.layout === 'artwork' ? pref.showGridTitle_artwork        : pref.showGridTitle_default;
			const showLowerBarComposer = pref.layout === 'compact' ? pref.showLowerBarComposer_compact : pref.layout === 'artwork' ? pref.showLowerBarComposer_artwork : pref.showLowerBarComposer_default;

			// * Artist
			if (showGridArtist && this.metadataGridTooltipArtist && (this.artistNumLines === 2 && this.artistWidth > this.gridSpace || this.artistNumLines > 2)) {
				tooltip = str.artist;
			}
			// * Title
			if (showGridTitle && this.metadataGridTooltipTitle && (this.titleNumLines === 2 && this.titleWidth > this.gridSpace || this.titleNumLines > 2)) {
				tooltip = `${str.tracknum} ${str.title}${showLowerBarComposer ? str.composer : ''}`;
			}
			// * Album
			if (!showGridArtist && !showGridTitle && this.metadataGridTooltipAlbum && this.albumNumLines > 3 ||
				(showGridArtist || showGridTitle) && this.metadataGridTooltipAlbum && this.albumNumLines > 2) {
				tooltip = str.album + (showLowerBarComposer ? str.composer : '');
			}

			if (tooltip.length) {
				this.tooltipText = tooltip;
				tt.showDelayed(this.tooltipText);
			}
			else if (!this.metadataGridTooltipAll) {
				this.clearTooltip();
			}
		}
	}
}


///////////////////////////
// * LOWER BAR TOOLTIP * //
///////////////////////////
class LowerBarTooltip {
	constructor() {
		this.tooltipText = '';
	}

	// * METHODS * //

	draw(gr) {
		const lowerBarFontSize        = pref.layout === 'compact' ? pref.lowerBarFontSize_compact        : pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork        : pref.lowerBarFontSize_default;
		const showLowerBarComposer    = pref.layout === 'compact' ? pref.showLowerBarComposer_compact    : pref.layout === 'artwork' ? pref.showLowerBarComposer_artwork    : pref.showLowerBarComposer_default;
		const showLowerBarArtistFlags = pref.layout === 'compact' ? pref.showLowerBarArtistFlags_compact : pref.layout === 'artwork' ? pref.showLowerBarArtistFlags_artwork : pref.showLowerBarArtistFlags_default;
		const showPlaybackOrderBtn    = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact    : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork    : pref.showPlaybackOrderBtn_default;
		const showReloadBtn           = pref.layout === 'compact' ? pref.showReloadBtn_compact           : pref.layout === 'artwork' ? pref.showReloadBtn_artwork           : pref.showReloadBtn_default;
		const showVolumeBtn           = pref.layout === 'compact' ? pref.showVolumeBtn_compact           : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork           : pref.showVolumeBtn_default;
		const transportBtnSize        = pref.layout === 'compact' ? pref.transportButtonSize_compact     : pref.layout === 'artwork' ? pref.transportButtonSize_artwork     : pref.transportButtonSize_default;
		const transportBtnSpacing     = pref.layout === 'compact' ? pref.transportButtonSpacing_compact  : pref.layout === 'artwork' ? pref.transportButtonSpacing_artwork  : pref.transportButtonSpacing_default;
		const flagSize =
		flagImgs.length >=  6 ? scaleForDisplay(84 + lowerBarFontSize * 6) :
		flagImgs.length === 5 ? scaleForDisplay(70 + lowerBarFontSize * 5) :
		flagImgs.length === 4 ? scaleForDisplay(56 + lowerBarFontSize * 4) :
		flagImgs.length === 3 ? scaleForDisplay(42 + lowerBarFontSize * 3) :
		flagImgs.length === 2 ? scaleForDisplay(28 + lowerBarFontSize * 2) :
		flagImgs.length === 1 ? scaleForDisplay(14 + lowerBarFontSize) : '';
		const availableFlags = showLowerBarArtistFlags && flagImgs.length ? flagSize : 0;
		const playbackTime   = pref.layout === 'compact' ? pref.showPlaybackTime_compact : pref.showPlaybackTime_artwork;

		this.timeAreaWidth = str.disc !== '' && pref.layout === 'default' ? gr.CalcTextWidth(`${str.disc}   ${str.time}   ${str.length}`, ft.lower_bar_title) : gr.CalcTextWidth(` ${str.time}   ${str.length}`, ft.lower_bar_title);
		this.lowerMargin   = scaleForDisplay((pref.layout === 'compact' || pref.layout === 'artwork' ? 60 : pref.showTransportControls_default ? 60 : 100) + (!playbackTime ? -this.timeAreaWidth : 0));

		// * Calculate all transport buttons width
		const buttonSize    = scaleForDisplay(transportBtnSize);
		const buttonCount   = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);
		const buttonSpacing = scaleForDisplay(transportBtnSpacing);

		// * Setup width for artist and song title
		this.availableWidth                = pref.layout === 'default' && pref.showTransportControls_default && (pref.showLowerBarArtist_default || pref.showLowerBarTitle_default) ? Math.round(ww * 0.5 - this.lowerMargin - ((buttonSize * buttonCount + buttonSpacing * buttonCount) / 2)) : Math.round(ww - this.lowerMargin - (playbackTime ? this.timeAreaWidth : 0));
		this.artistWidth                   = gr.MeasureString(str.artist, ft.lower_bar_artist, 0, 0, 0, 0).Width + availableFlags;
		this.trackNumWidth                 = Math.ceil(gr.MeasureString(str.tracknum, ft.lower_bar_title, 0, 0, 0, 0).Width);
		this.titleWidth                    = this.trackNumWidth + gr.MeasureString(showLowerBarComposer ? str.title_lower + str.composer + str.original_artist : str.title_lower + str.original_artist, ft.lower_bar_title, 0, 0, 0, 0).Width + gr.MeasureString(str.original_artist, ft.lower_bar_title, 0, 0, 0, 0).Width;
		this.artistMaxWidth_no_default     = ww - (this.titleWidth    + this.trackNumWidth + this.timeAreaWidth + this.lowerMargin);
		this.titleMaxWidth_no_default      = ww - (this.artistWidth   + this.timeAreaWidth + this.lowerMargin);
		this.artistOnlyMaxWidth_no_default = ww - (this.timeAreaWidth + this.lowerMargin);
		this.titleOnlyMaxWidth_no_default  = ww - (this.trackNumWidth + this.timeAreaWidth + this.lowerMargin);
	}

	clearTooltip() {
		this.tooltipText = '';
		tt.stop();
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		const zoneX = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		const zoneY = wh - geo.lowerBarHeight + scaleForDisplay(15);
		const zoneW = pref.layout === 'compact' || pref.layout === 'artwork' ? ww - this.lowerMargin - this.timeAreaWidth : this.availableWidth;
		const zoneH = geo.lowerBarHeight * 0.33;
		const zone = zoneX <= x && zoneY <= y && zoneX + zoneW >= x && zoneY + zoneH >= y;

		if (!zone && this.tooltipText.length) {
			this.clearTooltip();
		}
		return zone;
	}

	on_mouse_move(x, y) {
		let tooltip = '';
		const showLowerBarArtist   = pref.layout === 'compact' ? pref.showLowerBarArtist_compact   : pref.layout === 'artwork' ? pref.showLowerBarArtist_artwork   : pref.showLowerBarArtist_default;
		const showLowerBarTitle    = pref.layout === 'compact' ? pref.showLowerBarTitle_compact    : pref.layout === 'artwork' ? pref.showLowerBarTitle_artwork    : pref.showLowerBarTitle_default;
		const showLowerBarComposer = pref.layout === 'compact' ? pref.showLowerBarComposer_compact : pref.layout === 'artwork' ? pref.showLowerBarComposer_artwork : pref.showLowerBarComposer_default;

		if (pref.layout === 'default' && (this.artistWidth > this.availableWidth || this.titleWidth > this.availableWidth)) {
			tooltip = (`${str.artist}\n${str.tracknum === '' ? '' : `${str.tracknum} `}${str.title}${showLowerBarComposer ? str.composer : ''}`);
		}
		else if ((showLowerBarArtist && (this.titleWidth  > this.titleMaxWidth_no_default)  || !showLowerBarArtist && (this.titleWidth  > this.titleOnlyMaxWidth_no_default)) ||
				 (showLowerBarTitle  && (this.artistWidth > this.artistMaxWidth_no_default) || !showLowerBarTitle  && (this.artistWidth > this.artistOnlyMaxWidth_no_default))) {
			tooltip = (`${str.artist}\n${str.tracknum} ${str.title}${showLowerBarComposer ? str.composer : ''}`);
		}

		if (tooltip.length && this.mouseInThis(x, y)) {
			this.tooltipText = tooltip;
			tt.showDelayed(this.tooltipText);
		} else {
			this.clearTooltip();
		}
	}
}


//////////////////////////////
// * INTERFACE HYPERLINKS * //
//////////////////////////////
const HyperlinkStates = {
	Normal: 0,
	Hovered: 1
};


/** For every Hyperlink not created in Playlist */
function hyperlinks_on_mouse_move (hyperlink, x, y) {
	if (hyperlink.trace(x, y)) {
		if (hyperlink.state !== HyperlinkStates.Hovered) {
			hyperlink.state = HyperlinkStates.Hovered;
			window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
		}
		return true;
	}
	if (hyperlink.state !== HyperlinkStates.Normal) {
		hyperlink.state = HyperlinkStates.Normal;
		window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
	}
	return false;
}


class Hyperlink {
	/**
	 *
	 * @param {string} text The text that will be displayed in the hyperlink
	 * @param {GdiFont} font
	 * @param {string} type The field name which will be searched when clicking on the hyperlink
	 * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 * @param {number} yOffset y-offset of the hyperlink.
	 * @param {number} containerWidth The width of the container the hyperlink will be in. Used for right justification purposes.
	 * @param {boolean} [inPlaylist=false] If the hyperlink is drawing in a scrolling container like a playlist, then it is drawn differently
	 */
	constructor (text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false) {
		this.text = text;
		this.type = type;
		this.x_offset = xOffset;
		this.x = xOffset < 0 ? containerWidth + xOffset : xOffset;
		this.y_offset = yOffset;
		this.y = yOffset;
		this.container_w = containerWidth;
		this.state = HyperlinkStates.Normal;
		this.inPlaylist = inPlaylist;

		this.setFont(font);
	}

	// * METHODS * //

	/**
	 * Set the xOffset of the hyperlink after it has been created
	 * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 */
	set_xOffset(xOffset) {
		this.x = xOffset < 0 ? this.container_w + xOffset : xOffset;
	}

	set_y(y) {
		this.y = y + this.y_offset + (-2);	// Playlist requires subtracting 2 additional pixels from y for some reason
	}

	setFont(font) {
		this.font = font;
		this.hoverFont = gdi.Font(font.Name, font.Size, font.Style | g_font_style.underline);
		this.link_dimensions = this.updateDimensions();
	}

	/**
	 * Set the width of the container the hyperlink will be placed in.
	 * If hyperlink width is smaller than the container, it will be truncated.
	 * If the the xOffset is negative, the position will be adjusted as the container width changes.
	 * @param {number} w
	 */
	setContainerWidth(w) {
		if (this.x_offset < 0) {
			this.x = w + this.x_offset; // Add because offset is negative
		}
		this.container_w = pref.showPlaylistFullDate ? w - scaleForDisplay(320) : w - scaleForDisplay(240);
		this.link_dimensions = this.updateDimensions();
		this.w = Math.ceil(Math.min(this.container_w, this.link_dimensions.Width + 1));
	}

	/**
	 * Gets the width of the hyperlink
	 * @return {number} The width of the hyperlink
	 */
	getWidth() {
		try {
			return Math.ceil(this.link_dimensions.Width);
		} catch (e) {}
	}

	updateDimensions() {
		if (ww <= 0 || wh <= 0) return;
		const measureStringScratchImg = gdi.CreateImage(1000, 200);
		const gr = measureStringScratchImg.GetGraphics();
		const dimensions = gr.MeasureString(this.text, this.font, 0, 0, 0, 0);
		this.h = Math.ceil(dimensions.Height) + 1;
		this.w = Math.min(Math.ceil(dimensions.Width) + 1, this.container_w);
		measureStringScratchImg.ReleaseGraphics(gr);
		return dimensions;
	}

	repaint() {
		try {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		} catch (e) {
			// Probably already redrawing
		}
	}

	click() {
		const populatePlaylist = (query) => {
			debugLog(query);
			try {
				const handle_list = fb.GetQueryItems(fb.GetLibraryItems(), query);
				if (handle_list.Count) {
					playlistHistory.ignorePlaylistMutations = true;
					const pl = plman.FindOrCreatePlaylist('Search', true);
					plman.UndoBackup(pl);
					handle_list.Sort();
					const index = fb.IsPlaying ? handle_list.BSearch(fb.GetNowPlaying()) : -1;

					if (pl === plman.PlayingPlaylist && plman.GetPlayingItemLocation().PlaylistIndex === pl && index !== -1) {
						// Remove everything in playlist except currently playing song
						plman.ClearPlaylistSelection(pl);
						plman.SetPlaylistSelection(pl, [plman.GetPlayingItemLocation().PlaylistItemIndex], true);
						plman.RemovePlaylistSelection(pl, true);
						plman.ClearPlaylistSelection(pl);

						handle_list.RemoveById(index);
					}
					else {
						// Nothing playing or Search playlist is not active
						plman.ClearPlaylist(pl);
					}

					plman.InsertPlaylistItems(pl, 0, handle_list);
					plman.SortByFormat(pl, settings.playlistSortDefault);
					plman.ActivePlaylist = pl;
					playlistHistory.ignorePlaylistMutations = false;

					return true;
				}
				return false;
			}
			catch (e) {
				playlistHistory.ignorePlaylistMutations = false;
				console.log(`Could not successfully execute: ${query}`);
			}
		};

		/** @type {string} */
		let query;
		switch (this.type) {
			case 'update': runCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/releases'); break;
			case 'date':   query = pref.showPlaylistFullDate ? `"${tf.date}" IS ${this.text}` : `"$year(%date%)" IS ${this.text}`; break;
			case 'artist': query = `Artist HAS "${this.text.replace(/"/g, '')}" OR Album Artist HAS "${this.text.replace(/"/g, '')}" OR ARTISTFILTER HAS "${this.text.replace(/"/g, '')}"`; break;
			case 'album':
			case 'label':  query = this.text; break;
			default:       query = `${this.type} IS "${this.text}"`; break;
		}

		if (!populatePlaylist(query)) {
			const start = this.text.indexOf('[');
			if (start > 0) {
				query = `${this.type} IS ${this.text.substr(0, start - 3)}`; // Remove ' - [...]' from end of string in case we're showing "Album - [Deluxe Edition]", etc.
				populatePlaylist(query);
			}
		}
	}

	/**
	 * Draws the hyperlink. When drawing in a playlist, we draw from the y-offset instead of y, because the playlist scrolls.
	 * @param {GdiGraphics} gr
	 * @param {*} color
	 */
	draw(gr, color) {
		const font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
		gr.DrawString(this.text, font, color, this.x, this.inPlaylist ? this.y_offset : this.y, this.w, this.h, g_string_format.trim_ellipsis_char);
	}

	// * CALLBACKS * //

	trace(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}
}


//////////////////////////
// * DETAILS TIMELINE * //
//////////////////////////
class Timeline {
	constructor(height) {
		this.marginLeft = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.x = this.marginLeft;
		this.y = 0;
		this.w = albumArtSize.x - this.marginLeft * 2;
		this.h = height;

		this.playCol = RGBA(255, 255, 255, 150);

		/** @private */ this.firstPlayedPercent = 0.33;
		/** @private */ this.lastPlayedPercent = 0.66;
		/** @private */ this.playedTimesPercents = [];
		/** @private */ this.playedTimes = [];

		// Recalc'd in setSize
		/** @private */ this.lineWidth = is_4k ? 3 : 2;
		/** @private */ this.extraLeftSpace = scaleForDisplay(3); // Add a little space to the left so songs that were played a long time ago show more in the "added" stage
		/** @private */ this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2); // Area that the timeline percents can be drawn in
		/** @private */ this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2; // Percent of timeline that we use to determine if mouse is over a playline. Equals half line with + 1 or 2 pixels on either side

		this.tooltipText = '';
	}

	// * METHODS * //

	setSize(x, y, width) {
		if (this.x !== x || this.y !== y || this.w !== width) {
			this.x = x;
			this.y = y;
			this.w = width;

			// Recalc these values
			this.lineWidth = is_4k ? 3 : 2;
			this.extraLeftSpace = scaleForDisplay(3); // Add a little space to the left so songs that were played a long time ago show more in the "added" stage
			this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2);
			this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2;
		}
	}

	setHeight(height) {
		this.h = height;
	}

	setColors(addedCol, playedCol, unplayedCol) {
		this.addedCol = addedCol;
		this.playedCol = playedCol;
		this.unplayedCol = unplayedCol;
	}

	setPlayTimes(firstPlayed, lastPlayed, playedTimeRatios, playedTimesValues) {
		this.firstPlayedPercent = firstPlayed;
		this.lastPlayedPercent = lastPlayed;
		this.playedTimesPercents = playedTimeRatios;
		this.playedTimes = playedTimesValues;
	}

	clearTooltip() {
		this.tooltipText = '';
		tt.stop();
	}

	draw(gr) {
		if (this.addedCol && this.playedCol && this.unplayedCol) {
			gr.SetSmoothingMode(SmoothingMode.None); // Disable smoothing
			gr.FillSolidRect(this.marginLeft, this.y, this.drawWidth + this.extraLeftSpace + this.lineWidth, this.h, this.addedCol);
			if (['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
				gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, col.timelineFrame);
			}

			if (this.firstPlayedPercent >= 0 && this.lastPlayedPercent >= 0) {
				const x1 = Math.floor(this.drawWidth * this.firstPlayedPercent) + this.extraLeftSpace;
				const x2 = Math.floor(this.drawWidth * this.lastPlayedPercent) + this.extraLeftSpace;
				gr.FillSolidRect(x1 + this.marginLeft, this.y, this.drawWidth - x1 + this.extraLeftSpace, this.h, this.playedCol);
				gr.FillSolidRect(x2 + this.marginLeft, this.y, this.drawWidth - x2 + this.extraLeftSpace + this.lineWidth, this.h, this.unplayedCol);
			}
			for (let i = 0; i < this.playedTimesPercents.length; i++) {
				const x = Math.floor(this.drawWidth * this.playedTimesPercents[i]) + this.extraLeftSpace;
				if (!isNaN(x) && x <= this.w) {
					gr.DrawLine(x + this.marginLeft, this.y, x + this.marginLeft, this.y + this.h, this.lineWidth, this.playCol);
				} else {
					// console.log('Played Times Error! ratio: ' + this.playedTimesPercents[i], 'x: ' + x);
				}
			}
			gr.SetSmoothingMode(SmoothingMode.AntiAlias);
		}
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		const zone = scaleForDisplay(10);
		const inTimeline = x >= this.x && x < this.x + this.w && y >= this.y - zone && y < this.y + this.h + zone;
		if (!inTimeline && this.tooltipText.length) {
			this.clearTooltip();

		// * Workaround when using styled tooltips and fb.IsPaused while mouse hovering the timeline.
		// * Only in pause state, this needs to be somehow repainted to trigger displaying the tooltip.
		} else if (inTimeline && pref.showStyledTooltips && fb.IsPaused) {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}

		return inTimeline;
	}

	on_mouse_move(x, y, m) {
		if (pref.showTooltipTimeline) {
			let tooltip = '';
			const percent = toFixed((x + this.x - this.marginLeft * 2 - this.extraLeftSpace) / this.drawWidth, 3);

			// TODO: is this really slow with hundreds of plays?
			for (let i = 0; i < this.playedTimesPercents.length; i++) {
				if (percent >= this.playedTimesPercents[i] - this.leeway && percent < this.playedTimesPercents[i] + this.leeway) {
					const date = new Date(this.playedTimes[i]);
					if (tooltip.length) {
						tooltip += '\n';
					}
					tooltip += date.toLocaleString();
				}
				else if (percent < this.playedTimesPercents[i]) {
					// The list is sorted so we can abort early
					if (!tooltip.length) {
						if (i === 0) {
							const added = dateDiff($date('[%added%]'), this.playedTimes[0]);
							tooltip = added ? `First played after ${added}` : '';
						} else {
							tooltip = `No plays for ${dateDiff(new Date(this.playedTimes[i - 1]).toISOString(), this.playedTimes[i])}`;
						}
					}
					break;
				}
			}
			if (tooltip.length) {
				this.tooltipText = tooltip;
				tt.showImmediate(this.tooltipText);
			} else {
				this.clearTooltip();
			}
		}
	}
}


////////////////////
// * JUMPSEARCH * //
////////////////////
class JumpSearch {
	constructor() {
		this.arc1 = 5;
		this.arc2 = 4;
		this.j = {
			x: Math.round(pref.playlistLayout === 'full' || pref.layout !== 'default' ? ww * 0.5 : ww * 0.5 + ww * 0.25),
			y: Math.round((wh + geo.topMenuHeight - geo.lowerBarHeight - playlist_geo.row_h * 1.5) / 2),
			w: 50,
			h: 30
		};
		this.jSearch = '';
		this.jump_search = true;
		this.initials = null;
	}

	// * METHODS * //

	setY(y) {
		this.y = y;
	}

	draw(gr) {
		if (this.jSearch) {
			gr.SetSmoothingMode(4);
			this.j.w = gr.CalcTextWidth(this.jSearch, ft.notification) + 25;
			gr.FillRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, RGBtoRGBA(col.popupBg, 220));
			gr.DrawRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, 1, 0x64000000);
			gr.DrawRoundRect(this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w - 2, this.j.h - 2, this.arc2, this.arc2, 1, 0x28ffffff);
			// gr.GdiDrawText(this.jSearch, ft.notification, RGB(0, 0, 0), this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w, this.j.h, panel.cc); // Drop shadow not needed
			gr.GdiDrawText(this.jSearch, ft.notification, this.jump_search ? col.popupText : 0xffff4646, this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, panel.cc);
			gr.SetSmoothingMode(0);
		}
	}

	allEqual(str) {
		return str.split('').every(char => char === str[0]);
	}

	// * CALLBACKS * //

	on_char(code) {
		if (panel.search.active) return;
		const text = String.fromCharCode(code);
		switch (code) {
			case vk.back:
				this.jSearch = this.jSearch.substr(0, this.jSearch.length - 1);
				break;
			case vk.enter:
				this.jSearch = '';
				return;
			default:
				this.jSearch += text;
				break;
		}
		const playlistItems = plman.GetPlaylistItems(plman.ActivePlaylist);
		const search = fb.TitleFormat(pref.jumpSearchComposerOnly ? '%composer%' : '$if2(%album artist%, %artist%)').EvalWithMetadbs(playlistItems);
		let focusIndex = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
		let advance = false;
		let foundInPlaylist = false;
		let foundInLibrary = false;

		// * Playlist advance
		if (focusIndex >= 0 && focusIndex < search.length && (displayPlaylist || displayPlaylistLibrary(true))) {
			const char = search[focusIndex].replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (char === text && this.allEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}
		// * Library advance
		else if (panel.pos >= 0 && panel.pos < pop.tree.length && !displayPlaylistLibrary(true)) {
			const char = pop.tree[panel.pos].name.replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (pop.tree[panel.pos].sel && char === text && this.allEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}

		switch (true) {
			case advance: {
				if (utils.IsKeyPressed(0x0A) || utils.IsKeyPressed(0x08) ||  utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B) || utils.IsKeyPressed(0x6A) || utils.IsKeyPressed(0x6D)) return;
				let init = '';
				let cur = 'currentArr';
				if (!this.initials) { // reset in buildTree
					this.initials = {}
					// * Playlist advance
					if (displayPlaylist || displayPlaylistLibrary(true)) {
						playlistItems.Convert().forEach((v, i) => {
							const name = search[i].replace(/@!#.*?@!#/g, '');
							init = name.charAt().toLowerCase();
							if (cur !== init && !this.initials[init]) {
								this.initials[init] = [i];
								cur = init;
							} else {
								this.initials[init].push(i);
							}
							return true;
						});
					}
					// * Library advance
					else {
						pop.tree.forEach((v, i) => {
							if (!v.root) {
								const nm = v.name.replace(/@!#.*?@!#/g, '');
								init = nm.charAt().toLowerCase();
								if (cur !== init && !this.initials[init]) {
									this.initials[init] = [i];
									cur = init;
								} else {
									this.initials[init].push(i);
								}
							}
						});
					}
				}

				this.jump_search = false;

				// * Playlist advance
				if (focusIndex >= 0 && focusIndex < search.length && (displayPlaylist || displayPlaylistLibrary(true))) {
					this.matches = this.initials[text];
					console.log('Playlist advance results', this.matches); // Debug
					this.ix = this.matches.indexOf(focusIndex);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					focusIndex = this.matches[this.ix];
					this.jump_search = true;
				}
				// * Library advance
				else if (panel.pos >= 0 && panel.pos < pop.tree.length && !displayPlaylistLibrary(true)) {
					this.matches = this.initials[text];
					console.log('Library advance results', this.matches); // Debug, can remove this soon
					this.ix = this.matches.indexOf(panel.pos);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					panel.pos = this.matches[this.ix];
					this.jump_search = true;
				}

				// * Playlist advance
				if (this.jump_search && (displayPlaylist || displayPlaylistLibrary(true))) {
					plman.ClearPlaylistSelection(plman.ActivePlaylist);
					plman.SetPlaylistFocusItem(plman.ActivePlaylist, focusIndex);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, focusIndex, true);
					window.Repaint();
				}
				// * Library advance
				else if (this.jump_search && !displayPlaylistLibrary(true)) {
					pop.clearSelected();
					pop.sel_items = [];
					pop.tree[panel.pos].sel = true;
					pop.setPos(panel.pos);
					pop.getTreeSel();
					lib.treeState(false, ppt.rememberTree);
					window.Repaint();
					if (panel.imgView) pop.showItem(panel.pos, 'focus');
					else {
						const row = (panel.pos * ui.row.h - sbar.scroll) / ui.row.h;
						if (sbar.rows_drawn - row < 3 || row < 0) sbar.checkScroll((panel.pos + 3) * ui.row.h - sbar.rows_drawn * ui.row.h);
					}
					if (ppt.libSource) {
						if (pop.autoFill.key) pop.load(pop.sel_items, true, false, false, !ppt.sendToCur, false);
						pop.track(pop.autoFill.key);
					} else if (panel.pos >= 0 && panel.pos < pop.tree.length) pop.setPlaylistSelection(panel.pos, pop.tree[panel.pos]);
				}
				else {
					window.Repaint();
				}
				timer.clear(timer.jsearch2);
				timer.jsearch2.id = setTimeout(() => {
					this.jSearch = '';
					window.Repaint();
					timer.jsearch2.id = null;
				}, 2200);
			}
			break;

		case !advance:
			if (utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B) || utils.IsKeyPressed(0x6A) || utils.IsKeyPressed(0x6D)) return;
			if (!panel.search.active) {
				let pos = -1;
				pop.clearSelected();
				if (!this.jSearch) return;
				pop.sel_items = [];
				this.jump_search = true;
				window.Repaint();
				timer.clear(timer.jsearch1);

				timer.jsearch1.id = setTimeout(() => {
					// * First search in the Playlist
					playlistItems.Convert().some((v, i) => {
						const name = search[i].replace(/@!#.*?@!#/g, '');
						if (name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
							foundInPlaylist = true;
							pos = i;
							plman.ClearPlaylistSelection(plman.ActivePlaylist);
							plman.SetPlaylistFocusItem(plman.ActivePlaylist, pos);
							plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, pos, true);
							console.log(`Jumpsearch: "${name}" found in Playlist`); // Debug, can remove this soon
							return true;
						}
						return false;
					});
					// * If no Playlist results found, try search query in the Library
					if (!foundInPlaylist && pref.jumpSearchIncludeLibrary && pref.layout !== 'compact') {
						pop.tree.some((v, i) => {
							const name = v.name.replace(/@!#.*?@!#/g, '');
							if (name !== panel.rootName && name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
								foundInPlaylist = false;
								foundInLibrary = true;
								pos = i;
								v.sel = true;
								pop.setPos(pos);
								if (pop.autoFill.key) pop.getTreeSel();
								lib.treeState(false, ppt.rememberTree);
								console.log(`Jumpsearch: "${name}" found in Library`); // Debug, can remove this soon
								return true;
							}
							return false;
						});
					}

					if (!foundInPlaylist && !foundInLibrary) {
						this.jump_search = false;
						console.log('Jumpsearch: No results were found'); // Debug, can remove this soon
					}

					window.Repaint();

					if (foundInPlaylist) {
						displayPlaylist = true;
						displayLibrary = pref.libraryLayout === 'split' && displayPlaylist;
						displayBiography = false;
						pref.displayLyrics = false;
						initButtonState();
					}
					else if (foundInLibrary && pref.jumpSearchIncludeLibrary) {
						displayPlaylist = pref.libraryLayout === 'split' && displayPlaylist;
						displayLibrary = true;
						displayBiography = false;
						pref.displayLyrics = false;
						pop.showItem(pos, 'focus');
						this.jSearch = ''; // Reset to avoid conflict with other query
						initButtonState();
					}

					timer.jsearch1.id = null;
				}, 500);

				timer.clear(timer.jsearch2);

				timer.jsearch2.id = setTimeout(() => {
					this.jSearch = '';
					window.Repaint();
					timer.jsearch2.id = null;
				}, 1200);
			}
		}
	}

	on_size() {
		this.j.x = Math.round(pref.playlistLayout === 'full' || pref.layout !== 'default' ? ww * 0.5 : ww * 0.5 + ww * 0.25);
		this.j.h = Math.round(playlist_geo.row_h * 1.5);
		this.j.y = Math.round((wh + geo.topMenuHeight - geo.lowerBarHeight - this.j.h) / 2);
		this.arc1 = Math.min(5, this.j.h / 2);
		this.arc2 = Math.min(4, (this.j.h - 2) / 2);
	}
}


//////////////////////
// * PAUSE BUTTON * //
//////////////////////
class PauseButton {
	constructor() {
		this.xCenter = 0;
		this.yCenter = 0;
		this.top = 0;
		this.left = 0;
	}

	// * METHODS * //

	/**
	 * Set the coordinates of the center point of the pause button
	 * @param {number} xCenter The x-coordinate of the center of the pause button
	 * @param {number} yCenter The y-coordinate of the center of the pause button
	 */
	setCoords(xCenter, yCenter) {
		this.xCenter = xCenter;
		this.yCenter = yCenter;
		this.top = Math.round(this.yCenter - geo.pauseSize / 2);
		this.left = Math.round(this.xCenter - geo.pauseSize / 2);
	}

	repaint() {
		window.RepaintRect(this.left - 1, this.top - 1, geo.pauseSize + 2, geo.pauseSize + 2);
	}

	draw(gr) {
		const pauseBorderWidth = scaleForDisplay(2);
		const halfBorderWidth = Math.floor(pauseBorderWidth / 2);

		gr.SetSmoothingMode(SmoothingMode.AntiAlias); // Smooth edges

		gr.FillRoundRect(this.left, this.top, geo.pauseSize, geo.pauseSize,
			0.1 * geo.pauseSize, 0.1 * geo.pauseSize, RGBA(0, 0, 0, 150));
		gr.DrawRoundRect(this.left + halfBorderWidth, this.top + halfBorderWidth, geo.pauseSize - pauseBorderWidth, geo.pauseSize - pauseBorderWidth,
			0.1 * geo.pauseSize, 0.1 * geo.pauseSize, pauseBorderWidth, RGBA(128, 128, 128, 60));
		gr.FillRoundRect(this.left + 0.26 * geo.pauseSize, this.top + 0.25 * geo.pauseSize,
			0.12 * geo.pauseSize, 0.5 * geo.pauseSize, 2, 2, RGBA(255, 255, 255, 160));
		gr.FillRoundRect(this.left + 0.62 * geo.pauseSize, this.top + 0.25 * geo.pauseSize,
			0.12 * geo.pauseSize, 0.5 * geo.pauseSize, 2, 2, RGBA(255, 255, 255, 160));
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		return (x >= this.left && y >= this.top && x < this.left + geo.pauseSize + 1 && y <= this.top + geo.pauseSize + 1);
	}
}


////////////////////////
// * VOLUME CONTROL * //
////////////////////////
class Volume {
	constructor (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.mx = 0;
		this.my = 0;
		this.clickX = 0;
		this.clickY = 0;
		this.drag = false;
		this.dragVol = 0;
		this.tt = new TooltipHandler();

		/**
		 *
		 * @param {number} volume value between 0 and 1 where 1 is full volume
		 * @returns {number} a decibel value between -100 and 0, to pass to fb.Volume. 0 is max volume, -100 is min.
		 */
		this.toDb = (volume) => (50 * Math.log(0.99 * volume + 0.01)) / Math.LN10;
	}

	/**
	 * Returns the size in pixels of the fill portion of the volume bar, based on current volume
	 * @param {string} type Either 'h' or 'w' for vertical or horizontal volume bars
	 */
	fillSize(type) {
		return Math.ceil((type === 'w' ? this.w : this.h) * (10 ** (fb.Volume / 50) - 0.01) / 0.99);
	}

	lbtn_down(x, y) {
		if (this.trace(x, y)) {
			this.clickX = x;
			this.clickY = y;
			this.move(x, y);    // Force volume to update without needing to move or release lbtn
			return true;
		} else {
			return false;
		}
	}

	lbtn_up(x, y) {
		this.clickX = 0;
		this.clickY = 0;
		if (this.drag) {
			this.drag = false;
			return true;
		}
		const inVolumeSlider = this.trace(x, y);
		if (inVolumeSlider) {
			// We had not started a drag
			this.drag = true;
			this.move(x, y); // Adjust volume
			this.drag = false;
		}
		return inVolumeSlider;
	}

	leave() {
		this.drag = false;
	}

	move(x, y) {
		this.mx = x;
		this.my = y;

		if (this.clickX && this.clickY && (this.clickX !== x || this.clickY !== y)) {
			this.drag = true;
		}

		if (this.trace(x, y) || this.drag) {
			if (this.drag) {
				x -= this.x;
				const maxAreaExtraWidth = 0;   // Give a little bigger target area to select -0.00dB
				const pos = (x < maxAreaExtraWidth) ?
						0 :
						(x > this.w) ?
						1 : (x - maxAreaExtraWidth) / (this.w - maxAreaExtraWidth);

				this.dragVol = this.toDb(pos);
				fb.Volume = this.dragVol;
			}

			return true;
		}
		this.drag = false;
		if (pref.showTooltipVolume) {
			this.tt.stop();
		}
		return false;
	}

	/**
	 * Determines if a point is "inside" the bounds of the volume control.
	 * @param {number} x
	 * @param {number} y
	 */
	trace(x, y) {
		const margin = 5; // The area the mouse can go outside physical bounds of the volume control
		return x > this.x - margin && x < this.x + this.w + margin && y > this.y - margin && y < this.y + this.h + margin;
	}

	/**
	 * @param {number} scrollAmt
	 */
	wheel(scrollAmt) {
		if (!this.trace(this.mx, this.my)) {
			return false;
		}

		if (scrollAmt > 0) {
			fb.VolumeUp();
		} else {
			fb.VolumeDown();
		}

		return true;
	}
}


///////////////////////
// * VOLUME BUTTON * //
///////////////////////
class VolumeBtn {
	constructor() {
		// * Calculate all transport buttons width
		const showPlaybackOrderBtn = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact   : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork   : pref.showPlaybackOrderBtn_default;
		const showReloadBtn        = pref.layout === 'compact' ? pref.showReloadBtn_compact          : pref.layout === 'artwork' ? pref.showReloadBtn_artwork          : pref.showReloadBtn_default;
		const showVolumeBtn        = pref.layout === 'compact' ? pref.showVolumeBtn_compact          : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork          : pref.showVolumeBtn_default;
		const transportBtnSize     = pref.layout === 'compact' ? pref.transportButtonSize_compact    : pref.layout === 'artwork' ? pref.transportButtonSize_artwork    : pref.transportButtonSize_default;
		const transportBtnSpacing  = pref.layout === 'compact' ? pref.transportButtonSpacing_compact : pref.layout === 'artwork' ? pref.transportButtonSpacing_artwork : pref.transportButtonSpacing_default;
		const buttonSize           = scaleForDisplay(transportBtnSize);
		const buttonSpacing        = scaleForDisplay(transportBtnSpacing);
		const buttonCount          = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);
		const volumeBarWidth       = Math.ceil((ww - (buttonSize * buttonCount + buttonSpacing * buttonCount)) / 2 - scaleForDisplay(40));

		this.x = 0;
		this.y = 0;
		this.w = scaleForDisplay(ww < 600 ? volumeBarWidth : 100);
		this.h = scaleForDisplay(12);

		this.inThisPadding = this.w * 0.5;

		// * Runtime state
		this.mouseInPanel = false;
		this.displayVolumeBar = !pref.autoHideVolumeBar;

		// * Objects
		/** @type {Volume} */
		this.volumeBar = undefined;

		/**
		 *
		 * @param {number} volume value between 0 and 1 where 1 is full volume
		 * @returns {number} a percentage value between 0% and 100%, to pass to fb.Volume.
		 */
		this.toPercent = (volume) => (10 ** (volume / 50) - 0.01) / 0.99;
	}

	// * METHODS * //

	setPosition(x, y, btnWidth) {
		const wh = window.Height;
		const buttonSize_default = scaleForDisplay(pref.transportButtonSize_default);
		const buttonSize_artwork = scaleForDisplay(pref.transportButtonSize_artwork);
		const buttonSize_compact = scaleForDisplay(pref.transportButtonSize_compact);
		const center_default = Math.floor(buttonSize_default / 2 + scaleForDisplay(4));
		const center_artwork = Math.floor(buttonSize_artwork / 2 + scaleForDisplay(4));
		const center_compact = Math.floor(buttonSize_compact / 2 + scaleForDisplay(4));
		this.x = x + (pref.layout === 'compact' ? pref.transportButtonSize_compact * scaleForDisplay(1.25) : pref.layout === 'artwork' ? pref.transportButtonSize_artwork * scaleForDisplay(1.25) : pref.transportButtonSize_default * scaleForDisplay(1.25));
		this.y = y + (pref.layout === 'compact' ? center_compact : pref.layout === 'artwork' ? center_artwork : center_default) - this.h;
		this.volumeBar = new Volume(this.x, this.y, this.w, Math.min(wh - this.y, this.h));
	}

	showVolumeBar(show) {
		if (!this.volumeBar) return;

		this.displayVolumeBar = show;
		this.repaint();
		if (show) {
			this.volumeBar.tt.stop();
		}
	}

	toggleVolumeBar() {
		this.showVolumeBar(!this.displayVolumeBar);
	}

	repaint() {
		if (!this.volumeBar) return;
		const xyPadding = scaleForDisplay(3);
		const whPadding = xyPadding * 2;
		window.RepaintRect(this.x - xyPadding, this.volumeBar.y, this.volumeBar.w + whPadding, this.volumeBar.h + whPadding);
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		if (this.displayVolumeBar) {
			const { x, y, w, h } = this;
			const p = 2;
			const fillWidth = this.volumeBar && this.volumeBar.fillSize('w');

			gr.SetSmoothingMode(pref.styleVolumeBarDesign === 'rounded' ? SmoothingMode.AntiAlias : SmoothingMode.None);

			// * Default background
			if (pref.styleVolumeBarDesign === 'rounded' && pref.styleTransportButtons !== 'minimal') {
				gr.FillRoundRect(x - scaleForDisplay(2), y + (is_4k ? p + 1 : p), w + scaleForDisplay(2), h, scaleForDisplay(5), scaleForDisplay(5), col.volumeBar);
				gr.DrawRoundRect(x - (is_4k ? 5 : this.showReloadBtn ? 3 : 2), y + scaleForDisplay(1), w + (is_4k ? 5 : 3), h + 2, scaleForDisplay(6), scaleForDisplay(6), 1, col.volumeBarFrame);
			}
			else if (pref.styleVolumeBarDesign !== 'rounded' && pref.styleTransportButtons !== 'minimal') {
				gr.FillSolidRect(x - scaleForDisplay(2), y + (is_4k ? p + 1 : p), w + scaleForDisplay(2), h, col.volumeBar);
				gr.DrawRect(x - (is_4k ? 5 : this.showReloadBtn ? 3 : 2), y + scaleForDisplay(1), w + (is_4k ? 5 : 3), h + 1, 1, col.volumeBarFrame);
			}
			// * Style background
			if ((pref.styleVolumeBar === 'bevel' || pref.styleVolumeBar === 'inner') && pref.styleTransportButtons !== 'minimal') {
				if (pref.styleVolumeBarDesign === 'rounded') {
					FillGradRoundRect(gr, x - scaleForDisplay(2), y + (is_4k ? p + 1 : p) - (pref.styleVolumeBar === 'inner' ? 1 : 0), w + scaleForDisplay(5), h + scaleForDisplay(4), scaleForDisplay(6), scaleForDisplay(6),
					pref.styleVolumeBar === 'inner' ? -89 : 89, pref.styleVolumeBar === 'inner' ? col.styleVolumeBar : 0, pref.styleVolumeBar === 'inner' ? 0 : col.styleVolumeBar, pref.styleVolumeBar === 'inner' ? 0 : 1);
				} else {
					gr.FillGradRect(x - scaleForDisplay(2), y + (is_4k ? p + (pref.styleVolumeBar === 'inner' ? 0 : 2) : p), w + scaleForDisplay(2), h, pref.styleVolumeBar === 'inner' ? -90 : 90, 0, col.styleVolumeBar);
				}
			}
			// * Default fill
			if (pref.styleVolumeBarDesign === 'rounded') {
				try { gr.FillRoundRect(x + 1, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(3), h - scaleForDisplay(4), scaleForDisplay(3), scaleForDisplay(3), col.volumeBarFill); } catch (e) {}
			} else {
				gr.FillSolidRect(x, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(2), h - scaleForDisplay(4), col.volumeBarFill);
			}
			// * Style fill
			if (pref.styleVolumeBarFill === 'bevel' || pref.styleVolumeBarFill === 'inner') {
				try {
					if (pref.styleVolumeBarDesign === 'rounded') {
						FillGradRoundRect(gr, x + 1, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(0.5), h - scaleForDisplay(2), scaleForDisplay(3), scaleForDisplay(3), pref.styleVolumeBarFill === 'inner' ? -89 : 89, 0, col.styleVolumeBarFill, 1);
					} else {
						gr.FillGradRect(x, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(2), h - scaleForDisplay(3), pref.styleVolumeBarFill === 'inner' ? -90 : 90, pref.styleBlackAndWhite ? col.styleVolumeBarFill : 0, pref.styleBlackAndWhite ? 0 : col.styleVolumeBarFill);
					}
				} catch (e) {}
			}
		}
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		const padding = this.inThisPadding;
		if (x >  this.x - padding &&
			x <= this.x + this.w + padding &&
			y >  this.y - this.h - padding * 0.2 &&
			y <= this.y - this.h + padding) {
			return true;
		}
		return false;
	}

	on_mouse_lbtn_down(x, y, m) {
		if (!this.volumeBar) return;

		if (this.displayVolumeBar) {
			return this.volumeBar.lbtn_down(x, y);
		}
		return false;
	}

	on_mouse_lbtn_up(x, y, m) {
		if (!this.volumeBar) return;

		if (!pref.lockPlayerSize) qwr_utils.EnableSizing(m);

		if (this.displayVolumeBar) {
			return this.volumeBar.lbtn_up(x, y);
		}
	}

	on_mouse_move(x, y, m) {
		if (!this.volumeBar || !this.displayVolumeBar) return;

		qwr_utils.DisableSizing(m);

		if (this.volumeBar.drag) {
			this.volumeBar.move(x, y);
			return;
		}

		this.mouseInPanel = this.displayVolumeBar && this.volumeBar.trace(x, y);

		if (this.displayVolumeBar) {
			if (this.mouseInThis(x, y)) {
				this.volumeBar.move(x, y);
			} else if (pref.autoHideVolumeBar) {
				this.showVolumeBar(false);
				this.repaint();
			}
			const inVolumeBar = x > this.x && x <= this.x + this.w && y > this.y && y <= this.y + this.h;
			const volTooltip = pref.showTooltipVolumeInPercent ? `${Math.ceil(this.toPercent(fb.Volume) * 100)} %` : `${Math.ceil(fb.Volume.toFixed(2))} dB`;
			if (pref.showTooltipVolume && inVolumeBar) {
				this.volumeBar.tt.showImmediate(volTooltip);
			}
		}
	}

	on_mouse_leave() {
		if (!this.volumeBar || this.volumeBar.drag) return;

		this.mouseInPanel = false;

		if (this.displayVolumeBar && pref.autoHideVolumeBar) {
			this.showVolumeBar(false);
			this.repaint();
		}
		if (pref.autoHideVolumeBar) {
			this.volumeBar.leave();
		}
	}

	on_mouse_wheel(delta) {
		if (this.mouseInPanel) {
			if (!this.displayVolumeBar || !this.volumeBar.wheel(delta)) {
				if (delta > 0) {
					fb.VolumeUp();
				}
				else {
					fb.VolumeDown();
				}
			}
			return true;
		}
		return false;
	}

	on_volume_change(val) {
		if (this.displayVolumeBar) {
			this.repaint();
		}
		const volTooltip = pref.showTooltipVolumeInPercent ? `${Math.ceil(this.toPercent(fb.Volume) * 100)} %` : `${Math.ceil(fb.Volume.toFixed(2))} dB`;
		if (pref.showTooltipVolume) this.volumeBar.tt.showImmediate(volTooltip);
	}
}


//////////////////////
// * PROGRESS BAR * //
//////////////////////
class ProgressBar {
	/**
	 * @param {number} ww window.Width
	 * @param {number} wh window.Height
	 */
	constructor(ww, wh) {
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.w = ww - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.y = 0;
		this.h = geo.progBarHeight;
		this.progressLength = 0; // Fixing jumpiness in progressBar
		this.progressMoved = false; // Playback position changed, so reset progressLength
		this.drag = false;	// Progress bar is being dragged
		this.progressAlphaCol = undefined;
		this.lastAccentCol = undefined;
	}

	// * METHODS * //

	setY(y) {
		this.y = y;
	}

	/** @private
	 * @param {number} x
	 */
	setPlaybackTime(x) {
		let v = (x - this.x) / this.w;
		v = (v < 0) ? 0 : (v < 1) ? v : 1;
		if (fb.PlaybackTime !== v * fb.PlaybackLength) {
			fb.PlaybackTime = v * fb.PlaybackLength;
		}
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		if (pref.showProgressBar_default || pref.showProgressBar_artwork || pref.showProgressBar_compact) {
			gr.SetSmoothingMode(pref.styleProgressBarDesign === 'rounded' ? SmoothingMode.AntiAlias : SmoothingMode.None);
			const arc = scaleForDisplay(pref.layout !== 'default' ? 5 : 6);

			try {
				// * Progress bar background
				if (pref.styleProgressBarDesign === 'rounded') {
					gr.FillRoundRect(this.x, this.y, this.w, this.h, arc, arc, isStreaming && fb.IsPlaying ? col.progressBarStreaming : col.progressBar);
				} else if (!['dots', 'thin'].includes(pref.styleProgressBarDesign)) {
					gr.FillSolidRect(this.x, this.y, this.w, this.h, isStreaming && fb.IsPlaying ? col.progressBarStreaming : col.progressBar);
				}
				if (pref.styleDefault && (['blue', 'darkblue', 'red', 'cream', 'custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) ||
					(pref.theme === 'cream' && (pref.styleAlternative || pref.styleAlternative2) && (!pref.styleBevel && !pref.styleBlend && !pref.styleBlend2 && pref.styleProgressBarDesign !== 'rounded')) && !pref.systemFirstLaunch) {
					gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, col.progressBarFrame);
				}
				if (!['dots', 'thin'].includes(pref.styleProgressBarDesign) && (pref.styleProgressBar === 'bevel' || pref.styleProgressBar === 'inner')) {
					if (pref.styleProgressBarDesign === 'rounded') {
						FillGradRoundRect(gr, this.x, this.y, this.w + scaleForDisplay(2), this.h + scaleForDisplay(2.5), arc, arc,
							pref.styleProgressBar === 'inner' ? pref.styleBlackReborn && fb.IsPlaying ? 90 : -90 : pref.styleBlackReborn && fb.IsPlaying ? -90 : 90, 0, col.styleProgressBar, 1);
					} else {
						gr.FillGradRect(this.x, this.y, this.w, this.h, pref.styleProgressBar === 'inner' ? pref.styleBlackReborn && fb.IsPlaying ? 90 : -90 : pref.styleBlackReborn && fb.IsPlaying ? -90 : 90, 0, col.styleProgressBar);
					}
					if (pref.styleProgressBarDesign === 'rounded') { // Smooth top and bottom line edges
						gr.FillGradRect(this.x + scaleForDisplay(3), this.y - 0.5, scaleForDisplay(9), 1, 179, col.styleProgressBarLineTop, 0); // Top left
						gr.FillGradRect(this.x + scaleForDisplay(3), this.y + this.h - 0.5, scaleForDisplay(9), 1, 179, col.styleProgressBarLineBottom, 0); // Bottom left
						gr.FillGradRect(this.w + this.x - scaleForDisplay(12), this.y - 0.5, scaleForDisplay(9), 1, 179, 0, col.styleProgressBarLineTop); // Top right
						gr.FillGradRect(this.w + this.x - scaleForDisplay(12), this.y + this.h - 0.5, scaleForDisplay(9), 1, 179, 0, col.styleProgressBarLineBottom); // Bottom right
					}
					gr.DrawLine(this.x + (pref.styleProgressBarDesign === 'rounded' ? scaleForDisplay(12) : 0), this.y, this.x + this.w - (pref.styleProgressBarDesign === 'rounded' ? scaleForDisplay(12) : 1), this.y, 1, col.styleProgressBarLineTop);
					gr.DrawLine(this.x + (pref.styleProgressBarDesign === 'rounded' ? scaleForDisplay(12) : 0), this.y + this.h, this.x + this.w - (pref.styleProgressBarDesign === 'rounded' ? scaleForDisplay(12) : 1), this.y + this.h, 1, col.styleProgressBarLineBottom);
				}

				// * Progress bar fill
				if (fb.PlaybackLength) {
					let progressStationary = false;
					/* In some cases the progress bar would move backwards at the end of a song while buffering/streaming was occurring.
						This created strange looking jitter so now the progress bar can only increase unless the user seeked in the track. */
					if (this.progressMoved || Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
						this.progressLength = Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength));
					} else {
						progressStationary = true;
					}
					this.progressMoved = false;

					if (pref.styleProgressBarDesign === 'default') {
						gr.FillSolidRect(this.x, this.y, this.progressLength, this.h, col.progressBarFill);
					}
					else if (pref.styleProgressBarDesign === 'rounded') {
						gr.FillRoundRect(this.x, this.y, this.progressLength, this.h, arc, arc, col.progressBarFill);
					}
					else if (pref.styleProgressBarDesign === 'lines') {
						let progressLine = 0;
						if (progressLine < this.progressLength) {
							gr.FillSolidRect(this.x + this.progressLength, this.y, scaleForDisplay(2), geo.progBarHeight, col.progressBarFill);
						}
						while (progressLine < this.progressLength) {
							gr.DrawLine(this.x + progressLine + scaleForDisplay(2), this.y, this.x + progressLine + scaleForDisplay(2), this.y + this.h, scaleForDisplay(2), col.progressBarFill);
							progressLine += scaleForDisplay(4);
						}
					}
					else if (pref.styleProgressBarDesign === 'blocks') {
						let progressLine = 0;
						while (progressLine < this.progressLength) {
							gr.FillSolidRect(this.x + progressLine, this.y + scaleForDisplay(2), geo.progBarHeight, geo.progBarHeight - scaleForDisplay(4), col.progressBarFill);
							progressLine += geo.progBarHeight + scaleForDisplay(2);
						}
						gr.FillSolidRect(this.x + this.progressLength, this.y + 1, geo.progBarHeight, geo.progBarHeight - 1, col.progressBar);
						gr.FillGradRect(this.x + this.progressLength,  this.y + 1, geo.progBarHeight, geo.progBarHeight - 1, pref.styleProgressBar === 'inner' ? pref.styleBlackReborn && fb.IsPlaying ? 88 : -88 : pref.styleBlackReborn && fb.IsPlaying ? -88 : 88, 0, col.styleProgressBar);
					}
					else if (pref.styleProgressBarDesign === 'dots') {
						let progressLine = 0;
						while (progressLine < this.progressLength) {
							gr.DrawLine(this.x + this.progressLength + scaleForDisplay(10), this.y + this.h * 0.5, this.x + this.w, this.y + this.h * 0.5, scaleForDisplay(1), col.progressBar);
							gr.SetSmoothingMode(SmoothingMode.AntiAlias);
							gr.DrawEllipse(this.x + progressLine, this.y + this.h * 0.5 - scaleForDisplay(1), scaleForDisplay(2), scaleForDisplay(2), scaleForDisplay(2), col.progressBarFill);
							progressLine += scaleForDisplay(8);
						}
						const posFix = is_4k ? pref.layout !== 'default' ? 6 : 7 : 3;
						gr.DrawEllipse(this.x + progressLine, this.y + this.h * 0.5 - geo.progBarHeight * 0.5 + scaleForDisplay(2), geo.progBarHeight - scaleForDisplay(4), geo.progBarHeight - scaleForDisplay(4), scaleForDisplay(2), col.progressBarFill); // Knob outline
						gr.DrawEllipse(this.x + progressLine + posFix, this.y + this.h * 0.5 - scaleForDisplay(1), scaleForDisplay(2), scaleForDisplay(2), scaleForDisplay(2), col.transportIconHovered); // Knob inner
					}
					else if (pref.styleProgressBarDesign === 'thin') {
						gr.DrawLine(this.x, this.y + this.h * 0.5, this.x + this.w, this.y + this.h * 0.5, scaleForDisplay(1), col.progressBar);
						gr.SetSmoothingMode(SmoothingMode.AntiAlias);
						gr.FillSolidRect(this.x, this.y + this.h * 0.5 - scaleForDisplay(2), this.progressLength, scaleForDisplay(4), col.progressBarFill);
						gr.FillSolidRect(this.x + this.progressLength, this.y + this.h * 0.5 - scaleForDisplay(3), scaleForDisplay(6), scaleForDisplay(6), col.progressBarFill);
					}

					if (!['dots', 'thin'].includes(pref.styleProgressBarDesign) && fb.IsPlaying && (pref.styleProgressBarFill === 'bevel' || pref.styleProgressBarFill === 'inner')) {
						if (pref.styleProgressBarDesign === 'rounded') {
							FillGradRoundRect(gr, this.x, this.y, this.progressLength + scaleForDisplay(2), this.h + scaleForDisplay(2.5), arc, arc, pref.styleProgressBarFill === 'inner' ? -88 : 88, col.styleProgressBarFill, 0);
						} else {
							gr.FillGradRect(this.x, this.y, this.progressLength, this.h, pref.styleProgressBarFill === 'inner' ? -90 : 89, 0, col.styleProgressBarFill);
						}
					}
					else if (fb.IsPlaying && pref.styleProgressBarFill === 'blend' && albumArt && blendedImg) {
						if (pref.styleProgressBarDesign === 'rounded') {
							FillBlendedRoundRect(gr, this.x, this.y, this.progressLength + scaleForDisplay(2), this.h + scaleForDisplay(2.5), arc, arc, 88, blendedImg, 0);
						} else {
							gr.DrawImage(blendedImg, this.x, this.y, this.progressLength, this.h, 0, this.h, blendedImg.Width, blendedImg.Height);
						}
					}
				}
			} catch (e) {}
		}
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
	}

	on_mouse_lbtn_down(x, y) {
		this.drag = true;
	}

	on_mouse_lbtn_up(x, y) {
		this.drag = false;
		if (this.mouseInThis(x, y)) {
			this.setPlaybackTime(x);
		}
	}

	on_mouse_move(x, y) {
		if (this.drag) {
			this.setPlaybackTime(x);
		}
	}

	on_size(w, h) {
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.y = 0;
		this.w = w - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.h = geo.progBarHeight;
		this.progressMoved = true;
	}
}


///////////////////////
// * PEAKMETER BAR * //
///////////////////////
class PeakmeterBar {
	constructor(ww, wh) {
		if (componentVUMeter) this.VUMeter = new ActiveXObject('VUMeter');
		// * Geometry - Style Horizontal
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.y = 0;
		this.w = ww - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.w2 = 0;
		this.h = geo.peakmeterBarHeight;
		this.bar_h = pref.layout !== 'default' ? scaleForDisplay(2) : scaleForDisplay(4);
		this.offset = 0;
		this.middleOffset = 0;
		this.middle_w = 0;

		// * Top
		this.outerLeft_w = 0;
		this.outerLeft_w_old = 0;
		this.outerLeftAnim_w = 0;
		this.outerLeftAnim_x = 0;
		this.outerLeft_k = 0;

		this.mainLeft_x = 0;
		this.mainLeftAnim_x = 0;
		this.mainLeftAnim2_x = 0;
		this.mainLeft_k = 0;
		this.mainLeft2_k = 0;

		// * Bottom
		this.outerRight_w = 0;
		this.outerRight_w_old = 0;
		this.outerRightAnim_w = 0;
		this.outerRightAnim_x = 0;
		this.outerRight_k = 0;

		this.mainRight_x = 0;
		this.mainRightAnim_x = 0;
		this.mainRightAnim2_x = 0;
		this.mainRight_k = 0;
		this.mainRight2_k = 0;

		// * Progress bar state
		this.progressLength = 0;
		this.progressMoved = false;
		this.drag = false;

		// * Mouse events
		this.pos_x = 0;
		this.pos_y = 0;
		this.on_mouse = false;
		this.wheel = false;

		// * Text
		this.textFont = gdi.Font('Segoe UI', is_4k ? 16 : 9, 1);
		this.textFont2 = gdi.Font('Segoe UI', is_4k ? 20 : 11, 0);
		this.textWidth = 0;
		this.textHeight = 0;
		this.tooltipText = '';
		this.tooltipTimer = null;

		// * Volume
		this.toDb = (Level) => Math.round(2000 * Math.log(Level) / Math.LN10) / 100;
		this.db_middle = [-100, -95, -90, -85, -80, -75, -70, -65, -62.5, -60, -57.5, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -32.5, -30, -27.5, -25, -22.5];
		this.db = [-20, -17.5, -15, -12.5, -10, -7.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5,	0, 0.1, 1, 1.5, 2, 2.5, 3, 3.5, 5];
		this.db_vert =
			pref.peakmeterBarVertDbRange === 220 ? [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2] :
			pref.peakmeterBarVertDbRange === 215 ? [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2] :
			pref.peakmeterBarVertDbRange === 210 ? [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2] :
			pref.peakmeterBarVertDbRange === 320 ? [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3] :
			pref.peakmeterBarVertDbRange === 315 ? [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3] :
			pref.peakmeterBarVertDbRange === 310 ? [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3] :
			pref.peakmeterBarVertDbRange === 520 ? [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] :
			pref.peakmeterBarVertDbRange === 515 ? [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] :
			pref.peakmeterBarVertDbRange === 510 ? [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5] : '';

		this.points_middle = this.db_middle.length;
		this.points = this.db.length;
		this.points_vert = this.db_vert.length;
		this.leftPeaks_s = [];
		this.rightPeaks_s = [];

		for (let i = 0; i <= this.points_vert; i++) {
			this.leftPeaks_s[i] = 0;
			this.rightPeaks_s[i] = 0;
		}

		// * Geometry - Style Vertical
		this.vertBar_offset = ((this.w / this.points_vert) + ((pref.peakmeterBarVertSize === 'min' ? 2 : pref.peakmeterBarVertSize) / this.points_vert * 0.5)) * 0.5;
		this.vertBar_w = pref.peakmeterBarVertSize === 'min' ? Math.ceil(this.vertBar_offset * 0.1 * 0.5) : this.vertBar_offset - pref.peakmeterBarVertSize * 0.5;
		this.vertBar_h = 2;
		this.vertLeft_x = this.x;
		this.vertRight_x = this.vertLeft_x + this.vertBar_offset * this.points_vert;

		// * Colors
		this.separator = 0;

		for (let i = 0; i <= this.db.length; i++) {
			if (this.db[i] === 0) this.separator = i;
		}

		this.sep1 = this.separator;
		this.sep2 = this.points - this.sep1;
		this.setColors(fb.GetNowPlaying());
	}

	// * METHODS * //

	setY(y) { // * Bars ordered from top to bottom
		this.y = y;
		this.overLeft_y    = this.y;
		this.outerLeft_y   = this.overLeft_y    + this.bar_h * 0.5;
		this.mainLeft_y    = this.outerLeft_y   + this.bar_h;
		this.middleLeft_y  = this.mainLeft_y    + this.bar_h + scaleForDisplay(1);
		this.middleRight_y = this.middleLeft_y  + this.bar_h * 0.5;
		this.mainRight_y   = this.middleRight_y + this.bar_h * 0.5 + scaleForDisplay(1);
		this.outerRight_y  = this.mainRight_y   + this.bar_h;
		this.overRight_y   = this.outerRight_y  + this.bar_h;
		this.text_y        = this.outerRight_y  + this.bar_h * 2;
	}

	setAnimation() {
		// * Set and monitor volume level/peaks from VUMeter
		this.leftLevel  = this.toDb(this.VUMeter.LeftLevel);
		this.leftPeak   = this.toDb(this.VUMeter.LeftPeak);
		this.rightLevel = this.toDb(this.VUMeter.RightLevel);
		this.rightPeak  = this.toDb(this.VUMeter.RightPeak);

		// * Debug stuff
		// console.log('LEFT PEAKS: ',  this.leftPeak,   '      RIGHT PEAKS: ',  this.rightPeak);
		// console.log('LEFT LEVEL:  ', this.leftLevel,  '      RIGHT LEVEL:  ', this.rightLevel, '\n\n');

		// * Set horizontal animation
		if (pref.peakmeterBarDesign === 'horizontal' || pref.peakmeterBarDesign === 'horizontal_center') {
			// * Main left middle peaks
			if (this.mainLeftAnim_x <= this.mainLeft_x) {
				this.mainLeftAnim_x  = this.mainLeft_x;
				this.mainLeftAnim2_x = this.mainLeft_x;
				this.mainLeft_k  = 0;
				this.mainLeft2_k = 0;
			};

			this.mainLeft_k      = this.mainLeft_k + 0.3 ** 2;
			this.mainLeftAnim_x  = this.mainLeftAnim_x - this.mainLeft_k;
			this.mainLeft2_k     = this.mainLeft2_k + 1.1 ** 2;
			this.mainLeftAnim2_x = this.mainLeftAnim2_x + this.mainLeft2_k;

			// * Main right middle peaks
			if (this.mainRightAnim_x <= this.mainRight_x) {
				this.mainRightAnim_x  = this.mainRight_x;
				this.mainRightAnim2_x = this.mainRight_x;
				this.mainRight_k  = 0;
				this.mainRight2_k = 0;
			};

			this.mainRight_k      = this.mainRight_k + 0.3 ** 2;
			this.mainRightAnim_x  = this.mainRightAnim_x - this.mainRight_k;
			this.mainRight2_k     = this.mainRight2_k + 1.1 ** 2;
			this.mainRightAnim2_x = this.mainRightAnim2_x + this.mainRight2_k;

			// * Outer left peaks
			if (this.outerLeftAnim_x <= this.outerLeft_w) {
				this.outerLeftAnim_x  = this.outerLeft_w;
				this.outerLeft_k = 0;
				this.outerLeftAnim_w = this.outerLeft_w - this.outerLeft_w_old < 1 ? this.outerLeftAnim_w : this.outerLeft_w - this.outerLeft_w_old + 10;
			} else {
				this.outerLeft_w_old = this.outerLeft_w;
			};

			this.outerLeft_k     = this.outerLeft_k + 0.3 ** 2;
			this.outerLeftAnim_x = this.outerLeftAnim_x - this.outerLeft_k;
			this.outerLeftAnim_w = this.outerLeftAnim_w - this.outerLeft_k * 2;

			// * Outer right peaks
			if (this.outerRightAnim_x <= this.outerRight_w) {
				this.outerRightAnim_x  = this.outerRight_w;
				this.outerRight_k = 0;
				this.outerRightAnim_w = this.outerRight_w - this.outerRight_w_old < 1 ? this.outerRightAnim_w : this.outerRight_w - this.outerRight_w_old + 10;
			} else {
				this.outerRight_w_old = this.outerRight_w;
			};

			this.outerRight_k     = this.outerRight_k + 0.3 ** 2;
			this.outerRightAnim_x = this.outerRightAnim_x - this.outerRight_k;
			this.outerRightAnim_w = this.outerRightAnim_w - this.outerRight_k * 2;
		}
		// * Set vertical animation
		else if (pref.peakmeterBarDesign === 'vertical') {
			for (let j = 0; j < this.leftPeaks_s.length;   j++) this.leftPeaks_s[j]  = this.leftPeaks_s[j]  < this.h ? this.leftPeaks_s[j]  + 2 : this.h;
			for (let j = 0; j < this.rightPeaks_s.length;  j++) this.rightPeaks_s[j] = this.rightPeaks_s[j] < this.h ? this.rightPeaks_s[j] + 2 : this.h;
		}
	}

	setColors(metadb) {
		let img = gdi.CreateImage(1, 1);
		const g = img.GetGraphics();
		if (img) img.ReleaseGraphics(g);
		if (metadb) img = utils.GetAlbumArtV2(metadb, 0);

		if (metadb && img) {
			this.colors = JSON.parse(img.GetColourSchemeJSON(4));
			this.c1 = col.peakmeterBarFillMiddle; // this.colors[1].col;
			this.c2 = col.peakmeterBarFillTop; // this.colors[2].col;
			this.c3 = col.peakmeterBarFillBack; // this.colors[3].col;
		} else {
			this.setDefaultColors();
		}

		this.color = [];
		this.combinedColor1 = [];
		this.combinedColor2 = [];
		this.color1 = [this.c2, this.c3];
		this.color2 = [this.c3, this.c1];

		for (let j = 0; j < this.sep1; j++) this.combinedColor1.push(combineColors(this.color1[0], this.color1[1], j / this.sep1));
		for (let j = 0; j < this.sep2; j++) this.combinedColor2.push(combineColors(this.color2[0], this.color2[1], j / this.sep2));

		this.color = this.combinedColor1.concat(this.combinedColor2);
	}

	setDefaultColors() {
		this.c1 = col.peakmeterBarFillMiddle; // RGB(0, 200, 255);
		this.c2 = col.peakmeterBarFillTop; // RGB(255, 255, 0);
		this.c3 = col.peakmeterBarFillBack; // RGB(230, 230, 30);
		this.color1 = [this.c3, this.c1];
		this.color2 = [this.c2, this.c3];
	}

	setPlaybackTime(x) {
		let v = (x - this.x) / this.w;
		v = (v < 0) ? 0 : (v < 1) ? v : 1;
		if (fb.PlaybackTime !== v * fb.PlaybackLength) {
			fb.PlaybackTime = v * fb.PlaybackLength;
		}
	}

	draw(gr) {
		// * Style Horizontal
		if (pref.peakmeterBarDesign === 'horizontal' && fb.IsPlaying) {
			// * Progress Bar
			if (pref.peakmeterBarProgBar && fb.PlaybackLength) {
				let progressStationary = false;
				if (this.progressMoved || Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
					this.progressLength = Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength));
				} else {
					progressStationary = true;
				}
				this.progressMoved = false;

				gr.FillSolidRect(this.x, this.middleLeft_y, this.w, this.bar_h, col.peakmeterBarProg);
				gr.FillSolidRect(this.x, this.middleLeft_y, this.progressLength, this.bar_h, col.peakmeterBarProgFill);
			}
			// * Middle bars
			else if (pref.peakmeterBarMiddleBars) {
				for (let i = 0; i <= this.points_middle; i++) {
					if (this.leftPeak > this.db_middle[i]) {
						gr.FillSolidRect(this.x + i * this.middleOffset, this.middleLeft_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
					}
					if (this.rightPeak > this.db_middle[i]) {
						gr.FillSolidRect(this.x + i * this.middleOffset, this.middleRight_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
					}
				}
			}
			// * Grid
			if (pref.peakmeterBarGrid) {
				gr.FillSolidRect(this.x, this.y, this.w, this.bar_h, col.peakmeterBarProg);
				gr.FillSolidRect(this.x, this.outerRight_y, this.w, this.bar_h, col.peakmeterBarProg);
			}

			for (let i = 0; i <= this.points; i++) {
				// * MAIN BARS * //
				if (this.leftPeak > this.db[i]) {
					if (pref.peakmeterBarMainBars) {
						// * Main left bars
						gr.FillSolidRect(this.x + i * this.offset, this.mainLeft_y, this.w2, this.bar_h, this.color[i]);
					}

					// * Main left middle peaks
					if (this.leftPeak < this.db[i + 1]) {
						this.mainLeft_x = i * this.offset;
					};
					if (pref.peakmeterBarMainPeaks) {
						gr.FillSolidRect(this.x + this.mainLeftAnim_x + this.offset, this.mainLeft_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);

						// * Main left top peaks
						const x = clamp(this.x + this.mainLeftAnim2_x + this.offset + this.w2 * 0.66, this.x, this.x + this.w - this.w2 * 0.33); // Don't extend right edge of bar
						const w = x > this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend right edge of bar
						gr.FillSolidRect(x, this.mainLeft_y, w, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
					}
				}
				if (this.rightPeak > this.db[i]) {
					if (pref.peakmeterBarMainBars) {
						// * Main right bars
						gr.FillSolidRect(this.x + i * this.offset, this.mainRight_y, this.w2, this.bar_h, this.color[i]);
					}

					// * Main right middle peaks
					if (this.rightPeak < this.db[i + 1]) {
						this.mainRight_x = i * this.offset;
					};
					if (pref.peakmeterBarMainPeaks) {
						gr.FillSolidRect(this.x + this.mainRightAnim_x + this.offset, this.mainRight_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainRightAnim_x / this.offset)]);

						// * Main right top peaks
						const x = clamp(this.x + this.mainRightAnim2_x + this.offset + this.w2 * 0.66, this.x, this.x + this.w - this.w2 * 0.33); // Don't extend right edge of bar
						const w = x >= this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend right edge of bar
						gr.FillSolidRect(x, this.mainRight_y, w, this.bar_h, this.color[Math.round(this.mainRightAnim_x / this.offset)]);
					}
				}

				// * OUTER BARS * //
				if (this.leftLevel > this.db[i]) {
					// * Outer left bars
					if (this.leftLevel < this.db[i + 1]) {
						this.outerLeft_w = i * this.offset + this.offset / Math.abs(this.db[i + 1] - this.db[i]) * Math.abs(this.leftLevel - this.db[i]) - this.x;
					}
					if (pref.peakmeterBarOuterBars) {
						gr.FillSolidRect(this.x, this.outerLeft_y, this.outerLeft_w, this.bar_h, this.color[1]);
					}

					// * Outer left peaks
					if (pref.peakmeterBarOuterPeaks) {
						const x = clamp(this.x + this.outerLeftAnim_x, this.x, this.x + this.w - this.outerLeftAnim_w); // Don't extend right edge of bar
						gr.FillSolidRect(x, this.outerLeft_y, this.outerLeftAnim_w <= 0 ? 2 : this.outerLeftAnim_w, this.bar_h, this.color[1]);
					}
				}
				if (this.rightLevel > this.db[i]) {
					// * Outer right bars
					if (this.rightLevel < this.db[i + 1]) {
						this.outerRight_w = i * this.offset + this.offset / Math.abs(this.db[i + 1] - this.db[i]) * Math.abs(this.rightLevel - this.db[i]) - this.x;
					}
					if (pref.peakmeterBarOuterBars) {
						gr.FillSolidRect(this.x, this.outerRight_y, this.outerRight_w, this.bar_h, this.color[1]);
					}

					// * Outer right peaks
					if (pref.peakmeterBarOuterPeaks) {
						const x = clamp(this.x + this.outerRightAnim_x, this.x, this.x + this.w - this.outerRightAnim_w); // Don't extend right edge of bar
						gr.FillSolidRect(x, this.outerRight_y, this.outerRightAnim_w <= 0 ? 2 : this.outerRightAnim_w, this.bar_h, this.color[1]);
					}
				}

				// * OUTER OVER BARS * //
				if (pref.peakmeterBarOverBars) {
					const overLeft  = this.outerLeftAnim_x  + this.outerLeftAnim_w  - this.w;
					const overRight = this.outerRightAnim_x + this.outerRightAnim_w - this.w;
					const xLeft     = this.w - overLeft  - this.x;
					const xRight    = this.w - overRight - this.x;
					const wLeft     = this.w - xLeft  + this.x;
					const wRight    = this.w - xRight + this.x;
					if (overLeft  > 0) gr.FillSolidRect(xLeft,  this.overLeft_y,   wLeft, this.bar_h * 0.5, this.color[10]);
					if (overRight > 0) gr.FillSolidRect(xRight, this.overRight_y, wRight, this.bar_h * 0.5, this.color[10]);
				}
			}
		}
		// * Style Horizontal center
		else if (pref.peakmeterBarDesign === 'horizontal_center' && fb.IsPlaying) {
			// * Progress Bar
			if (pref.peakmeterBarProgBar && fb.PlaybackLength) {
				let progressStationary = false;
				if (this.progressMoved || Math.floor(this.w * 0.5 * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
					this.progressLength = Math.floor(this.w * 0.5 * (fb.PlaybackTime / fb.PlaybackLength));
				} else {
					progressStationary = true;
				}
				this.progressMoved = false;

				gr.FillSolidRect(this.x, this.middleLeft_y, this.w, this.bar_h, col.peakmeterBarProg);
				gr.FillSolidRect(this.x + this.w * 0.5 - this.progressLength, this.middleLeft_y, this.progressLength, this.bar_h, col.peakmeterBarProgFill);
				gr.FillSolidRect(this.x + this.w * 0.5, this.middleLeft_y, this.progressLength, this.bar_h, col.peakmeterBarProgFill);
			}
			// * Middle bars
			else if (pref.peakmeterBarMiddleBars) {
				for (let i = 0; i <= this.points_middle; i++) {
					if (this.leftPeak > this.db_middle[i]) {
						gr.FillSolidRect(this.x * 0.5 + this.w * 0.5 - i * this.middleOffset + 1, this.middleLeft_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
						gr.FillSolidRect(this.x + this.w * 0.5 + i * this.middleOffset - 1, this.middleLeft_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
					}
					if (this.rightPeak > this.db_middle[i]) {
						gr.FillSolidRect(this.x * 0.5 + this.w * 0.5 - i * this.middleOffset + 1, this.middleRight_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
						gr.FillSolidRect(this.x + this.w * 0.5 + i * this.middleOffset - 1, this.middleRight_y, this.middle_w, this.bar_h * 0.5, col.peakmeterBarProgFill);
					}
				}
			}
			// * Grid
			if (pref.peakmeterBarGrid) {
				gr.FillSolidRect(this.x, this.y, this.w, this.bar_h, col.peakmeterBarProg);
				gr.FillSolidRect(this.x, this.outerRight_y, this.w, this.bar_h, col.peakmeterBarProg);
			}

			for (let i = 0; i <= this.points; i++) {
				// * MAIN BARS * //
				if (this.leftPeak > this.db[i]) {
					if (pref.peakmeterBarMainBars) {
						// * Main left bars
						const xLeft  = this.x * 0.5 + this.w * 0.5 - i * this.offset + 1;
						const xRight = this.x + i * this.offset + this.w * 0.5 - 1;
						gr.FillSolidRect(xLeft,  this.mainLeft_y, this.w2, this.bar_h, this.color[i]);
						gr.FillSolidRect(xRight, this.mainLeft_y, this.w2, this.bar_h, this.color[i]);
					}

					// * Main left middle peaks
					if (this.leftPeak < this.db[i + 1]) {
						this.mainLeft_x = i * this.offset;
					};
					if (pref.peakmeterBarMainPeaks) {
						const xLeft  = this.x * 0.5 + this.w * 0.5 - (this.mainLeftAnim_x + this.offset) + this.w2 * 0.33;
						const xRight = this.w * 0.5 + this.x + this.mainLeftAnim_x + this.offset;
						gr.FillSolidRect(xLeft,  this.mainLeft_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
						gr.FillSolidRect(xRight, this.mainLeft_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);

						// * Main left top peaks
						const xLeftPeaks  = this.x + this.w * 0.5 - this.mainLeftAnim2_x - this.offset - this.w2 * 0.66;
						const wLeftPeaks  = xLeftPeaks < this.x + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend left edge of bar
						const xRightPeaks = this.x + this.w * 0.5 + this.mainLeftAnim2_x + this.offset + this.w2 * 0.66;
						const wRightPeaks = xRightPeaks > this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend left edge of bar
						gr.FillSolidRect(xLeftPeaks,  this.mainLeft_y, wLeftPeaks,  this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
						gr.FillSolidRect(xRightPeaks, this.mainLeft_y, wRightPeaks, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
					}
				}
				if (this.rightPeak > this.db[i]) {
					if (pref.peakmeterBarMainBars) {
						// * Main right bars
						const xLeft  = this.x * 0.5 + this.w * 0.5 - i * this.offset + 1;
						const xRight = this.x + i * this.offset + this.w * 0.5 - 1;
						gr.FillSolidRect(xLeft,  this.mainRight_y, this.w2, this.bar_h, this.color[i]);
						gr.FillSolidRect(xRight, this.mainRight_y, this.w2, this.bar_h, this.color[i]);
					}

					// * Main right middle peaks
					if (this.rightPeak < this.db[i + 1]) {
						this.mainRight_x = i * this.offset;
					};
					if (pref.peakmeterBarMainPeaks) {
						const xLeft  = this.x * 0.5 + this.w * 0.5 - (this.mainRightAnim_x + this.offset) + this.w2 * 0.33;
						const xRight = this.x + this.mainRightAnim_x + this.offset + this.w * 0.5;
						gr.FillSolidRect(xLeft,  this.mainRight_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainRightAnim_x / this.offset)]);
						gr.FillSolidRect(xRight, this.mainRight_y, this.w2 * 0.66, this.bar_h, this.color[Math.round(this.mainRightAnim_x / this.offset)]);

						// * Main right top peaks
						const xLeftPeaks  = this.x + this.w * 0.5 - this.mainRightAnim2_x - this.offset - this.w2 * 0.66;
						const wLeftPeaks  = xLeftPeaks < this.x + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend left edge of bar
						const xRightPeaks = this.x + this.w * 0.5 + this.mainRightAnim2_x + this.offset + this.w2 * 0.66;
						const wRightPeaks = xRightPeaks > this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33; // Don't extend left edge of bar
						gr.FillSolidRect(xLeftPeaks,  this.mainRight_y, wLeftPeaks,  this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
						gr.FillSolidRect(xRightPeaks, this.mainRight_y, wRightPeaks, this.bar_h, this.color[Math.round(this.mainLeftAnim_x / this.offset)]);
					}
				}

				// * OUTER BARS * //
				if (this.leftLevel > this.db[i]) {
					// * Outer left bars
					if (this.leftLevel < this.db[i + 1]) {
						this.outerLeft_w = i * this.offset + this.offset / Math.abs(this.db[i + 1] - this.db[i]) * Math.abs(this.leftLevel - this.db[i]) - this.x;
					}
					if (pref.peakmeterBarOuterBars) {
						const xLeft  = clamp(this.x + this.w * 0.5 - this.outerLeft_w, this.x, this.w * 0.5);
						const xRight = this.x + this.w * 0.5;
						const w      = clamp(this.outerLeft_w, 0, this.w * 0.5);
						gr.FillSolidRect(xLeft,  this.outerLeft_y, w, this.bar_h, this.color[1]);
						gr.FillSolidRect(xRight, this.outerLeft_y, w, this.bar_h, this.color[1]);
					}

					// * Outer left peaks
					if (pref.peakmeterBarOuterPeaks) {
						const clamped_x = clamp(this.x + this.outerLeftAnim_x, this.x, this.x + this.w * 0.5 - this.outerLeftAnim_w); // Don't extend left edge of bar
						const w = this.outerLeftAnim_w <= 0 ? 2 : this.outerLeftAnim_w;
						const xLeft  = this.w * 0.5 + this.x * 2 - clamped_x - w;
						const xRight = this.w * 0.5 + clamped_x;
						gr.FillSolidRect(xLeft,  this.outerLeft_y, w, this.bar_h, this.color[1]);
						gr.FillSolidRect(xRight, this.outerLeft_y, w, this.bar_h, this.color[1]);
					}
				}
				if (this.rightLevel > this.db[i]) {
					// * Outer right bars
					if (this.rightLevel < this.db[i + 1]) {
						this.outerRight_w = i * this.offset + this.offset / Math.abs(this.db[i + 1] - this.db[i]) * Math.abs(this.rightLevel - this.db[i]) - this.x;
					}
					if (pref.peakmeterBarOuterBars) {
						const xLeft  = clamp(this.x + this.w * 0.5 - this.outerRight_w, this.x, this.w * 0.5);
						const xRight = this.x + this.w * 0.5;
						const w      = clamp(this.outerRight_w, 0, this.w * 0.5);
						gr.FillSolidRect(xLeft,  this.outerRight_y, w, this.bar_h, this.color[1]);
						gr.FillSolidRect(xRight, this.outerRight_y, w, this.bar_h, this.color[1]);
					}

					// * Outer right peaks
					if (pref.peakmeterBarOuterPeaks) {
						const clamped_x = clamp(this.x + this.outerRightAnim_x, this.x, this.x + this.w * 0.5 - this.outerRightAnim_w); // Don't extend right edge of bar
						const w = this.outerRightAnim_w <= 0 ? 2 : this.outerRightAnim_w;
						const xLeftPeaks  = this.w * 0.5 + this.x * 2 - clamped_x - w;
						const xRightPeaks = this.w * 0.5 + clamped_x;
						gr.FillSolidRect(xLeftPeaks,  this.outerRight_y, w, this.bar_h, this.color[1]);
						gr.FillSolidRect(xRightPeaks, this.outerRight_y, w, this.bar_h, this.color[1]);
					}
				}

				// * OUTER OVER BARS * //
				if (pref.peakmeterBarOverBars) {
					const overLeft  = this.outerLeftAnim_x  + this.outerLeftAnim_w  - this.w * 0.5;
					const overRight = this.outerRightAnim_x + this.outerRightAnim_w - this.w * 0.5;

					const xLeft   = this.w - overLeft  - this.x;
					const xRight  = this.w - overRight - this.x;
					const xLeft2  = clamp(this.w * 0.5 - overLeft  - this.outerLeftAnim_x  - this.outerLeftAnim_w,  this.x, this.w * 0.5);
					const xRight2 = clamp(this.w * 0.5 - overRight - this.outerRightAnim_x - this.outerRightAnim_w, this.x, this.w * 0.5);

					const wLeft   = this.w - xLeft  + this.x;
					const wRight  = this.w - xRight + this.x;
					const wLeft2  = this.w - xLeft  + this.outerLeftAnim_x  * 0.5  - this.outerLeftAnim_w  * 0.5;
					const wRight2 = this.w - xRight + this.outerRightAnim_x * 0.5  - this.outerRightAnim_w * 0.5;

					if (overLeft  > 0) { // Top
						gr.FillSolidRect(xLeft,  this.overLeft_y, wLeft,  this.bar_h * 0.5, this.color[10]);
						gr.FillSolidRect(xLeft2, this.overLeft_y, wLeft2, this.bar_h * 0.5, this.color[10]);
					}
					if (overRight > 0) { // Bottom
						gr.FillSolidRect(xRight,  this.overRight_y, wRight,  this.bar_h * 0.5, this.color[10]);
						gr.FillSolidRect(xRight2, this.overRight_y, wRight2, this.bar_h * 0.5, this.color[10]);
					}
				}
			}
		}
		// * Style Vertical
		else if (pref.peakmeterBarDesign === 'vertical' && fb.IsPlaying) {
			for (let i = 0; i < this.points_vert; i++) {
				// * Left Peaks
				if (Math.round(this.leftPeak) === this.db_vert[i]) {
					this.leftPeaks_s[i] = this.vertBar_h * 1.5; // Max height of bars
				}
				if (this.leftPeaks_s[i] <= this.h) {
					const x = this.vertLeft_x + this.vertBar_offset * i;
					const y = this.y + this.leftPeaks_s[i] - this.vertBar_h;
					const h = this.leftPeaks_s[i] <= this.vertBar_h ? this.h : this.h - this.leftPeaks_s[i];
					gr.FillSolidRect(x, y, this.vertBar_w, h, col.peakmeterBarVertFill);
				}
				if (pref.peakmeterBarVertPeaks && this.leftPeaks_s[i] >= 0) {
					const x = this.vertLeft_x + this.vertBar_offset * i;
					const y = this.y + this.leftPeaks_s[i] - this.vertBar_h;
					gr.FillSolidRect(x, y, this.vertBar_w, this.vertBar_h, col.peakmeterBarVertFillPeaks);
				}

				// * Right Peaks
				if (Math.round(this.rightPeak) === this.db_vert[this.points_vert - 1 - i]) {
					this.rightPeaks_s[i] = this.vertBar_h * 1.5; // Max height of bars
				}
				if (this.rightPeaks_s[i] <= this.h) {
					const x = this.vertRight_x + this.vertBar_offset * i;
					const y = this.y + this.rightPeaks_s[i] - this.vertBar_h;
					const h = this.rightPeaks_s[i] <= this.vertBar_h ? this.h : this.h - this.rightPeaks_s[i];
					gr.FillSolidRect(x, y, this.vertBar_w, h, col.peakmeterBarVertFill);
				}
				if (pref.peakmeterBarVertPeaks && this.rightPeaks_s[i] >= 0) {
					const x = this.vertRight_x + this.vertBar_offset * i;
					const y = this.y + this.rightPeaks_s[i] - this.vertBar_h;
					gr.FillSolidRect(x, y, this.vertBar_w, this.vertBar_h, col.peakmeterBarVertFillPeaks);
				}
			}
			// * Progress Bar
			if (pref.peakmeterBarProgBar && fb.PlaybackLength) {
				let progressStationary = false;
				if (this.progressMoved || Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
					this.progressLength = Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength));
				} else {
					progressStationary = true;
				}
				this.progressMoved = false;

				gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.w, Math.round(this.bar_h), col.peakmeterBarProg);
				gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.progressLength, Math.round(this.bar_h), col.peakmeterBarVertProgFill);
			}
			else if (pref.peakmeterBarVertBaseline) {
				gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.w, this.vertBar_h, col.peakmeterBarProg);
			}
		}

		// * Peakmeter bar info
		if (pref.peakmeterBarInfo && pref.layout === 'default') {
			const infoTextColor = col.lowerBarArtist;
			if (pref.peakmeterBarDesign === 'horizontal') {
				for (let i = 0; i <= this.points; i = i + 2) {
					const text_w = gr.CalcTextWidth(this.db[i], this.textFont);
					if (i > 2) {
						gr.GdiDrawText(this.db[i], this.textFont, infoTextColor, this.x + this.offset * i - text_w * 0.5, this.text_y, this.w, this.h);
					}
				}
				const text_w = gr.CalcTextWidth('db', this.textFont);
				gr.GdiDrawText('db', this.textFont, infoTextColor, this.x + this.offset * 2 - text_w, this.text_y, this.w, this.h);
			}
			else if (pref.peakmeterBarDesign === 'horizontal_center') {
				for (let i = 0; i <= this.points; i = i + 2) {
					const textRight_w = gr.CalcTextWidth(this.db[i], this.textFont);
					const textLeft_w2 = gr.CalcTextWidth(`${this.db[this.points + 3 - i]}-`, this.textFont);
					if (i > 2) {
						gr.GdiDrawText(this.db[i], this.textFont, infoTextColor, this.w * 0.5 + this.offset * i - textRight_w * 0.5, this.text_y, this.w, this.h);
						gr.GdiDrawText(this.db[this.points + 3 - i], this.textFont, infoTextColor, this.x + this.offset * i - textLeft_w2 * 1.5, this.text_y, this.w, this.h);
					}
				}
				const text_w = gr.CalcTextWidth('db', this.textFont);
				gr.GdiDrawText('db', this.textFont, infoTextColor, this.w * 0.5 + this.offset * 2 - text_w * 0.5, this.text_y, this.w, this.h);
			}
			else if (pref.peakmeterBarDesign === 'vertical') {
				for (let  i = 0; i <= this.points_vert; i++) {
					const textWidthLeft  = gr.CalcTextWidth(`${this.db_vert[i]}--`, this.textFont);
					const textWidthRight = gr.CalcTextWidth(`${this.db_vert[this.points_vert - 1 - i]}--`, this.textFont);
					const textLeft_x     = this.vertLeft_x  + this.vertBar_offset * i - textWidthLeft  / 2 + (this.vertBar_offset - this.vertBar_w);
					const textRight_x    = this.vertRight_x + this.vertBar_offset * i - textWidthRight / 2 + (this.vertBar_offset - this.vertBar_w);
					gr.GdiDrawText(this.db_vert[i] % 2 === 0 ? this.db_vert[i] : '', this.textFont, infoTextColor, textLeft_x, this.y, ww, wh);
					gr.GdiDrawText(this.db_vert[this.points_vert - 1 - i] % 2 === 0 ? this.db_vert[this.points_vert - 1 - i] : '', this.textFont, infoTextColor, textRight_x, this.y, ww, wh);
				}
			}
		}

		// * Peakmeter bar tooltip
		if (componentVUMeter && this.wheel) {
			const DT_FORMAT  = DrawText.Center | DrawText.VCenter | DrawText.SingleLine | DrawText.WordEllipsis;
			this.tooltipText = `${Math.round(this.VUMeter.Offset)} db`;
			this.textHeight  = gr.CalcTextHeight(this.tooltipText, this.textFont2) + 2;
			this.textWidth   = gr.CalcTextWidth(this.tooltipText, this.textFont2) + 10;
			gr.FillSolidRect(this.pos_x - this.textWidth, this.pos_y - this.textHeight + 0, this.textWidth, this.textHeight, col.popupBg);
			gr.GdiDrawText(this.tooltipText, this.textFont2, col.popupText, this.pos_x - this.textWidth, this.pos_y - this.textHeight + 0, this.textWidth, this.textHeight, DT_FORMAT);
		}

		// * Start animation
		this.setAnimation();
	}

	// * CALLBACKS * //

	mouseInThis(x, y) {
		return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
	}

	on_mouse_lbtn_down(x, y) {
		this.drag = true;
	}

	on_mouse_lbtn_up(x, y) {
		this.drag = false;
		if (this.on_mouse && this.mouseInThis(x, y)) {
			this.setPlaybackTime(x);
		}
	}

	on_mouse_leave() {
		this.drag = false;
		this.on_mouse = false;
	}

	on_mouse_move(x, y) {
		this.on_mouse = true;
		this.pos_x = x <= this.textWidth ? this.x + this.textWidth : this.x + x;
		this.pos_y = y <= this.textHeight ? this.textHeight : y;
		if (this.drag) {
			this.setPlaybackTime(x);
		}
	}

	on_mouse_wheel(step) {
		this.wheel = true;
		if (componentVUMeter) {
			this.VUMeter.Offset = this.VUMeter.Offset + step;
		}
		if (this.tooltipTimer) {
			clearTimeout(this.tooltipTimer);
		}
		this.tooltipTimer = setTimeout(() => {
			this.wheel = false;
			if (this.tooltipTimer) clearTimeout(this.tooltipTimer);
			this.tooltipTimer = false;
		}, 2000);
	}

	on_playback_new_track(metadb) {
		if (!metadb) return;
		this.setColors(metadb);
	}

	on_size(w, h) {
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.y = 0;
		this.w = w - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.h = geo.peakmeterBarHeight;
		this.bar_h = pref.layout !== 'default' ? scaleForDisplay(2) : scaleForDisplay(4);

		this.offset        = (pref.peakmeterBarDesign === 'horizontal_center' ? this.w * 0.5 : this.w) / this.points;
		this.middleOffset  = (pref.peakmeterBarDesign === 'horizontal_center' ? this.w * 0.5 : this.w) / this.points_middle;
		this.middle_w      = this.middleOffset - (pref.peakmeterBarGaps ? 1 : 0);
		this.w2            = this.offset - (pref.peakmeterBarGaps ? 1 : 0);

		this.overLeft_y    = this.y;
		this.outerLeft_y   = this.overLeft_y    + this.bar_h * 0.5;
		this.mainLeft_y    = this.outerLeft_y   + this.bar_h;
		this.middleLeft_y  = this.mainLeft_y    + this.bar_h + scaleForDisplay(1);
		this.middleRight_y = this.middleLeft_y  + this.bar_h * 0.5;
		this.mainRight_y   = this.middleRight_y + this.bar_h * 0.5 + scaleForDisplay(1);
		this.outerRight_y  = this.mainRight_y   + this.bar_h;
		this.overRight_y   = this.outerRight_y  + this.bar_h;
		this.text_y        = this.outerRight_y  + this.bar_h * 2;

		this.vertBar_offset = ((this.w / this.points_vert) + ((pref.peakmeterBarVertSize === 'min' ? 2 : pref.peakmeterBarVertSize) / this.points_vert * 0.5)) * 0.5;
		this.vertBar_w = pref.peakmeterBarVertSize === 'min' ? Math.ceil(this.vertBar_offset * 0.1 * 0.5) : this.vertBar_offset - pref.peakmeterBarVertSize * 0.5;
		this.vertBar_h = 2;
		this.vertLeft_x = this.x;
		this.vertRight_x = this.vertLeft_x + this.vertBar_offset * this.points_vert;

		this.progressMoved = true;
		this.textFont = gdi.Font('Segoe UI', is_4k ? 16 : 9, 1);
		this.textFont2 = gdi.Font('Segoe UI', is_4k ? 20 : 11, 0);
	}
}


//////////////////////
// * WAVEFORM BAR * //
//////////////////////
class WaveformBar {
	/**
	 * @param {number} ww window.Width
	 * @param {number} wh window.Height
	 */
	constructor(ww, wh) {
		// * Dependencies
		include(`${fb.ProfilePath}georgia-reborn\\externals\\Codepages.js`);
		include(`${fb.ProfilePath}georgia-reborn\\externals\\lz-utf8\\lzutf8.js`); // For string compression
		include(`${fb.ProfilePath}georgia-reborn\\externals\\lz-string\\lz-string.min.js`); // For string compression

		const arch = DetectWin64() ? '' : '_32';
		this.matchPattern = '$lower([%ALBUM ARTIST%]\\[%ALBUM%]\\%TRACKNUMBER% - %TITLE%)'; // Used to create folder path
		this.debug = false;
		this.profile = false;
		this.analysis = {
			binaryMode: pref.waveformBarMode, // ffprobe | audiowaveform | visualizer
			resolution: 1, // Pixels per second on audiowaveform, per sample on ffmpeg (higher values than 1 require resampling). Visualizer mode is adjusted via window width.
			compressionMode: 'utf-16', // none | utf-8 (~50% compression) | utf-16 (~70% compression)  7zip (~80% compression).
			autoAnalysis: true,
			autoDelete: pref.waveformBarAutoDelete, // Auto-deletes analysis files when unloading the script, present during play session to prevent recalculation.
			visualizerFallback: true, // Uses visualizer mode when file can not be processed (incompatible format).
			visualizerFallbackAnalysis: true // Uses visualizer mode when analyzing file
		};
		this.binaries = {
			ffprobe:       `${fb.ProfilePath}georgia-reborn\\externals\\ffprobe\\ffprobe.exe`,
			audiowaveform: `${fb.ProfilePath}georgia-reborn\\externals\\audiowaveform\\audiowaveform${arch}.exe`,
			visualizer:    `${fb.ProfilePath}running`
		};
		this.preset = {
			analysisMode: pref.waveformBarAnalysis, // rms_level | peak_level | rms_peak (only available when using ffprobe)
			barDesign: pref.waveformBarDesign, // waveform | bars | dots | halfbars
			paintMode: pref.waveformBarPaint, // full | partial
			animate: pref.waveformBarAnimate,
			useBPM: pref.waveformBarBPM,
			indicator: pref.waveformBarIndicator,
			prepaint: pref.waveformBarPrepaint,
			prepaintFront: pref.waveformBarPrepaintFront,
			invertHalfbars: pref.waveformBarInvertHalfbars
		};
		this.ui = {
			sizeWave: pref.waveformBarSizeWave, // Width size of drawn waveform
			sizeBars: pref.waveformBarSizeBars, // Width size of drawn bars
			sizeDots: pref.waveformBarSizeDots, // Width size of drawn dots
			sizeHalf: pref.waveformBarSizeHalf, // Width size of drawn halfbars
			sizeNormalizeWidth: pref.waveformBarSizeNormalize,
			refreshRate: pref.waveformBarRefreshRate, // ms when using animations for any type. 100 is smooth enough but the performance hit is high.
			refreshRateVar: pref.waveformBarRefreshRateVar // Changes refresh rate around the selected value to ensure code is running smoothly (for very low refresh rates).
		};

		// * Easy access
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.y = 0;
		this.w = ww - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.h = geo.waveformBarHeight;

		// * Internals
		this.active = true;
		this.Tf = fb.TitleFormat(this.matchPattern);
		this.TfMaxStep = fb.TitleFormat('[%BPM%]');
		this.cache = null;
		this.cacheDir = `${fb.ProfilePath}cache\\waveform\\`
		this.codePage = convertCharsetToCodepage('UTF-8');
		this.codePageV2 = convertCharsetToCodepage('UTF-16LE');
		this.queueId = null;
		this.queueMs = 1000;
		this.current = [];
		this.offset = [];
		this.step = 0; // 0 - maxStep
		this.maxStep = 4;
		this.time = 0;
		this.ui.refreshRateOpt = this.ui.refreshRate;
		this.mouseDown = false;
		this.isAllowedFile = true; // Set at checkAllowedFile()
		this.isError = false; // Set at verifyData() after retrying analysis
		this.isFallback = false; // For visualizerFallback, set at checkAllowedFile()
		this.fallbackMode = { // For visualizerFallbackAnalysis
			paint: false,
			analysis: false
		};
		this.ffprobeMode = {
			rms_level:  { key: 'rms',     pos: 1 },
			rms_peak:   { key: 'rmsPeak', pos: 2 },
			peak_level: { key: 'peak',    pos: 3 }
		};
		this.compatibleFiles = {
			ffprobe: new RegExp('\\.(' +
				['mp3', 'flac', 'wav', 'ogg', 'opus', 'aac', 'ac3', 'aiff', 'ape', 'wv', 'wma', 'spx', 'spc', 'snd', 'ogx', 'mp4', 'au', 'aac', '2sf', 'dff', 'shn', 'tak', 'tta', 'vgm', 'minincsf', 'la', 'hmi']
				.join('|') + ')$', 'i'),
			audiowaveform: new RegExp('\\.(' +
				['mp3', 'flac', 'wav', 'ogg', 'opus']
			.join('|') + ')$', 'i')
		}

		this.profilerPaint = new FbProfiler('paint');

		// * Check
		this.checkConfig();
		this.defaultSteps();
		if (!IsFolder(this.cacheDir)) { _createFolder(this.cacheDir); }

		this.throttlePaint = _throttle((force = false) => window.RepaintRect(
			this.x - scaleForDisplay(2), this.y - this.h * 0.5 - scaleForDisplay(4),
			this.w + scaleForDisplay(4), this.h + scaleForDisplay(8), force), this.ui.refreshRate);
		this.throttlePaintRect = _throttle((x, y, w, h, force = false) => window.RepaintRect(
			x - scaleForDisplay(2), y - h * 0.5 - scaleForDisplay(4),
			w + scaleForDisplay(4), h + scaleForDisplay(8), force), this.ui.refreshRate);
	}

	// * METHODS * //

	setY(y) {
		this.y = y;
	}

	checkAllowedFile(handle = fb.GetNowPlaying()) {
		this.isAllowedFile = this.analysis.binaryMode !== 'visualizer' && handle.SubSong === 0 && this.compatibleFiles[this.analysis.binaryMode].test(handle.Path);
		this.isFallback = !this.isAllowedFile && this.analysis.visualizerFallback;
	};

	checkConfig() {
		if (!Object.prototype.hasOwnProperty.call(this.binaries, this.analysis.binaryMode)) {
			throw new Error(`Binary mode not recognized or path not set: ${this.analysis.binaryMode}`);
		}
		if (!IsFile(this.binaries[this.analysis.binaryMode])) {
			fb.ShowPopupMessage(`Required dependency not found: ${this.analysis.binaryMode}\n\n${JSON.stringify(this.binaries[this.analysis.binaryMode])}`, window.Name);
		}
		if (this.preset.prepaintFront <= 0 || this.preset.prepaintFront === null) {
			this.preset.prepaintFront = Infinity;
		}
	};

	updateConfig(newConfig) { // Ensures the UI is being updated properly after changing settings.
		if (newConfig) {
			deepAssign()(this, newConfig);
		}
		this.checkConfig();
		let recalculate = false;
		if (newConfig.preset) {
			if (this.preset.paintMode === 'partial' && this.preset.prepaint || this.analysis.binaryMode === 'visualizer') {
				this.offset = [];
				this.step = 0;
			}
			if (Object.prototype.hasOwnProperty.call(newConfig.preset, 'animate') || Object.prototype.hasOwnProperty.call(newConfig.preset, 'useBPM')) {
				if (this.preset.animate && this.preset.useBPM) {
					this.bpmSteps();
				} else {
					this.defaultSteps();
				}
			}
		}
		if (newConfig.ui) {
			if (Object.prototype.hasOwnProperty.call(newConfig.ui, 'refreshRate')) {
				this.ui.refreshRateOpt = this.ui.refreshRate;
				this.throttlePaint = _throttle((force = false) => window.RepaintRect(
					this.x - scaleForDisplay(2), this.y - this.h * 0.5 - scaleForDisplay(4),
					this.w + scaleForDisplay(4), this.h + scaleForDisplay(8), force), this.ui.refreshRate);
				this.throttlePaintRect = _throttle((x, y, w, h, force = false) => window.RepaintRect(
					x - scaleForDisplay(2), y - h * 0.5 - scaleForDisplay(4),
					w + scaleForDisplay(4), h + scaleForDisplay(8), force), this.ui.refreshRate);
			}
			if (Object.prototype.hasOwnProperty.call(newConfig.ui, 'sizeNormalizeWidth') ||  Object.prototype.hasOwnProperty.call(newConfig.ui, 'normalizeWidth')) {
				recalculate = true;
			}
		}
		if (newConfig.analysis) {
			recalculate = true;
		}
		// Recalculate data points or repaint
		if (recalculate) {
			this.on_playback_new_track();
		} else {
			this.throttlePaint();
		}
	};

	updateBar(current) {
		if (!current) this.on_playback_new_track(fb.GetNowPlaying());
		this.on_playback_time(fb.PlaybackTime);
		this.on_size(ww, wh);
	}

	getFFprobe() {
		const url = DetectWin64() ?
			'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' :
			'https://github.com/sudo-nautilus/FFmpeg-Builds-Win32/releases/download/latest/ffmpeg-master-latest-win32-gpl.zip';
		runCmd(url);
		fb.ShowPopupMessage(`Accept download, extract ffprobe.exe from bin to ${this.binaries.ffprobe}\nand restart foobar.`, 'FFprobe');
	}

	getPaths(handle) {
		const id = sanitizePath(this.Tf.EvalWithMetadb(handle)); // Ensures paths are valid!
		const fileName = id.split('\\').pop();
		const waveformBarFolder = this.cacheDir + id.replace(fileName, '');
		const waveformBarFile = this.cacheDir + id;
		return { waveformBarFolder, waveformBarFile };
	};

	bpmSteps(handle = fb.GetNowPlaying()) {
		// Don't allow anything faster than 2 steps or slower than 10 (scaled to 200 ms refresh rate) and consider setting tracks having 100 BPM as default.
		if (!handle) { return this.defaultSteps(); }
		const BPM = Number(this.TfMaxStep.EvalWithMetadb(handle));
		this.maxStep = Math.round(Math.min(Math.max(200 / (BPM || 100) * 2, 2), 10) * (200 / this.ui.refreshRate) ** (1 / 2));
		return this.maxStep;
	};

	defaultSteps() {
		this.maxStep = Math.round(4 * (200 / this.ui.refreshRate) ** (1 / 2));
		return this.maxStep;
	};

	normalizePoints(normalizeWidth = false) {
		if (this.current.length) {
			let upper = 0;
			let lower = 0;
			if (!this.isFallback && !this.fallbackMode.paint && this.analysis.binaryMode === 'ffprobe') {
				// Calculate max values
				const { pos } = this.ffprobeMode[this.preset.analysisMode];
				let max = 0;
				this.current.forEach((frame) => {
					// After parsing JSON, restore infinity values
					if (frame[pos] === null) { frame[pos] = -Infinity; }
					const val = frame[pos];
					max = Math.min(max, isFinite(val) ? val : 0);
				});
				// Calculate point scale
				let maxVal = 1;
				if (this.preset.analysisMode !== 'rms_level') {
					this.current.forEach((frame, n) => {
						if (frame.length === 5) { frame.length = 4; }
						frame.push(isFinite(frame[pos]) ? Math.abs(1 - (Math.log(Math.abs(max)) + Math.log(Math.abs(frame[pos]))) / Math.log(Math.abs(max))) : 1);
						if (!isFinite(frame[4])) { frame[4] = 0; }
						maxVal = Math.min(maxVal, frame[4]);
					});
				}
				else {
					this.current.forEach((frame) => {
						frame.push(isFinite(frame[pos]) ? 1 - Math.abs((frame[pos] - max) / max) : 1);
						maxVal = Math.min(maxVal, frame[4]);
					});
				}
				// Normalize
				if (maxVal !== 0) {
					this.current.forEach((frame) => {
						if (frame[4] !== 1) { frame[4] = frame[4] - maxVal; }
					});
				}
				// Flat data
				this.current = this.current.map((x, i) => Math.sign((0.5 - i % 2)) * (1 - x[4]));
				// Calculate max values
				this.current.forEach((frame) => {
					upper = Math.max(upper, frame);
					lower = Math.min(lower, frame);
				});
				max = Math.max(Math.abs(upper), Math.abs(lower));
			}
			else if (this.analysis.binaryMode === 'audiowaveform' || this.analysis.binaryMode === 'visualizer' || this.isFallback || this.fallbackMode.paint) {
				// Calculate max values
				let max = 0;
				this.current.forEach((frame) => {
					upper = Math.max(upper, frame);
					lower = Math.min(lower, frame);
				});
				max = Math.max(Math.abs(upper), Math.abs(lower));
				// Calculate point scale
				this.current = this.current.map((frame) => frame / max);
			}
			// Adjust num of frames to window size
			if (normalizeWidth) {
				const barW =
					this.preset.barDesign === 'waveform' ? this.ui.sizeWave :
					this.preset.barDesign === 'bars'     ? this.ui.sizeBars :
					this.preset.barDesign === 'dots'     ? this.ui.sizeDots :
					this.preset.barDesign === 'halfbars' ? this.ui.sizeHalf : 1;

				const frames = this.current.length;
				const newFrames = Math.floor(this.w / barW);

				let data;
				if (newFrames !== frames) {
					if (newFrames < frames) {
						const scale = frames / newFrames;
						data = Array(newFrames).fill(null).map((_) => ({ val: 0, count: 0 }));
						let j = 0;
						let h = 0;
						let frame;
						for (let i = 0; i < frames; i++) {
							frame = this.current[i];
							if (h >= scale) {
								const w = (h - scale);
								if (i % 2 === 0) {
									if ((j + 1) >= newFrames) { break; }
									data[j + 1].val += frame * w;
									data[j + 1].count += w;
								} else {
									data[j].val += frame * w;
									data[j].count += w;
								}
								j += 2;
								h = 0;
								data[j].val += frame * (1 - w);
								data[j].count += (1 - w);
							}
							else if (i % 2 === 0) {
								if ((j + 1) >= newFrames) { break; }
								data[j + 1].val += frame;
								data[j + 1].count++;
							}
							else {
								data[j].val += frame;
								data[j].count++;
								h++;
							}
						}
					}
					else {
						const scale = newFrames / frames;
						data = Array(newFrames).fill(null).map((_) => ({ val: 0, count: 0 }));
						let j = 0;
						let h = 0;
						let frame;
						for (let i = 0; i < frames; i++) {
							frame = this.current[i];
							while (h < scale) {
								data[j].val += frame;
								data[j].count++;
								h++;
								j++;
								if (j >= newFrames) { break; }
							}
							h = (h - scale);
							if (j >= newFrames) { break; }
						}
					}
					// Filter non valid values
					let len = data.length;
					while (data[len - 1].count === 0) { data.pop(); len--; }
					// Normalize
					this.current = data.map((el) => el.val / el.count);
					// Some combinations of bar widths and number of points may affect the bias to the upper or lower part of the waveform
					// Lower or upper side can be normalized to the max value of the other side to account for this
					const bias = Math.abs(upper / lower);
					upper = lower = 0;
					this.current.forEach((frame) => {
						upper = Math.max(upper, frame);
						lower = Math.min(lower, frame);
					});
					const newBias = Math.abs(upper / lower);
					const diff = bias - newBias;
					if (diff > 0.1) {
						const distort = bias / newBias;
						const sign = Math.sign(diff);
						this.current = this.current.map((frame) => sign === 1 && frame > 0 || sign !== 1 && frame < 0 ? frame * distort : frame);
					}
				}
			}
		}
	};

	async analyzeData(handle, waveformBarFolder, waveformBarFile) {
		if (!IsFolder(waveformBarFolder)) { _createFolder(waveformBarFolder); }
		let profiler;
		let cmd;
		// Change to track folder since ffprobe has stupid escape rules which are impossible to apply right with amovie input mode.
		let handleFileName = handle.Path.split('\\').pop();
		const handleFolder = handle.Path.replace(handleFileName, '');
		const _q = (value) => `"${value}"`;

		if (this.isAllowedFile && !this.fallbackMode.analysis && this.analysis.binaryMode === 'audiowaveform') {
			if (this.profile) {
				profiler = new FbProfiler('audiowaveform');
			}
			const extension = handleFileName.match(/(?:\.)(\w+$)/i)[1];
			cmd = `CMD /C PUSHD ${_q(handleFolder)} && ` +
				_q(this.binaries.audiowaveform) + ' -i ' + _q(handleFileName) +
				' --pixels-per-second ' + (Math.round(this.analysis.resolution) || 1) + ' --input-format ' + extension + ' --bits 8' +
				' -o ' + _q(`${waveformBarFolder}data.json`);
		}
		else if (this.isAllowedFile && !this.fallbackMode.analysis && this.analysis.binaryMode === 'ffprobe') {
			if (this.profile) {
				profiler = new FbProfiler('ffprobe');
			}
			handleFileName = handleFileName.replace(/[,:%.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, '\\\\\\\''); // And here we go again...
			cmd = `CMD /C PUSHD ${_q(handleFolder)} && ` +
				_q(this.binaries.ffprobe) + ' -hide_banner -v panic -f lavfi -i amovie=' + _q(handleFileName) +
				(this.analysis.resolution > 1 ? `,aresample=${Math.round((this.analysis.resolution || 1) * 100)},asetnsamples=${Math.round((this.analysis.resolution / 10) ** 2)}` : '') +
				',astats=metadata=1:reset=1 -show_entries frame=pkt_pts_time:frame_tags=lavfi.astats.Overall.Peak_level,lavfi.astats.Overall.RMS_level,lavfi.astats.Overall.RMS_peak -print_format json > ' +
				_q(`${waveformBarFolder}data.json`);
		}
		else if (this.isFallback || this.analysis.binaryMode === 'visualizer' || this.fallbackMode.analysis) {
			profiler = new FbProfiler('visualizer');
		}

		if (this.debug && cmd) { console.log(cmd); }

		let processed = cmd ? runCmd(cmd, false) : true;
		processed = processed && (await new Promise((resolve) => {
			if (this.isFallback || this.analysis.binaryMode === 'visualizer' || this.fallbackMode.analysis) {
				resolve(true);
			}
			const timeout = Date.now() + Math.round(10000 * (handle.Length / 180)); // Break if it takes too much time: 10 secs per 3 min of track
			const id = setInterval(() => {
				if (IsFile(`${waveformBarFolder}data.json`)) {
					// ffmpeg writes sequentially, wait until job is done.
					if (this.analysis.binaryMode === 'ffprobe' && _jsonParseFile(`${waveformBarFolder}data.json`, this.codePage)) {
						clearInterval(id); resolve(true);
					} else if (this.analysis.binaryMode !== 'ffprobe') {
						clearInterval(id); resolve(true);
					}
				}
				else if (Date.now() > timeout) {
					clearInterval(id); resolve(false);
				}
			}, 300);
		}));
		if (processed) {
			const data = cmd ? _jsonParseFile(`${waveformBarFolder}data.json`, this.codePage) : this.visualizerData(handle);
			DeleteFile(`${waveformBarFolder}data.json`);
			if (data) {
				if (!this.isFallback && !this.fallbackMode.analysis && this.analysis.binaryMode === 'ffprobe' && data.frames && data.frames.length) {
					const processedData = [];
					data.frames.forEach((frame) => {
						// Save values as array to compress file as much as possible, also round decimals...
						const rms = frame.tags['lavfi.astats.Overall.RMS_level'] === '-inf'	? -Infinity :
							round(Number(frame.tags['lavfi.astats.Overall.RMS_level']), 1);

						const rmsPeak = frame.tags['lavfi.astats.Overall.RMS_peak'] === '-inf' ? -Infinity :
							round(Number(frame.tags['lavfi.astats.Overall.RMS_peak']), 1);

						const peak = frame.tags['lavfi.astats.Overall.Peak_level'] === '-inf' ? -Infinity :
							round(Number(frame.tags['lavfi.astats.Overall.Peak_level']), 1);

						const time = round(Number(frame.pkt_pts_time), 2);
						processedData.push([time, rms, rmsPeak, peak]);
					});
					this.current = processedData;
					// Save data and compress it optionally
					const str = JSON.stringify(this.current);
					if (this.analysis.compressionMode === 'utf-16') {
						// FSO is needed in order to save UTF16-LE files:
						// https://github.com/TheQwertiest/foo_spider_monkey_panel/issues/200
						const compressed = LZString.compressToUTF16(str);
						_saveFSO(`${waveformBarFile}.ff.lz16`, compressed, true);
					}
					else if (this.analysis.compressionMode === 'utf-8') {
						// Only Base64 strings can be saved in UTF8 files:
						// https://github.com/TheQwertiest/foo_spider_monkey_panel/issues/200
						const compressed = LZUTF8.compress(str, { outputEncoding: 'Base64' });
						_save(`${waveformBarFile}.ff.lz`, compressed);
					}
					else {
						_save(`${waveformBarFile}.ff.json`, str);
					}
				}
				else if (!this.isFallback && !this.fallbackMode.analysis && this.analysis.binaryMode === 'audiowaveform' && data.data && data.data.length) {
					this.current = data.data;
					const str = JSON.stringify(this.current);
					if (this.analysis.compressionMode === 'utf-16') {
						// FSO is needed in order to save UTF16-LE files:
						// https://github.com/TheQwertiest/foo_spider_monkey_panel/issues/200
						const compressed = LZString.compressToUTF16(str);
						_saveFSO(`${waveformBarFile}.aw.lz16`, compressed, true);
					}
					else if (this.analysis.compressionMode === 'utf-8') {
						// Only Base64 strings can be saved in UTF8 files:
						// https://github.com/TheQwertiest/foo_spider_monkey_panel/issues/200
						const compressed = LZUTF8.compress(str, { outputEncoding: 'Base64' });
						_save(`${waveformBarFile}.aw.lz`, compressed);
					}
					else {
						_save(`${waveformBarFile}.aw.json`, str);
					}
				}
				else if ((this.isFallback || this.analysis.binaryMode === 'visualizer' || this.fallbackMode.analysis) && data.length) {
					this.current = data;
				}
			}
			// Set animation using BPM if possible
			if (this.preset.animate && this.preset.useBPM) {
				this.bpmSteps(handle);
			}
			// Console and paint
			if (this.profile) {
				if (cmd) { profiler.Print(`Retrieve volume levels. Compression ${this.analysis.compressionMode}.`); }
				else { profiler.Print('Visualizer.'); }
			}
			if (this.current.length) {
				this.throttlePaint();
			} else {
				console.log(`${this.analysis.binaryMode}: failed analyzing the file -> ${handle.Path}`);
			}
		}
	};

	visualizerData(handle, preset = 'classic spectrum analyzer', variableLen = false) {
		const samples =
			variableLen ? handle.Length * (this.analysis.resolution || 1) :
			this.w / scaleForDisplay(5) * (this.analysis.resolution || 1);

		const data = [];

		switch (preset) {
			case 'classic spectrum analyzer': {
				const third = Math.round(samples / 3);
				const half = Math.round(samples / 2);
				for (let i = 0; i < third; i++) {
					const val = (Math.random() * i) / third;
					data.push(val);
				}
				for (let i = third; i < half; i++) {
					const val = (Math.random() * i) / third;
					data.push(val);
				}
				[...data].reverse().forEach((frame) => data.push(frame));
				break;
			}
		}
		return data;
	};

	isDataValid() {
		// When iterating too many tracks in a short ammount of time, weird things may happen without this check
		if (!Array.isArray(this.current) || !this.current.length) return false;
		return this.analysis.binaryMode === 'ffprobe' ?
			this.current.every((frame) => {
				const len = Object.prototype.hasOwnProperty.call(frame, 'length') ? frame.length : null;
				return (len === 4 || len === 5);
			})
		: this.current.every((frame) => (frame >= -128 && frame <= 127));
	};

	verifyData(handle, file, bIsRetry = false) {
		if (!this.isDataValid()) {
			if (bIsRetry) {
				console.log('File was not sucessfully analyzed after retrying.');
				if (file) _deleteFile(file);
				this.isAllowedFile = false;
				this.isFallback = this.analysis.visualizerFallback;
				this.isError = true;
				this.current = [];
			}  else {
				console.log(`Seekbar file not valid. Creating new one${file ? `: ${file}` : '.'}`);
				if (file) _deleteFile(file);
				this.on_playback_new_track(handle, true);
			}
			return false;
		}
		return true;
	};

	removeData() {
		DeleteFolder(this.cacheDir);
	};

	reset() {
		this.current = [];
		this.cache = null;
		this.time = 0;
		this.step = 0;
		this.maxStep = 6;
		this.offset = [];
		this.isAllowedFile = true;
		this.isError = false;
		this.isFallback = false;
		this.fallbackMode.paint = this.fallbackMode.analysis = false;
		this.resetAnimation();
		if (this.queueId) clearTimeout(this.queueId);
	};

	resetAnimation() {
		this.step = 0;
		this.offset = [];
		this.defaultSteps();
	};

	switch(enable = !this.active) {
		const wasActive = this.active;
		this.active = enable;
		if (fb.IsPlaying) {
			if (!wasActive && this.active) {
				window.Repaint();
				setTimeout(() => {
					this.on_playback_new_track(fb.GetNowPlaying());
					this.on_playback_time(fb.PlaybackTime);
				}, 0);
			}
			else if (wasActive && !this.active) {
				this.on_playback_stop(-1);
			}
		}
	};

	draw(gr) {
		this.profilerPaint.Reset();
		if (!fb.IsPlaying) { this.reset(); } // In case paint has been delayed after playback has stopped...
		const frames = this.current.length;
		const prepaint = this.preset.paintMode === 'partial' && this.preset.prepaint;
		const visualizer = this.analysis.binaryMode === 'visualizer' || this.isFallback || this.fallbackMode.paint;
		const currX = this.x + this.w * ((fb.PlaybackTime / fb.PlaybackLength) || 0);
		const currPosColor = col.waveformBarIndicator;

		if (frames !== 0) {
			const barW = this.w / frames;
			const barBgW = this.w / 100;
			const minPointDiff = 0.5; // in px
			const timeConstant = fb.PlaybackLength / frames;
			const past = [{ x: 0, y: 1 }, { x: 0, y: -1 }];
			let current;
			let n = 0;

			gr.SetSmoothingMode(SmoothingMode.AntiAlias);

			for (const frame of this.current) { // [peak]
				current = timeConstant * n;
				const isPrepaint = current > this.time;
				const isPrepaintAllowed = (current - this.time) < this.preset.prepaintFront;
				const scale = frame;
				const x = this.x + barW * n;

				if (this.preset.paintMode === 'partial' && !prepaint && isPrepaint) { break; }
				else if (prepaint && isPrepaint && !isPrepaintAllowed) { break; }
				if (!this.offset[n]) { this.offset.push(0); }

				// if (isPrepaint && prepaint && !paintedBg) { // ! WHY DO I NEED THIS WHEN PREPAINT IS ACTIVE?
				// 	gr.FillSolidRect(currX, this.y, this.w, this.h, col.bg);
				// 	paintedBg = true;
				// }

				// Ensure points don't overlap too much without normalization
				if (past.every((p) => (p.y !== Math.sign(scale) && this.preset.barDesign !== 'halfbars') || (p.y === Math.sign(scale) || this.preset.barDesign === 'halfbars') && (x - p.x) >= minPointDiff)) {
					if (this.preset.barDesign === 'waveform') {
						const sizeWave = this.ui.sizeWave;
						const scaledSize = this.h / 2 * scale;
						this.offset[n] += (prepaint && isPrepaint && this.preset.animate || visualizer ? -Math.sign(scale) * Math.random() * scaledSize / 10 * this.step / this.maxStep : 0); // Add movement when pre-painting
						const rand = Math.sign(scale) * this.offset[n];
						const y = scaledSize > 0 ? Math.max(scaledSize + rand, 1) : Math.min(scaledSize + rand, -1);
						const colorBack = prepaint && isPrepaint ? shadeColor(col.waveformBarFillBack, 40) : col.waveformBarFillBack; // Back
						const colorFront = prepaint && isPrepaint ? shadeColor(col.waveformBarFillFront, 20) : col.waveformBarFillFront; // Front
						let z = visualizer ? Math.abs(y) : y;

						if (z > 0) { // * Top
							if (colorFront !== colorBack) {
								gr.FillSolidRect(x, this.y - z, sizeWave, z / 2, colorBack);
								gr.FillSolidRect(x, this.y - z / 2, sizeWave, z / 2, colorFront);
							} else {
								gr.FillSolidRect(x, this.y - z, sizeWave, z, colorBack);
							}
						}
						z = visualizer ? -Math.abs(y) : y;
						if (z < 0) { // * Bottom
							if (colorFront !== colorBack) {
								gr.FillSolidRect(x, this.y - z / 2, sizeWave, -z / 2, colorBack);
								gr.FillSolidRect(x, this.y, sizeWave, -z / 2, colorFront);
							} else {
								gr.FillSolidRect(x, this.y, sizeWave, -z, colorBack);
							}
						}
					}
					else if (this.preset.barDesign === 'halfbars') {
						const sizeHalf = pref.waveformBarMode !== 'visualizer' ? this.ui.sizeHalf : barW * this.ui.sizeHalf * (visualizer ? 0.2 : 0.5);
						const scaledSize = this.h / 2 * scale;
						this.offset[n] += (prepaint && isPrepaint && this.preset.animate || visualizer ? -Math.sign(scale) * Math.random() * scaledSize / 10 * this.step / this.maxStep : 0); // Add movement when pre-painting
						const rand = Math.sign(scale) * this.offset[n];
						let y = scaledSize > 0 ? Math.max(scaledSize + rand, 1) : Math.min(scaledSize + rand, -1);
						if (this.preset.invertHalfbars) y = Math.abs(y);
						let colorBack = prepaint && isPrepaint ? col.waveformBarFillPreBack : col.waveformBarFillBack; // Back
						let colorFront = prepaint && isPrepaint ? col.waveformBarFillPreFront : col.waveformBarFillFront; // Front
						const x = this.x + barW * n;

						// * Current position
						if ((this.preset.indicator || this.mouseDown) && this.analysis.binaryMode !== 'ffprobe' && (x <= currX && x >= currX - 2 * barW)) {
							colorBack = colorFront = currPosColor;
						}
						if (y > 0) {
							if (colorFront !== colorBack) {
								gr.FillSolidRect(x, this.y - 2 * y + this.h * 0.5, sizeHalf, y, colorBack);
								gr.FillSolidRect(x, this.y - y + this.h * 0.5, sizeHalf, y, colorFront);
							} else {
								gr.FillSolidRect(x, this.y - 2 * y + this.h * 0.5, sizeHalf, 2 * y, colorBack);
							}
							// if (colorFront !== colorBack) { // ! Does not look good with DrawRect
							// 	gr.DrawRect(x, this.y - 2 * y + this.h * 0.5, sizeHalf, y, 1, colorBack);
							// 	gr.DrawRect(x, this.y - y + this.h * 0.5, sizeHalf, y, 1, colorFront);
							// } else {
							// 	gr.DrawRect(x, this.y - 2 * y + this.h * 0.5, sizeHalf, 2 * y, 1, colorBack);
							// }
						}
					}
					else if (this.preset.barDesign === 'bars') {
						const sizeBars = barW * this.ui.sizeBars;
						const scaledSize = this.h / 2 * scale;
						this.offset[n] += (prepaint && isPrepaint && this.preset.animate || visualizer ? -Math.sign(scale) * Math.random() * scaledSize / 10 * this.step / this.maxStep : 0); // Add movement when pre-painting
						const rand = Math.sign(scale) * this.offset[n];
						const y = scaledSize > 0 ? Math.max(scaledSize + rand, 1) : Math.min(scaledSize + rand, -1);
						let colorBack = prepaint && isPrepaint ? shadeColor(col.waveformBarFillBack, 40) : col.waveformBarFillBack; // Back
						let colorFront = prepaint && isPrepaint ? shadeColor(col.waveformBarFillFront, 20) : col.waveformBarFillFront; // Front
						const x = this.x + barW * n;

						// * Current position
						if ((this.preset.indicator || this.mouseDown) && this.analysis.binaryMode !== 'ffprobe' && (x <= currX && x >= currX - 2 * barW)) {
							colorBack = colorFront = currPosColor;
						}
						let z = visualizer ? Math.abs(y) : y;
						if (z > 0) { // * Top
							if (colorFront !== colorBack) {
								gr.DrawRect(x, this.y - z, sizeBars, z / 2, 1, colorBack);
								gr.DrawRect(x, this.y - z / 2, sizeBars, z / 2, 1, colorFront);
							} else {
								gr.DrawRect(x, this.y - z, sizeBars, z, 1, colorBack);
							}
						}
						z = visualizer ? -Math.abs(y) : y;
						if (z < 0) { // * Bottom
							if (colorFront !== colorBack) {
								gr.DrawRect(x, this.y - z / 2, sizeBars, -z / 2, 1, colorBack);
								gr.DrawRect(x, this.y, sizeBars, -z / 2, 1, colorFront);
							} else {
								gr.DrawRect(x, this.y, sizeBars, -z, 1, colorBack);
							}
						}
					}
					else if (this.preset.barDesign === 'dots') {
						const scaledSize = this.h / 2 * scale;
						const y = scaledSize > 0 ? Math.max(scaledSize, 1) : Math.min(scaledSize, -1);
						const colorBack = prepaint && isPrepaint ? shadeColor(col.waveformBarFillBack, 40) : col.waveformBarFillBack; // Back
						const colorFront = prepaint && isPrepaint ? shadeColor(col.waveformBarFillFront, 20) : col.waveformBarFillFront; // Front
						this.offset[n] += (prepaint && isPrepaint && this.preset.animate || visualizer ? Math.random() * Math.abs(this.step / this.maxStep) : 0); // Add movement when pre-painting
						const rand = this.offset[n];
						const step = Math.max(this.h / 80, 5) + (rand || 1) // Point density
						const circleSize = Math.max(step / 25, 1) * this.ui.sizeDots;

						// Split waveform in two, and then half each for highlighting. If colors match, the same amount of dots are painted anyway.
						const sign = Math.sign(y);
						let yCalc = this.y;
						let bottom = this.y - y / 2;

						while (sign * (yCalc - bottom) > 0) {
							gr.DrawEllipse(x, yCalc, circleSize, circleSize, 1, colorFront);
							yCalc += (-sign) * step;
						}
						bottom += -y / 2;

						while (sign * (yCalc - bottom) > 0) {
							gr.DrawEllipse(x, yCalc, circleSize, circleSize, 1, colorBack);
							yCalc += (-sign) * step;
						}

						if (visualizer) {
							const sign = -Math.sign(y);
							let yCalc = this.y;
							let bottom = this.y + y / 2;
							while (sign * (yCalc - bottom) > 0) {
								gr.DrawEllipse(x, yCalc, circleSize, circleSize, 1, colorFront);
								yCalc += (-sign) * step;
							}
							bottom += +y / 2;

							while (sign * (yCalc - bottom) > 0) {
								gr.DrawEllipse(x, yCalc, circleSize, circleSize, 1, colorBack);
								yCalc += (-sign) * step;
							}
						}
					}
					past.shift();
					past.push({ x, y: Math.sign(scale) });
				}
				n++;
			}

			// * Progress line
			if (this.preset.indicator || this.mouseDown) {
				gr.SetSmoothingMode(0);
				const minBarW = Math.round(Math.max(barW, scaleForDisplay(1)));
				if (this.analysis.binaryMode === 'ffprobe') {
					gr.DrawLine(currX, this.y - this.h * 0.5, currX, this.y + this.h * 0.5, minBarW, currPosColor);
				} else if (this.preset.barDesign === 'waveform' || this.preset.barDesign === 'dots') {
					gr.DrawLine(currX, this.y - this.h * 0.5, currX, this.y + this.h * 0.5, minBarW, currPosColor);
				}
			}
		}
		else if (fb.IsPlaying) {
			const DT_CENTER = DrawText.VCenter | DrawText.Center | DrawText.EndEllipsis | DrawText.CalcRect | DrawText.NoPrefix;
			const updatedNowpBg = g_pl_colors.row_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing
			const bgColor = pref.theme === 'reborn' ? g_pl_colors.row_nowplaying_bg : col.transportEllipseBg;
			const textColor = g_pl_colors.header_artist_normal;

			if (updatedNowpBg) {
				gr.FillSolidRect(this.x, this.y - this.h * 0.5, this.w, this.h, bgColor); // * Waveform bar background
				if (!this.isAllowedFile && !this.isFallback && this.analysis.binaryMode !== 'visualizer') {
					gr.GdiDrawText('Incompatible file format', ft.lower_bar_wave, textColor, this.x, this.y - this.h * 0.5, this.w, this.h, DT_CENTER);
				} else if (!this.analysis.autoAnalysis) {
					gr.GdiDrawText('Waveform bar file not found', ft.lower_bar_wave, textColor, this.x, this.y - this.h * 0.5, this.w, this.h, DT_CENTER);
				} else if (this.isError) {
					gr.GdiDrawText('Waveform bar file can not be analyzed', ft.lower_bar_wave, textColor, this.x, this.y - this.h * 0.5, this.w, this.h, DT_CENTER);
				} else if (this.active) {
					gr.GdiDrawText('Loading', ft.lower_bar_wave, textColor, this.x, this.y - this.h * 0.5, this.w, this.h, DT_CENTER);
				}
			}
		}

		// * Incrementally draw animation on small steps
		if (prepaint && this.preset.animate || visualizer) {
			if (this.step >= this.maxStep) {
				this.step = -this.step;
			} else {
				if (this.step === 0) { this.offset = []; }
				this.step++;
			}
		}
		// * Animate smoothly, repaint by zone when possible. Only when not paused!
		if (fb.IsPlaying && !fb.IsPaused) {
			if (visualizer) {
				this.throttlePaint();
			}
			else if (prepaint && this.preset.animate && frames) {
				const barW = Math.ceil(Math.max(this.w / frames, scaleForDisplay(2)));
				this.throttlePaintRect(currX - scaleForDisplay(40), this.y, this.w + scaleForDisplay(40), this.h);
			}
			else if (this.preset.indicator && frames) {
				const barW = Math.ceil(Math.max(this.w / frames, scaleForDisplay(2)));
				this.throttlePaintRect(currX - scaleForDisplay(40), this.y, 4 * barW + scaleForDisplay(40), this.h);
			}
			if (this.ui.refreshRateVar) {
				if (this.profilerPaint.Time > this.ui.refreshRate) {
					this.updateConfig({ ui: { refreshRate: this.ui.refreshRate + 50 } });
				}
				else if (this.profilerPaint.Time < this.ui.refreshRate && this.profilerPaint.Time >= this.ui.refreshRateOpt) {
					this.updateConfig({ ui: { refreshRate: this.ui.refreshRate - 25 } });
				}
			}
		}
	};

	// * CALLBACKS * //

	on_mouse_lbtn_up(x, y, mask) {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar)) return;
		this.mouseDown = false;
		if (!this.trace(x, y)) { return false; }
		const handle = fb.GetSelection();
		if (handle && fb.IsPlaying) { // Seek
			const frames = this.current.length;
			if (frames !== 0) {
				const barW = this.w / frames;
				let time = Math.round(fb.PlaybackLength / frames * (x - this.x) / barW);
				if (time < 0) { time = 0; }
				else if (time > fb.PlaybackLength) { time = fb.PlaybackLength; }
				fb.PlaybackTime = time;
				this.throttlePaint(true);
				return true;
			}
		}
		return false;
	};

	on_mouse_move(x, y, mask) {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar)) return;
		if (mask === MK_LBUTTON && this.on_mouse_lbtn_up(x, y, mask)) {
			this.mouseDown = true;
		}
	};

	async on_playback_new_track(handle = fb.GetNowPlaying(), isRetry = false) {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar) || !this.active) { return; }
		this.reset();
		if (handle) {
			this.checkAllowedFile(handle);
			let analysis = false;
			const { waveformBarFolder, waveformBarFile } = this.getPaths(handle);
			// Uncompressed file -> Compressed UTF8 file -> Compressed UTF16 file -> Analyze
			if (this.analysis.binaryMode === 'ffprobe' && IsFile(`${waveformBarFile}.ff.json`)) {
				this.current = _jsonParseFile(`${waveformBarFile}.ff.json`, this.codePage) || [];
				if (!this.verifyData(handle, `${waveformBarFile}.ff.json`, isRetry)) { return; };
			}
			else if (this.analysis.binaryMode === 'ffprobe' && IsFile(`${waveformBarFile}.ff.lz`)) {
				let str = _open(`${waveformBarFile}.ff.lz`, this.codePage) || '';
				str = LZUTF8.decompress(str, { inputEncoding: 'Base64' }) || null;
				this.current = str ? JSON.parse(str) || [] : [];
				if (!this.verifyData(handle, `${waveformBarFile}.ff.lz`, isRetry)) { return; };
			}
			else if (this.analysis.binaryMode === 'ffprobe' && IsFile(`${waveformBarFile}.ff.lz16`)) {
				let str = _open(`${waveformBarFile}.ff.lz16`, this.codePageV2) || '';
				str = LZString.decompressFromUTF16(str) || null;
				this.current = str ? JSON.parse(str) || [] : [];
				if (!this.verifyData(handle, `${waveformBarFile}.ff.lz16`, isRetry)) { return; };
			}
			else if (this.analysis.binaryMode === 'audiowaveform' && IsFile(`${waveformBarFile}.aw.json`)) {
				this.current = _jsonParseFile(`${waveformBarFile}.aw.json`, this.codePage) || [];
				if (!this.verifyData(handle, `${waveformBarFile}.aw.json`, isRetry)) { return; };
			}
			else if (this.analysis.binaryMode === 'audiowaveform' && IsFile(`${waveformBarFile}.aw.lz`)) {
				let str = _open(`${waveformBarFile}.aw.lz`, this.codePage) || '';
				str = LZUTF8.decompress(str, { inputEncoding: 'Base64' }) || null;
				this.current = str ? JSON.parse(str) || [] : [];
				if (!this.verifyData(handle, `${waveformBarFile}.aw.lz`, isRetry)) { return; };
			}
			else if (this.analysis.binaryMode === 'audiowaveform' && IsFile(`${waveformBarFile}.aw.lz16`)) {
				let str = _open(`${waveformBarFile}.aw.lz16`, this.codePageV2) || '';
				str = LZString.decompressFromUTF16(str) || null;
				this.current = str ? JSON.parse(str) || [] : [];
				if (!this.verifyData(handle, `${waveformBarFile}.aw.lz16`, isRetry)) { return; };
			}
			else if (this.analysis.autoAnalysis && IsFile(handle.Path)) {
				if (this.analysis.visualizerFallbackAnalysis) {
					this.fallbackMode.analysis = this.fallbackMode.paint = true;
					await this.analyzeData(handle, waveformBarFolder, waveformBarFile);
					// Calculate waveform on the fly
					this.normalizePoints();
					// Set animation using BPM if possible
					if (this.preset.animate && this.preset.useBPM) { this.bpmSteps(handle); }
					// Update time if needed
					if (fb.IsPlaying) { this.time = fb.PlaybackTime; }
				}
				this.throttlePaint(true);
				if (this.analysis.visualizerFallbackAnalysis) {
					this.fallbackMode.analysis = false;
				}
				await this.analyzeData(handle, waveformBarFolder, waveformBarFile);
				if (!this.verifyData(handle, undefined, isRetry)) { return; };
				this.fallbackMode.analysis = this.fallbackMode.paint = false;
				analysis = true;
			}
			if (!analysis) { this.isFallback = false; } // Allow reading data from files, even if track is incompatible.
			// Calculate waveform on the fly
			this.normalizePoints(this.analysis.binaryMode !== 'visualizer' && this.ui.sizeNormalizeWidth);
		}
		this.resetAnimation();
		// Set animation using BPM if possible
		if (this.preset.animate && this.preset.useBPM) { this.bpmSteps(handle); }
		// Update time if needed
		if (fb.IsPlaying) { this.time = fb.PlaybackTime; }
		// And paint
		this.throttlePaint();
	};

	on_playback_new_track_queue() {
		if (this.queueId) clearTimeout(this.queueId);
		this.queueId = setTimeout(() => {
			this.on_playback_new_track(...arguments) // Arguments points to the first non arrow func
		}, this.queueMs);
	};

	on_playback_stop(reason = -1) { // -1 Invoked by JS | 0 Invoked by user | 1 End of file | 2 Starting another track | 3 Fb2k is shutting down
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar) || reason !== -1 && !this.active) { return; }
		this.reset();
		if (reason !== 2) { this.throttlePaint(); }
	};

	on_playback_time(time) {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar) || !this.active) { return; }
		this.time = time;
		if (this.cache === this.current) { // Paint only once if there is no animation
			if (this.preset.paintMode === 'full' && !this.preset.indicator && this.analysis.binaryMode !== 'visualizer') {
				return;
			}
		} else {
			this.cache = this.current;
		}
		// Repaint by zone when possible
		if (this.analysis.binaryMode === 'visualizer' || !this.current.length) {
			this.throttlePaint();
		}
		else if (this.preset.paintMode === 'partial' && this.preset.prepaint) {
			const currX = this.x + this.w * fb.PlaybackTime / fb.PlaybackLength;
			const barW = Math.round(Math.max(this.w / this.current.length, scaleForDisplay(2)));
			this.throttlePaintRect(currX - 2 * barW, this.y, this.w, this.h);
		}
		else if (this.preset.indicator || this.preset.paintMode === 'partial') {
			const currX = this.x + this.w * fb.PlaybackTime / fb.PlaybackLength;
			const barW = Math.round(Math.max(this.w / this.current.length, scaleForDisplay(2)));
			this.throttlePaintRect(currX - 2 * barW, this.y, 4 * barW, this.h);
		}
	};

	on_script_unload() {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar)) return;
		if (this.analysis.autoDelete) {
			this.removeData();
		}
	};

	on_size(w, h) {
		if (['progressbar', 'peakmeterbar'].includes(pref.seekbar)) return;
		this.x = scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
		this.y = 0;
		this.w = w - scaleForDisplay(pref.layout !== 'default' ? 40 : 80);
		this.h = geo.waveformBarHeight;
	};

	trace(x, y) {
		return (x >= this.x && y >= this.y && x <= this.x + this.w && y <= this.y + this.h);
	};
}
