/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Main Components                          * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-01-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * IMAGE CACHING * //
///////////////////////
/**
 * A class that creates album art and playlist thumbnails cache.
 */
class ArtCache {
	/**
	 * Creates the `ArtCache` instance.
	 * The ArtCache is a Least-Recently Used cache meaning that each cache hit will bump
	 * that image to be the last image to be removed from the cache (if maxCacheSize is exceeded).
	 * @param {number} maxCacheSize - The maximum number of images to keep in the cache.
	 */
	constructor(maxCacheSize = 15) {
		/**
		 * @typedef {object} ArtCacheObj
		 * @property {GdiBitmap} image - The GDI+ bitmap image object cached.
		 * @property {number} filesize - The size of the image file in bytes.
		 */

		/** @private @type {object.<string, ArtCacheObj>} The primary cache storing image objects. */
		this.cache = {};
		/** @private @type {object.<string, ArtCacheObj>} The secondary cache used mainly for disc art covers to prevent overwriting album art with masked images. */
		this.cache2 = {};
		/** @private @type {string[]} The array of cache keys in the order of their usage. */
		this.cacheIndexes = [];
		/** @private @type {string[]} The array of secondary cache keys in the order of their usage. */
		this.cacheIndexes2 = [];
		/** @private @type {number} The maximum number of images that can be stored in the primary cache. */
		this.cacheMaxSize = maxCacheSize;
		/** @private @type {number} The maximum number of images that can be stored in the secondary cache. */
		this.cacheMaxSize2 = maxCacheSize;

		/** @private @type {number} The maximum width an image can be displayed. */
		this.imgMaxWidth = SCALE(1440);
		/** @private @type {number} The maximum height an image can be displayed. */
		this.imgMaxHeight = SCALE(872);

		/**
		 * Because foobar x86 can allocate only 4 gigs memory, we must limit disc art res for 4K when using
		 * high grSet.spinDiscArtImageCount, i.e 90 (4 degrees), 120 (3 degrees), 180 (2 degrees) to prevent crash.
		 * When SMP has x64 support, we could try to increase this limit w (1836px max possible res for 4K).
		 * @public @type {number}
		 */
		this.discArtImgMaxRes = this.setDiscArtMaxResolution(grSet.spinDiscArtImageCount);
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets cached image if it exists under the location string. If image is found, move it's index to the end of the cacheIndexes.
	 * @param {string} location - The string value to check if image is cached under.
	 * @param {number} cacheIndex - The first or second index of the cache to check.
	 * @returns {GdiBitmap|null} The cached image, or null if not found or the file does not exist.
	 */
	getImage(location, cacheIndex = 1) {
		const cache = cacheIndex === 1 ? this.cache : this.cache2;
		const cacheIndexes = cacheIndex === 1 ? this.cacheIndexes : this.cacheIndexes2;

		if (!cache[location] || !fso.FileExists(location)) {
			// If image is not in cache or location does not exist, return to prevent crash.
			return null;
		}

		const file = fso.GetFile(location);
		const pathIndex = cacheIndexes.indexOf(location);
		cacheIndexes.splice(pathIndex, 1);

		if (file && file.Size === cache[location].filesize) {
			cacheIndexes.push(location);
			DebugLog('Art cache => Cache hit:', location);
			return cache[location].image;
		}

		// Size of file on disk has changed
		DebugLog(`Art cache => Cache entry was stale: ${location} [old size: ${cache[location].filesize}, new size: ${file.Size}]`);
		delete cache[location]; // Was removed from cacheIndexes already

		return null;
	}

	/**
	 * Gets and optionally logs the size of an image or all images in both caches if cacheIndex is 0.
	 * @param {string|null} location - The location string of the image to check. If null, process all images in the specified cache or both if cacheIndex is 0.
	 * @param {number} cacheIndex - The index of the cache to check. 0 for both, 1 for the first, 2 for the second. Defaults to 1.
	 * @param {boolean} logSize - Whether to log the size(s) to the console. Defaults to false.
	 * @returns {number|null|object} The size of the image in bytes, all images sizes if location is null and cacheIndex is specified, or null if the image is not found.
	 * @example
	 * - Get size of a specific image in cache 1: getImageSize('path/to/img.jpg', 1);
	 * - Get sizes of all images in cache 1: getImageSize(null, 1, true);
	 * - Get sizes of all images in both caches: getImageSize(null, 0, true);
	 */
	getImageSize(location, cacheIndex = 1, logSize = false) {
		const processCache = (cache, prefix = '') => {
			const sizes = {};
			for (const [loc, cacheObj] of Object.entries(cache)) {
				const formattedSize = FormatSize(cacheObj.filesize);
				sizes[loc] = formattedSize;
				if (logSize) {
					console.log(`Art cache => ${prefix}Image at '${loc}' size: ${formattedSize}`);
				}
			}
			return sizes;
		};

		if (cacheIndex === 0) { // If location is 0, process both caches
			const sizes1 = processCache(this.cache, 'Cache 1 ');
			const sizes2 = processCache(this.cache2, 'Cache 2 ');
			return { ...sizes1, ...sizes2 }; // Merge results from both caches
		}

		const cache = cacheIndex === 1 ? this.cache : this.cache2;

		if (location === null) { // If location is null, process all images in the specified cache.
			return processCache(cache);
		}
		else if (cache[location]) { // Process a specific image in the specified cache.
			const formattedSize = FormatSize(cache[location].filesize);
			if (logSize) {
				console.log(`Art cache => Image at '${location}' size: ${formattedSize}`);
			}
			return formattedSize;
		}

		return null;
	}

	/**
	 * Gets and optionally logs the total size of the cached images.
	 * If cacheIndex is 0, calculates for both caches combined.
	 * @param {number} cacheIndex - The index of the cache to calculate size for. If 0, calculates for both caches.
	 * @param {boolean} logSizes - Whether to log individual image sizes to the console.
	 * @returns {number} The total size of the cache or caches in bytes.
	 * @example
	 * - Get total size of cache 1: getTotalCacheSize(1, true);
	 * - Get total size of both caches combined: getTotalCacheSize(0, true);
	 */
	getTotalCacheSize(cacheIndex, logSizes = false) {
		let totalSize = 0;

		const calculateAndLogSize = (cache, cacheName = '') => {
			for (const [location, cacheObj] of Object.entries(cache)) {
				totalSize += cacheObj.filesize;
				if (logSizes) {
					const formattedSize = FormatSize(cacheObj.filesize);
					console.log(`Art cache => ${cacheName} Image at '${location}' size: ${formattedSize}`);
				}
			}
		};

		if (cacheIndex === 0) { // If cacheIndex is 0, process both caches
			calculateAndLogSize(this.cache, 'Cache 1');
			calculateAndLogSize(this.cache2, 'Cache 2');
		} else {
			const cache = cacheIndex === 1 ? this.cache : this.cache2;
			calculateAndLogSize(cache, `Cache ${cacheIndex}`);
		}

		const cacheLabel = cacheIndex === 0 ? 'Total size for both caches' : `Total size for Cache ${cacheIndex}`;
		const totalFormattedSize = FormatSize(totalSize);
		if (logSizes) console.log(`Art cache => ${cacheLabel}: ${totalFormattedSize}`);

		return totalFormattedSize;
	}

	/**
	 * Sets the maximum resolution for disc art based on the spinDiscArtImageCount.
	 * @param {number} spinDiscArtImageCount - The count for spinning disc art images.
	 * @returns {number} The maximum resolution for the disc art image.
	 */
	setDiscArtMaxResolution(spinDiscArtImageCount = 72) {
		const maxResByImgCount = {
			36:  1500,
			45:  1500,
			60:  1400,
			72:  1400,
			90:  1300,
			120: 1200,
			180: 1000
		};

		return maxResByImgCount[spinDiscArtImageCount];
	}

	/**
	 * Adds a rescaled image to the cache under string `location` and returns the cached image.
	 * @param {GdiBitmap} img - The image object to cache.
	 * @param {string} location - The string value to cache image under. Does not need to be a path.
	 * @param {number} cacheIndex - The first or second index of the cache to check.
	 * @returns {GdiBitmap} The image stored in the cache at the specified location.
	 * If there is no image in the cache at that location, it returns the original image passed as a parameter.
	 */
	encache(img, location, cacheIndex = 1) {
		const cache = cacheIndex === 1 ? this.cache : this.cache2;
		const cacheIndexes = cacheIndex === 1 ? this.cacheIndexes : this.cacheIndexes2;
		const cacheMaxSize = cacheIndex === 1 ? this.cacheMaxSize : this.cacheMaxSize2;

		try {
			let { Width: w, Height: h } = img;

			// Scale image
			if (w > this.imgMaxWidth || h > this.imgMaxHeight) {
				const scaleFactor = Math.max(w / this.imgMaxWidth, h / this.imgMaxHeight);
				w /= scaleFactor;
				h /= scaleFactor;
			}

			const file = fso.GetFile(location);
			cache[location] = { image: img.Resize(w, h), filesize: file.Size };
			img = null;

			// Update cache order
			const pathIndex = cacheIndexes.indexOf(location);
			if (pathIndex !== -1) {
				cacheIndexes.splice(pathIndex, 1); // Remove from middle of cache and put on end
			}
			cacheIndexes.push(location);

			// Maintain cache size
			if (cacheIndexes.length > cacheMaxSize) {
				const remove = cacheIndexes.shift();
				DebugLog('Art cache => Removing img from cache:', remove);
				delete cache[remove];
			}
		} catch (e) {
			// Do not console.log inverted band logo and label images in the process of being created
			grm.ui.bandLogoInverted && console.log(`\nArt cache => <Error: Image could not be properly parsed: ${location}>\n`);
		}

		return cache[location] ? cache[location].image : img;
	}

	/**
	 * Completely clears all cached entries and releases memory held by scaled bitmaps.
	 */
	clear() {
		if (grCfg.settings.showDebugLog) {
			DebugLog(`Art cache => Total cache size for Cache 1: ${this.getTotalCacheSize(1, false)}`);
			DebugLog(`Art cache => Total cache size for Cache 2: ${this.getTotalCacheSize(2, false)}`);
			DebugLog(`Art cache => Total cache size cleared: ${this.getTotalCacheSize(0, false)}`);
		}

		const clearCache = (cacheIndexes, cache) => {
			for (const index of cacheIndexes) {
				delete cache[index];
			}
			cacheIndexes.length = 0;
		};

		clearCache(this.cacheIndexes, this.cache);
		clearCache(this.cacheIndexes2, this.cache2);
	}
	// #endregion
}


/**
 * A class that creates background images for the Playlist or Library.
 */
class BackgroundImage {
	/**
	 * Creates the `BackgroundImage` instance.
	 */
	constructor() {
		// * BACKGROUND PANEL IMAGES * //
		// #region BACKGROUND PANEL IMAGES
		/** @public @type {GdiBitmap|null} The background image used for the Playlist. */
		this.playlistBgImg = null;
		/** @public @type {GdiBitmap|null} The background image used for the Library. */
		this.libraryBgImg = null;
		/** @public @type {GdiBitmap|null} The background image used for the Lyrics. */
		this.lyricsBgImg = null;
		// #endregion

		// * ARTIST IMAGES * //
		// #region ARTIST IMAGES
		/** @public @type {GdiBitmap|null} The artist background image of the biography. */
		this.artistBgImg = null;
		/** @public @type {GdiBitmap[]} The artist list of background images. */
		this.artistImgList = [];
		/** @public @type {number} The artist index of the currently displayed background image for the Playlist. */
		this.artistIdxPlaylist = 0;
		/** @public @type {number} The artist index of the currently displayed background image for the Library. */
		this.artistIdxLibrary = 0;
		/** @public @type {number} The artist index of the currently displayed background image for the Lyrics. */
		this.artistIdxLyrics = 0;
		/** @public @type {number} The artist index of the cached biography artist image for the Playlist. */
		this.artistIdxCachedPlaylist = -1;
		/** @public @type {number} The artist index of the cached biography artist image for the Library. */
		this.artistIdxCachedLibrary = -1;
		/** @public @type {number} The artist index of the cached biography artist image for the Lyrics. */
		this.artistIdxCachedLyrics = -1;
		// #endregion

		// * ALBUM IMAGES * //
		// #region ALBUM IMAGES
		/** @public @type {GdiBitmap|null} The album background image. */
		this.albumBgImg = null;
		/** @public @type {GdiBitmap[]} The album list of background images. */
		this.albumImgList = [];
		/** @public @type {number[]} The album art image index: 0 for Front, 1 for Back, and 4 for Artist. */
		this.albumArtIdx = [0, 1, 4];
		/** @public @type {number} The album index of the currently displayed background image for the Playlist. */
		this.albumIdxPlaylist = 0;
		/** @public @type {number} The album index of the currently displayed background image for the Library. */
		this.albumIdxLibrary = 0;
		/** @public @type {number} The album index of the currently displayed background image for the Lyrics. */
		this.albumIdxLyrics = 0;
		/** @public @type {number} The album index of the cached album background image for the Playlist. */
		this.albumIdxCachedPlaylist = -1;
		/** @public @type {number} The album index of the cached album background image for the Library. */
		this.albumIdxCachedLibrary = -1;
		/** @public @type {number} The album index of the cached album background image for the Lyrics. */
		this.albumIdxCachedLyrics = -1;
		// #endregion

		// * CUSTOM IMAGES * //
		// #region CUSTOM IMAGES
		/** @public @type {GdiBitmap|null} The custom background image. */
		this.customBgImg = null;
		/** @public @type {GdiBitmap[]} The custom list of custom background images. */
		this.customImgList = [];
		/** @public @type {number} The custom index of the currently displayed custom background image for the Playlist. */
		this.customIdxPlaylist = 0;
		/** @public @type {number} The custom index of the currently displayed custom background image for the Library. */
		this.customIdxLibrary = 0;
		/** @public @type {number} The custom index of the currently displayed custom background image for the Lyrics. */
		this.customIdxLyrics = 0;
		/** @public @type {number} The custom index of the cached custom background image for the Playlist. */
		this.customIdxCachedPlaylist = -1;
		/** @public @type {number} The custom index of the cached custom background image for the Library. */
		this.customIdxCachedLibrary = -1;
		/** @public @type {number} The custom index of the cached custom background image for the Lyrics. */
		this.customIdxCachedLyrics = -1;
		// #endregion

		// * STATE * //
		// #region STATE
		/** @public @type {Object} The background image fetching state for the Playlist, Library, and Lyrics. */
		this.imgFetching = {};
		/** @public @type {Object} The background image cycle intervals for the Playlist, Library, and Lyrics. */
		this.imgCycleIntervals = {};
		// #endregion

		// * INITIALIZATION * //
		// #region INITIALIZATION
		this.initBgImageCycle();
		// #endregion
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws an artist, album or custom image on the Playlist or Library's background.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {object} img - The image object containing the image and other properties.
	 * @param {string} scale - The scale mode ("default", "filled" or "stretched") to apply to the image.
	 * @param {number} x - The x-coordinate where the image should be drawn.
	 * @param {number} y - The y-coordinate where the image should be drawn.
	 * @param {number} w - The width of the area to draw the image.
	 * @param {number} h - The height of the area to draw the image.
	 * @param {number} opacity - The opacity level to apply to the image.
	 * @param {boolean} mask - Whether to apply a mask to the image.
	 * @param {number} maskOffsetY - The y-offset for the mask.
	 * @param {number} maskHeight - The height of the mask.
	 */
	drawBgImage(gr, img, scale, x, y, w, h, opacity, mask, maskOffsetY, maskHeight) {
		if (!img || !img.image) return;

		if (!img.scaled || img.changed) {
			img.scaled = ScaleImage(img.image, scale, x, y, w, h, 0, 0, img.image.Width, img.image.Height);
		}

		if (mask && (!img.masked || img.changed)) {
			img.masked = MaskImage(img.scaled, 0, maskOffsetY, img.scaled.Width, img.scaled.Height - maskHeight);
		}

		const finalImage = mask ? img.masked : img.scaled;
		gr.DrawImage(finalImage, x, y, w, h, 0, 0, finalImage.Width, finalImage.Height, 0, opacity);

		img.changed = false;
	}

	/**
	 * Initializes the current background image by clearing the relevant caches and fetching a new image based on the source setting.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics', or false for all)  in which the image is being requested.
	 * @param {boolean} [clearCache] - Whether to clear the background image cache.
	 *
	 * The background image cache should be cleared when:
	 * - The background image source is updated, clearing the previous source.
	 * - The playback starts a new album, clearing the previous images.
	 * - The player size changes, requiring a new scaling for the images.
	 */
	initBgImage(panel, clearCache) {
		if (!grSet.playlistBgImg && !grSet.libraryBgImg && !grSet.lyricsBgImg) return;

		if (clearCache) this.clearBgImageCache();

		this.handleBgImageIndex(panel, 'getIndexes');

		const panelSize = {
			playlist: [pl.playlist.x - SCALE(1), pl.playlist.y - pl.plman.h, pl.playlist.w + SCALE(2), pl.playlist.h + pl.plman.h * 2],
			library:  [lib.ui.x, lib.ui.y, lib.ui.w, lib.ui.h],
			lyrics:   [0, grm.ui.topMenuHeight, grm.ui.ww, grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight]
		};

		for (const p of ['playlist', 'library', 'lyrics']) { // Process specific `panel` or all if `panel` argument is false or image unavailable
			if (panel === p || !panel || this[`${p}BgImg`] == null) {
				this.getBgImage(p).then(img => {
					this[`${p}BgImg`] = img;
					this.handleBgImageIndex(p, 'setIndexes');
					window.RepaintRect(...panelSize[p]);
				});
			}
		}
	}

	/**
	 * Initializes or clears the cycling of background images.
	 * @param {string} [clear] - The panel ('playlist', 'library', 'lyrics') to clear the background image intervals.
	 */
	initBgImageCycle(clear) {
		for (const panel of ['playlist', 'library', 'lyrics']) {
			const cycle = grSet[`${panel}BgImgCycle`];
			const cycleTime = grSet[`${panel}BgImgCycleTime`];

			clearInterval(this.imgCycleIntervals[panel]);

			if (!cycle && panel !== clear) continue;

			DebugLog(`\n>>> initImage => initImgCycle => Panel: ${CapitalizeString(panel)} - Cycle time: ${cycleTime} seconds <<<\n`);
			this.imgCycleIntervals[panel] = cycle ? setInterval(() => {
				this.cycleBgImage(panel, 1);
			}, cycleTime * 1000) : null;
		}
	}

	/**
	 * Cycles the background image for the specified panel.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') in which the image should be cycled.
	 * @param {number} direction - The direction to cycle the images (1 for next, -1 for previous).
	 */
	cycleBgImage(panel, direction) {
		const imgKey = this.getBgImageSourceKeys(panel);
		const imgList = Array.isArray(imgKey.imgList) ? imgKey.imgList : this[imgKey.imgList];

		if (!imgList.length) {
			this[imgKey.imgIdx] = (this[imgKey.imgIdx] + direction + this.albumArtIdx.length) % this.albumArtIdx.length;
			const imgIdx = this.albumArtIdx[this[imgKey.imgIdx]];
			this.handleBgImageIndex(panel, 'setIndexes');

			this.fetchBgImageEmbedded(panel, imgIdx, imgKey.bgImg, imgKey.bgImgIdx).then(() => {
				this.initBgImage(panel);
			});

			return;
		}

		if (imgList.length <= 1) return;

		this[imgKey.imgIdx] = (this[imgKey.imgIdx] + direction + imgList.length) % imgList.length;
		this.handleBgImageIndex(panel, 'setIndexes');

		this.fetchBgImage(panel, imgList, imgKey.imgIdx, imgKey.bgImg, imgKey.bgImgIdx).then(() => {
			this.initBgImage(panel);
		});
	}

	/**
	 * Checks if the background image is cached, and updates the relevant properties if it is.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') in which the image is being requested.
	 * @param {string|string[]} imgList - The name of the property in `this` that contains the image list, or the image list array itself.
	 * @param {string} imgIdx - The name of the property in `this` that contains the current image index.
	 * @param {string} bgImg - The name of the property in `this` that contains the cached image.
	 * @param {string} bgImgIdx - The name of the property in `this` that contains the cached image index.
	 * @returns {{image: GdiBitmap|null, changed: boolean}} The background image and a flag indicating if it has changed.
	 */
	checkBgImageCache(panel, imgList, imgIdx, bgImg, bgImgIdx) {
		const imgArray = Array.isArray(imgList) ? imgList : this[imgList];
		const imgPath = imgArray[this[imgIdx]];
		const imgCached = grm.artCache.getImage(imgPath);

		if (imgCached) {
			this[bgImg] = imgCached;
			this[bgImgIdx] = this[imgIdx];
			return { image: imgCached, changed: false };
		}
		return { image: null, changed: true };
	}

	/**
	 * Clears the background image cache.
	 */
	clearBgImageCache() {
		this.playlistBgImg = null;
		this.libraryBgImg = null;
		this.lyricsBgImg = null;
		this.artistBgImg = null;
		this.artistImgList = [];
		this.albumBgImg = null;
		this.albumImgList = [];
		this.customBgImg = null;
		this.customImgList = [];
		DebugLog('Main cache => Background image cache cleared');
	}

	/**
	 * Fetches a background image, either from cache or asynchronously, and updates the relevant properties.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') in which the image is being requested.
	 * @param {string|string[]} imgList - The name of the property in `this` that contains the image list, or the image list array itself.
	 * @param {string} imgIdx - The name of the property in `this` that contains the current image index.
	 * @param {string} bgImg - The name of the property in `this` that contains the cached image.
	 * @param {string} bgImgIdx - The name of the property in `this` that contains the cached image index.
	 * @returns {Promise<{image: GdiBitmap|null, changed: boolean}>} The background image and a flag indicating if it has changed.
	 */
	fetchBgImage(panel, imgList, imgIdx, bgImg, bgImgIdx) {
		if (this.imgFetching[panel]) {
			return Promise.resolve({ image: null, changed: false });
		}

		this.imgFetching[panel] = true;

		const imgArray = Array.isArray(imgList) ? imgList : this[imgList];
		const imgIdxLocal = (this[imgIdx] >= imgArray.length) ? 0 : this[imgIdx];
		const imgPathIdx = imgArray[imgIdxLocal];

		return gdi.LoadImageAsyncV2(window.ID, imgPathIdx)
			.then(img => {
				this[bgImg] = grm.artCache.encache(img, imgPathIdx);
				this[bgImgIdx] = imgIdxLocal;
				return { image: img, changed: true };
			})
			.catch(error => {
				console.log(`\n>>> Background Image => fetchBgImage => <Error: Image could not be properly parsed: ${panel}:>\n`, error);
				return { image: null, changed: false };
			})
			.finally(() => {
				this.imgFetching[panel] = false;
			});
	}

	/**
	 * Fetches and caches embedded album art if available.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') in which the image is being requested.
	 * @param {string} imgIdx - The name of the property in `this` that contains the current image index.
	 * @param {string} bgImg - The name of the property in `this` that contains the cached image.
	 * @param {string} bgImgIdx - The name of the property in `this` that contains the cached image index.
	 * @returns {Promise<{image: GdiBitmap|null, changed: boolean}>} The embedded album art image and a flag indicating if it has changed.
	 */
	fetchBgImageEmbedded(panel, imgIdx, bgImg, bgImgIdx) {
		if (this.imgFetching[panel]) {
			return Promise.resolve({ image: null, changed: false });
		}

		this.imgFetching[panel] = true;

		try {
			const metadb = grm.ui.initMetadb();

			if (!metadb) {
				return Promise.resolve({ image: null, changed: false });
			}

			const imgIdxLocal = this.albumArtIdx.includes(imgIdx) ? imgIdx : 0;
			const albumArt = utils.GetAlbumArtV2(metadb, imgIdxLocal);

			if (albumArt) {
				this[bgImg] = grm.artCache.encache(albumArt, imgIdxLocal);
				this[bgImgIdx] = imgIdxLocal;
				return Promise.resolve({ image: albumArt, changed: true });
			}

			return Promise.resolve({ image: null, changed: false });
		}
		catch (error) {
			console.log(`\n>>> Background Image => fetchBgImageEmbedded => <Error: Image could not be properly parsed: ${panel}:>\n`, error);
			return Promise.resolve({ image: null, changed: false });
		}
		finally {
			this.imgFetching[panel] = false;
		}
	}

	/**
	 * Gets the background image based on the source setting.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') in which the image is being requested.
	 * @returns {{image: GdiBitmap|null, changed: boolean}} The background image and a flag indicating if it has changed.
	 */
	getBgImage(panel) {
		const { imgType, imgList, imgIdx, bgImg, bgImgIdx } = this.getBgImageSourceKeys(panel);
		const bgImagePattern = this.getBgImagePatterns(panel);

		this[imgList] = grm.ui.getImagePathList(imgType, grm.ui.initMetadb(), bgImagePattern);

		if (!this[imgList].length) {
			const embeddedIdx = this.albumArtIdx[this[imgIdx]];
			return this.fetchBgImageEmbedded(panel, embeddedIdx, bgImg, bgImgIdx);
		}

		const { image, changed } = this.checkBgImageCache(panel, imgList, imgIdx, bgImg, bgImgIdx);
		if (image) {
			return Promise.resolve({ image, changed });
		}

		return this.fetchBgImage(panel, imgList, imgIdx, bgImg, bgImgIdx);
	}

	/**
	 * Gets the background image pattern for a given panel type.
	 * @param {string} panel - The panel type, which can be 'playlist', 'library', or 'lyrics'.
	 * @returns {RegExp} The pattern for the specified panel type.
	 */
	getBgImagePatterns(panel) {
		const bgImagePatterns = {
			playlist: grSet.playlistBgImgAlbumArtFilter && ParseStringToRegExp(grCfg.artworkPatterns.playlistBgAlbumArt),
			library: grSet.libraryBgImgAlbumArtFilter && ParseStringToRegExp(grCfg.artworkPatterns.libraryBgAlbumArt),
			lyrics: grSet.lyricsBgImgAlbumArtFilter && ParseStringToRegExp(grCfg.artworkPatterns.lyricsBgAlbumArt)
		};

		return bgImagePatterns[panel];
	}

	/**
	 * Retrieves the background image source keys based on the specified panel.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics') whose background image source keys are to be retrieved.
	 * @returns {object} An object containing the image type, list, index, and background image keys.
	 */
	getBgImageSourceKeys(panel) {
		const Panel =  CapitalizeString(panel);

		const imgSrcKeys = {
			artist: { imgType: 'artistArt', imgList: 'artistImgList', imgIdx: `artistIdx${Panel}`, bgImg: 'artistBgImg', bgImgIdx: `artistIdxCached${Panel}` },
			album:  { imgType: 'albumArt',  imgList: 'albumImgList',  imgIdx: `albumIdx${Panel}`,  bgImg: 'albumBgImg',  bgImgIdx: `albumIdxCached${Panel}`  },
			custom: { imgType: 'customArt', imgList: 'customImgList', imgIdx: `customIdx${Panel}`, bgImg: 'customBgImg', bgImgIdx: `customIdxCached${Panel}` }
		};

		return imgSrcKeys[grSet[`${panel}BgImgSource`]];
	}

	/**
	 * Handles background image indexes for the specified panel.
	 * @param {string} panel - The panel ('playlist', 'library', 'lyrics', or false for all) whose background image indexes are to be retrieved.
	 * @param {string} action - The action to perform: 'getIndexes', 'setIndexes', or 'clearIndexes'.
	 */
	handleBgImageIndex(panel, action) {
		const panels = panel ? [panel] : ['playlist', 'library', 'lyrics'];

		const indexFields = {
			playlist: ['bgImgArtistIdxPlaylist', 'bgImgAlbumIdxPlaylist', 'bgImgCustomIdxPlaylist'],
			library:  ['bgImgArtistIdxLibrary',  'bgImgAlbumIdxLibrary',  'bgImgCustomIdxLibrary'],
			lyrics:   ['bgImgArtistIdxLyrics',   'bgImgAlbumIdxLyrics',   'bgImgCustomIdxLyrics']
		};

		const actions = {
			getIndexes: (Panel, artistIdx, albumIdx, customIdx) => {
				this[`artistIdx${Panel}`] = grSet[artistIdx];
				this[`albumIdx${Panel}`]  = grSet[albumIdx];
				this[`customIdx${Panel}`] = grSet[customIdx];
			},
			setIndexes: (Panel, artistIdx, albumIdx, customIdx) => {
				grSet[artistIdx] = this[`artistIdx${Panel}`];
				grSet[albumIdx]  = this[`albumIdx${Panel}`];
				grSet[customIdx] = this[`customIdx${Panel}`];
			},
			clearIndexes: (Panel) => {
				this[`artistIdx${Panel}`] = 0;
				this[`artistIdxCached${Panel}`] = -1;
				this[`albumIdx${Panel}`] = 0;
				this[`albumIdxCached${Panel}`] = -1;
				this[`customIdx${Panel}`] = 0;
				this[`customIdxCached${Panel}`] = -1;
			}
		};

		for (const panel of panels) {
			if (actions[action]) {
				actions[action](CapitalizeString(panel), ...indexFields[panel]);
			}
		}
	}
	// #endregion
}


///////////////////////////
// * CPU USAGE TRACKER * //
///////////////////////////
/**
 * A class that tracks and monitors CPU usage.
 */
class CPUTracker {
	/**
	 * Create the CPUTracker instance.
	 * @param {Function} onChangeCallback - A callback function to call when CPU usage changes.
	 */
	constructor(onChangeCallback) {
		/** @private @type {number} */
		this.cpuUsage = 0;
		/** @private @type {number} */
		this.guiCpuUsage = 0;
		/** @private @type {?number} */
		this.cpuTrackerTimer = null;
		/** @private @type {Function} */
		this.onChangeCallback = onChangeCallback;
		/** @private @type {{[key: string]: {sampleCount: number, currentSampleCount: number, resetSampleCount: number, acumUsage: number, averageUsage: number}}} */
		this.usage = {
			idle: {
				sampleCount: 30,
				currentSampleCount: 0,
				resetSampleCount: 0,
				acumUsage: 0,
				averageUsage: 0
			},
			playing: {
				sampleCount: 30,
				currentSampleCount: 0,
				resetSampleCount: 0,
				acumUsage: 0,
				averageUsage: 0
			}
		};
	}

	/**
	 * Gets the current CPU usage.
	 * @returns {number} The current CPU usage.
	 */
	getCpuUsage() {
		return this.cpuUsage;
	}

	/**
	 * Gets the current GUI CPU usage.
	 * @returns {number} The current GUI CPU usage.
	 */
	getGuiCpuUsage() {
		return this.guiCpuUsage;
	}

	/**
	 * Starts the CPU usage monitoring process.
	 */
	start() {
		if (this.cpuTrackerTimer) return;

		this.cpuTrackerTimer = setInterval(() => {
			const floatUsage = Math.random() * 100; // Simulated CPU usage
			const isPlaying = Math.random() > 0.5; // Simulated playback status
			const isPaused = Math.random() > 0.8;
			const usageType = isPlaying && !isPaused ? 'playing' : 'idle';

			this.updateUsage(usageType, floatUsage);

			const baseLine = this.usage[usageType].averageUsage;
			this.cpuUsage = floatUsage.toFixed(1);
			let usageDiff = Math.max((floatUsage - baseLine), 0);
			usageDiff = (usageDiff <= 0.5 ? 0 : usageDiff); // Suppress low spikes
			this.guiCpuUsage = usageDiff.toFixed(1);

			if (this.onChangeCallback) {
				this.onChangeCallback();
			}
		}, 1000);
	}

	/**
	 * Stops the CPU usage monitoring and resets usage statistics.
	 */
	stop() {
		if (this.cpuTrackerTimer) {
			clearInterval(this.cpuTrackerTimer);
			this.cpuTrackerTimer = undefined;
		}

		this.resetUsage('idle');
		this.resetUsage('playing');
	}

	/**
	 * Recalculates the average CPU usage based on a new sample.
	 * @param {string} type - The type of CPU usage to recalculate ('idle' or 'playing').
	 * @param {number} currentUsage - The new CPU usage sample.
	 */
	recalcAvg(type, currentUsage) {
		const usageState = this.usage[type];

		if (usageState.currentSampleCount < usageState.sampleCount) {
			usageState.acumUsage += currentUsage;
			usageState.currentSampleCount++;
			usageState.averageUsage = usageState.acumUsage / usageState.currentSampleCount;
			return;
		}

		usageState.averageUsage -= usageState.averageUsage / usageState.sampleCount;
		usageState.averageUsage += currentUsage / usageState.sampleCount;
	}

	/**
	 * Resets the CPU usage data for a specified type.
	 * @param {string} type - The type of CPU usage to reset ('idle' or 'playing').
	 */
	resetUsage(type) {
		const usageState = this.usage[type];
		usageState.currentSampleCount = 0;
		usageState.resetSampleCount = 0;
		usageState.acumUsage = 0;
		usageState.averageUsage = 0;
	}

	/**
	 * Updates the CPU usage data based on new sample.
	 * @param {string} type - The type of CPU usage to update ('idle' or 'playing').
	 * @param {number} currentUsage - The current CPU usage to update.
	 */
	updateUsage(type, currentUsage) {
		const usageState = this.usage[type];

		if (usageState.currentSampleCount) {
			if (usageState.averageUsage - currentUsage > 2) {
				if (usageState.resetSampleCount < 3) {
					usageState.resetSampleCount++;
				} else {
					this.resetUsage(type);
				}
			} else if (Math.abs(currentUsage - usageState.averageUsage) < 2) {
				this.recalcAvg(type, currentUsage);
			}
		} else {
			this.recalcAvg(type, currentUsage);
		}
	}
}


//////////////////
// * MESSAGES * //
//////////////////
/**
 * A class that manages messages and popups for various user interactions.
 */
class MessageManager {
	/**
	 * Create the `MessageManager` instance.
	 */
	constructor() {
		/**
		 * A collection of messages related to main UI actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMain = {};

		/**
		 * A collection of messages related to theme color actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgThemeColors = {};

		/**
		 * A collection of messages related to top menu `Options` > `Theme`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuThemeOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Style`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuStyleOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Preset`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuPresetOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Player controls`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuPlayerControlsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Details`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuDetailsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Library`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuLibraryOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Biography`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuBiographyOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Settings`.
		 * @public @type {Object<string, {content: string, msg: string, msgFb: string}>}
		 */
		this.msgMenuSettingsOptions = {};

		/**
		 * A collection of messages related to top menu `Options` > `Developer tools`.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgMenuDevToolsOptions = {};

		/**
		 * A collection of messages related to the context menus.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgContextMenu = {};

		/**
		 * A collection of messages related to the input box actions.
		 * @public @type {Object<string, {msg: string}>}
		 */
		this.msgInputBox = {};
	}

	/**
	 * Initializes the message objects and their properties and keys.
	 * @returns {void}
	 */
	initMessages() {
		this.msgMain = {
			fontsNotInstalled: {
				msg: 'Georgia-ReBORN WAS UNABLE TO LOAD SOME FONTS\n\n'
					+ 'Be sure all fonts from\nfoobar2000\\profile\\georgia-reborn\\fonts\nare correctly installed in these directories:\n\n'
					+ 'For Windows: C:\\Windows\\Fonts\\\nFor Linux: /usr/share/fonts or ~/.local/share/fonts\n\n'
					+ 'If you use custom fonts, all your custom fonts need to have\nthe exact font name / font family name in your\n'
					+ 'foobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc config file.\n\n'
					+ 'You can also check foobar\'s console ( Top menu > View > Console ),\nit will show font errors with its wrong font names.'
			},
			customFontsUsed: {
				msg: '\nCustom fonts are currently being used:\n\n'
					+ `Panel default: ${grCfg.customFont.fontDefault}\n`
					+ `Top menu: ${grCfg.customFont.fontTopMenu}\n`
					+ `Lower bar artist: ${grCfg.customFont.fontLowerBarArtist}\n`
					+ `Lower bar title: ${grCfg.customFont.fontLowerBarTitle}\n`
					+ `Lower bar disc: ${grCfg.customFont.fontLowerBarDisc}\n`
					+ `Lower bar time: ${grCfg.customFont.fontLowerBarTime}\n`
					+ `Lower bar length: ${grCfg.customFont.fontLowerBarLength}\n`
					+ `Lower bar waveform bar: ${grCfg.customFont.fontLowerBarWave}\n`
					+ `Notification: ${grCfg.customFont.fontNotification}\n`
					+ `Popup: ${grCfg.customFont.fontPopup}\n`
					+ `Tooltip: ${grCfg.customFont.fontTooltip}\n`
					+ `Grid artist: ${grCfg.customFont.fontGridArtist}\n`
					+ `Grid title: ${grCfg.customFont.fontGridTitle}\n`
					+ `Grid title bold: ${grCfg.customFont.fontGridTitleBold}\n`
					+ `Grid album: ${grCfg.customFont.fontGridAlbum}\n`
					+ `Grid key: ${grCfg.customFont.fontGridKey}\n`
					+ `Grid value: ${grCfg.customFont.fontGridValue}\n`
					+ `Playlist artist normal: ${grCfg.customFont.playlistArtistNormal}\n`
					+ `Playlist artist playing: ${grCfg.customFont.playlistArtistPlaying}\n`
					+ `Playlist artist normal compact: ${grCfg.customFont.playlistArtistNormalCompact}\n`
					+ `Playlist artist playing compact: ${grCfg.customFont.playlistArtistPlayingCompact}\n`
					+ `Playlist title normal: ${grCfg.customFont.playlistTitleNormal}\n`
					+ `Playlist title selected: ${grCfg.customFont.playlistTitleSelected}\n`
					+ `Playlist title playing: ${grCfg.customFont.playlistTitlePlaying}\n`
					+ `Playlist album: ${grCfg.customFont.playlistAlbum}\n`
					+ `Playlist date: ${grCfg.customFont.playlistDate}\n`
					+ `Playlist date compact: ${grCfg.customFont.playlistDateCompact}\n`
					+ `Playlist info: ${grCfg.customFont.playlistInfo}\n`
					+ `Playlist cover: ${grCfg.customFont.playlistCover}\n`
					+ `Playlist playcount: ${grCfg.customFont.playlistPlaycount}\n`
					+ `Library: ${grCfg.customFont.fontLibrary}\n`
					+ `Biography: ${grCfg.customFont.fontBiography}\n`
					+ `Lyrics: ${grCfg.customFont.fontLyrics}\n\n`
			},
			customThemeLiveEdit : {
				msg: `Custom theme can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${grCfg.configPathCustom}\n`
			},
			metadataGridLiveEdit : {
				msg: `Metadata grid can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${grCfg.configPath}\n`
			},
			albumArtCorruptError: {
				msg: 'Album art could not be properly parsed!\n\nMaybe it is corrupt, file format is not supported\nor has an unusual ICC profile embedded.\n\n'
			},
			discArtCorruptError: {
				msg: 'Disc art could not be properly parsed!\n\nMaybe it is corrupt, file format is not supported\nor has an unusual ICC profile embedded.\n\n'
			},
			playlistEmptyError: {
				msg: 'The user action has been canceled.\n\nPlease add some tracks to your playlist first!\n\n'
			},
			themeDayNightModeNotice: {
				msg: 'Theme day/night mode is active\nand has locked the theme.\n\nIn order to change themes,\nthis mode must be deactivated first.\n\nDeactivate it now?\n\n',
				msgFb: 'Theme day/night mode has been deactivated in order to change themes.'
			},
			themeDayNightSetup: {
				msg: `Theme setup for ${grSet.themeSetupDay ? 'daytime' : 'nighttime'} is active:\n\nPlease select your theme and styles\nfor ${grSet.themeSetupDay ? 'daytime' : 'nighttime'} usage.\n\nAfter configuration,\nrevisit the theme day/night menu\nto save changes.`
			},
			validateStyleNight: {
				msg: 'The "Night" theme style has been deactivated!\n\nIt is supported only for the following themes:\n"Reborn"\n"Random"\n"Custom"\n\nIt is not supported with these theme styles:\n"Reborn White"\n"Reborn Black"\n\n'
			},
			validateStyleBlackAndWhite: {
				msg: 'The "Black and white" theme styles have been deactivated!\n\nIt is supported only for the "White" theme.\n\n'
			},
			validateStyleBlackReborn: {
				msg: 'The "Black reborn" theme style has been deactivated!\n\nIt is supported only for the "Black" theme.\n\n'
			},
			validateStyleRebornSpecials: {
				msg: 'The "Reborn" special theme styles have been deactivated!\n\nOnly one theme style can be active\nat a time for this theme style group:\n"Reborn white"\n"Reborn black"\n"Reborn fusion"\n"Reborn fusion 2"\n"Reborn fusion accent"\n\nIt is supported only for the "Reborn" theme.\n\n'
			},
			validateStyleGradient: {
				msg: 'The "Gradient" theme styles have been deactivated!\n\nIt is supported only for following themes:\n"Reborn"\n"Random"\n"Blue"\n"Dark blue"\n"Red"\n"Custom".\n\n'
			},
			validateStyleGroupOne: {
				msg: 'Multiple active theme styles detected!\n\nOnly one theme style can be active\nat a time for this theme style group:\n"Blend"\n"Blend 2"\n"Gradient"\n"Gradient 2"\n\nOther theme styles for this group\nhave been deactivated.\n\n'
			},
			validateStyleGroupTwo: {
				msg: 'Multiple active theme styles detected!\n\nOnly one theme style can be active\nat a time for this theme style group:\n"Alternative"\n"Alternative 2"\n"Black and white"\n"Black and white 2"\n"Black and white reborn"\n"Black reborn"\n"Reborn white"\n"Reborn black"\n"Reborn fusion"\n"Reborn fusion 2"\n"Reborn fusion accent"\n"Random pastel"\n"Random dark"\n\nOther theme styles for this group\nhave been deactivated.\n\n'
			}
		};

		this.msgThemeColors = {
			playlistColorsCustomTheme: {
				msg: `Error when initializing playlist custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${grCfg.configPathCustom}\n`
			},
			libraryColorsCustomTheme: {
				msg: `Error when initializing library custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${grCfg.configPathCustom}\n`
			},
			biographyColorsCustomTheme: {
				msg: `Error when initializing biography custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${grCfg.configPathCustom}\n`
			},
			mainColorsCustomTheme: {
				msg: `Error when initializing main custom theme colors:\n\nOne or more variable color names do not exist or have wrong values in your custom config file:\n\n${grCfg.configPathCustom}\n`
			}
		};

		this.msgMenuThemeOptions = {
			renameCustomTheme: {
				msg: 'The renaming process was canceled.\n\nPlease ensure that you have selected and activated\na custom theme before attempting to rename it.\n\n'
			},
			saveCurrentColors: {
				msg: `Do you want to save current used colors\nto the selected custom theme slot?\n\nThis will overwrite all colors in the selected\ncustom theme slot.\n\nIt is recommended to make a backup\nof your custom config file:\n${grCfg.configPathCustom}\n\nSaved color changes will take effect on next reload.\n\nContinue?\n\n`
			}
		};

		this.msgMenuStyleOptions = {
			styleDefault: {
				msg: 'Theme style reset was canceled:\n\nActive theme sandbox needs to be deactivated first\nin order to reset theme styles.\n\n'
			}
		};

		this.msgMenuPresetOptions = {
			presetSelectModeDefault: {
				content: 'The default select mode will automatically choose\na random pick of 88 theme presets.\n\nDouble-click on the lower bar to choose\nanother random theme preset.\n\nWhen random mode is activated,\nall themes and style options will be available.\n\n',
				msg: 'Do you want to activate the -Default- preset select mode?\n\n{content}Continue?\n\n',
				msgFb: 'Default preset select mode activated:\n\n{content}'
			},
			presetSelectModeHarmonic: {
				content: 'The harmonic preset select mode will automatically\nchoose the best visual experience of themes and styles\nbased on album art.\n\nYou can also double-click on the lower bar\nto choose another random harmonic preset.\n\nWhen harmonic preset select mode is activated,\nall themes and almost all style options will be disabled.\n\n',
				msg: 'Do you want to activate the -Harmonic- preset select mode?\n\n{content}Continue?\n\n',
				msgFb: 'Harmonic preset select mode activated:\n\n{content}'
			},
			presetSelectModeTheme: {
				content: 'The theme preset select mode will automatically choose\na random theme preset based on current active theme.\n\nYou can also double-click on the lower bar\nto choose another random theme preset.\n\nWhen theme preset select mode is activated,\nall themes and style options will be available.\n\n',
				msg: 'Do you want to activate the -Theme- preset select mode?\n\n{content}Continue?\n\n',
				msgFb: 'Theme preset select mode activated:\n\n{content}'
			}
		};

		this.msgMenuPlayerControlsOptions = {
			loadEmbeddedAlbumArtFirst: {
				content: 'You also need to set it in foobar\'s preferences.\nFile > Preferences > Advanced > Display > Album art >\nEmbedded vs external: Prefer embedded.\n\nA restart is required to take effect.\n\n',
				msg: 'Do you want to load embedded album art first?\n\n{content}Continue?\n\n',
				msgFb: 'Embedded album art enabled:\n\n{content}'
			},
			panelBrowseMode: {
				content: 'When browse mode is active,\n'
					+ 'album art and track information in Details,\nBiography and Lower bar will change as you select\n'
					+ 'albums or tracks in the Playlist or Library.\n\nAdditionally, Library\'s play mode will be enabled.\n'
					+ 'When playing albums or tracks from the Library,\nit will not modify the content of the playlist,\n'
					+ 'until the browse mode is disabled.\n\nIf a track is currently playing,\nyou can use "Show Now Playing"\n'
					+ 'or lower bar track title click to return.\n\n',
				msg: 'Do you want to enable browse mode?\n\n{content}Continue?\n\n',
				msgFb: 'Browse mode enabled:\n\n{content}'
			},
			seekbarRefreshRateFast: {
				content: 'A fast refresh rate has been selected.\n'
					+ 'This setting is recommended only for\nhigh-end single-threaded CPUs.\n\n'
					+ 'If your CPU can not handle this rate,\nyou will experience lag and freezes.\n'
					+ 'Please select a slower refresh rate\nto avoid these issues.\n\n',
				msg: '>>> WARNING <<<\n\n{content}',
				msgFb: '>>> WARNING <<<\n\n{content}'
			},
			seekbarRefreshRateVeryFast: {
				content: 'A very fast refresh rate has been selected.\n'
					+ 'This setting is recommended only for\ntop-end single-threaded CPUs or\nbenchmarking purposes.\n\n'
					+ 'If your CPU can not handle this rate,\nyou will experience lag and freezes.\n'
					+ 'Please select a slower refresh rate\nto avoid these issues.\n\n',
				msg: '>>> WARNING <<<\n\n{content}',
				msgFb: '>>> WARNING <<<\n\n{content}'
			},
			waveformBarSaveModeLibrary: {
				content: 'This mode will not save any data files\nif the tracks are not indexed in the library.\n\n',
				msg: 'Waveform bar\'s "Library" save mode enabled.\n\n{content}\n\n',
				msgFb: 'Waveform bar\'s "Library" save mode enabled.\n\n{content}'
			},
			waveformBarSaveModeNever: {
				content: 'This mode will never save any data files,\nand analysis process will always be re-initialized.\n\n',
				msg: 'Waveform bar\'s save mode deactivated.\n\n{content}\n\n',
				msgFb: 'Waveform bar\'s save mode deactivated.\n\n{content}'
			}
		};

		this.msgMenuDetailsOptions = {
			discArtStub: {
				msg: `The custom disc art placeholder was not found in:\n${grPath.discArtCustomStub}\n\n`
					+ 'Be sure that image exist and has the correct filename\nin the "customDiscArtStub" section of the\n'
					+ `custom config file:\n${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc\n\n`
			}
		};

		this.msgMenuLibraryOptions = {
			actionModeDefault: {
				content: 'This will restore the original settings, presets,\nand behavior of the Library.\n\n',
				msg: 'Do you want to enable Library\'s default mode?\n\n{content}Continue?\n\n',
				msgFb: 'Library\'s default mode enabled:\n\n{content}'
			},
			actionModeBrowser: {
				content: 'This will act like a file browser to quickly see the content of the album. It is not recommended for new users\nwho don\'t know how the library works.\n\n',
				msg: 'Do you want to enable Library\'s browser mode?\n\n{content}Continue?\n\n',
				msgFb: 'Library\'s browser mode enabled:\n\n{content}'
			},
			actionModePlayer: {
				content: 'This will act like a playlist and will not automatically add content to the playlist. It is recommended for new users\nwho don\'t know how the library works.\n\n',
				msg: 'Do you want to enable Library\'s player mode?\n\n{content}Continue?\n\n',
				msgFb: 'Library\'s player mode enabled:\n\n{content}'
			}
		};

		this.msgMenuBiographyOptions = {
			cycPhotoLocation: {
				msg: 'Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.\n\n'
			},
			loadCovFolder: {
				msg: 'Enter folder in options: "Server Settings"\\Cover\\Covers: cycle folder.\n\nDefault: artist photo folder.\n\nImages are updated when the album changes. Any images arriving after choosing the current album aren\'t included.\n\n'
			}
		};

		this.msgMenuSettingsOptions = {
			themeDayNightMode: {
				content: 'The default daytime theme is White\nand the nighttime theme is Black.\n\nYou can set up and configure\na new theme and styles for both modes\nin the theme day/night mode setup.\n\n',
				msg: 'Do you want to activate the theme day/night mode?\n\n{content}Continue?\n\n',
				msgFb: 'Theme day/night mode is active:\n\n{content}'
			},
			themeSetupDay: {
				msg: '>>> Theme setup for daytime is active <<<\n\nPlease select your theme and styles for daytime usage.\nAfter configuring the theme settings, revisit this menu to save them and set a new time range.\n\n'
			},
			themeSetupNight: {
				msg: '>>> Theme setup for nighttime is active <<<\n\nPlease select your theme and styles for nighttime usage.\nAfter configuring the theme settings, revisit this menu to save them and set a new time range.\n\n'
			},
			themeSandboxRestore: {
				msg: 'Do you want to restore\nor keep current theme settings?\n\nThis will restore previously used\ntheme, styles, preset\nor use the current active.\n\nContinue?\n\n'
			},
			themeSandboxRestore2: {
				msg: grSet.savedPreset ? 'Do you want to restore\nlast used theme styles or theme preset?\n\n' : 'Do you want to restore\nlast used theme styles?\n\n',
				msgFb : 'Theme settings restored:\n\nTheme and styles have been restored.'
			},
			themeSandbox: {
				content: 'This mode is useful when trying out\nthemes, styles, presets or writing theme tags.\n\nAfter disabling the theme sandbox mode,\npreviously used theme settings can be restored.\n\n',
				msg: 'Do you want to activate the theme sandbox?\n\n{content}\n\nContinue?\n\n',
				msgFb: 'Theme sandbox mode activated::\n\n{content}'
			},
			customThemeFonts: {
				msg: 'Do you want to use custom theme fonts?\n\nYou need to set your custom fonts\nin your config file located in\nfoobar\\profile\\georgia-reborn\\configs\\georgia-reborn-config.jsonc\n\n\n'
			},
			customPreloaderLogo: {
				msg: `The custom logo placeholder can be replaced\nwith a new logo:\n\n${fb.ProfilePath}georgia-reborn\\images\\custom\\logo\\_4K-custom-logo.png and _custom-logo.png\n\nRecommended logo dimensions are:\n500x500 pixels for 4K\n250x250 pixels for HD\n\n`
			},
			customThemeImages: {
				msg: `All theme images can be safely replaced\nwith new custom ones:\n\n${fb.ProfilePath}georgia-reborn\\images\\custom\\\n\nPlease ensure all images have the same names\nas the original ones, which are located in the\nparent directory.\n\n`
			},
			deleteLibraryCache: {
				msg: 'Do you want to delete the library cache?\n\nThis will permanently delete cached library album art thumbnails.\n\nContinue?\n\n'
			},
			libraryAutoDelete: {
				msg: 'Do you want to set auto-delete for library cache?\n\nThis will always auto-delete cached library album art thumbnails on startup.\n\nContinue?\n\n'
			},
			deleteBiographyCache: {
				msg: 'Do you want to delete the biography cache?\n\nThis will permanently delete downloaded biography images and text files\n\nContinue?\n\n'
			},
			biographyAutoDelete: {
				msg: 'Do you want to set auto-delete for biography cache?\n\nThis will always auto-delete downloaded biography images\nand text on startup\n\nContinue?\n\n'
			},
			deleteLyricsCache: {
				msg: 'Do you want to delete all lyrics?\n\nThis will permanently delete downloaded lyrics.\n\nContinue?\n\n'
			},
			lyricsAutoDelete: {
				msg: 'Do you want to set auto-delete for lyrics?\n\nThis will always auto-delete downloaded lyrics on startup.\n\nContinue?\n\n'
			},
			deleteWaveformBarCache: {
				msg: 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n'
			},
			waveformBarAutoDelete: {
				msg: 'Do you want to set auto-delete for waveform bar?\n\nThis will always auto-delete waveform bar cache on startup.\n\nContinue?\n\n'
			},
			makeBackup: {
				msg: `Do you want to make a backup of the theme?\n\nThis will create a backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup\n\nContinue?\n\n\n`,
				msgFb: `You can find the Georgia-ReBORN theme backup in ${fb.ProfilePath}backup\n\nOn new fb2k installation, you can copy/paste and replace it with ${fb.ProfilePath}\n\nIf a backup already exist, you can use\nOptions > Settings > Theme backup > Restore backup`
			},
			restoreBackup: {
				msg: `Do you want to restore your backup of the theme?\n\n>>> WARNING <<<\n\nThis will restore your backup from ${fb.ProfilePath}\n\nChanges and modifications since your last backup\n(new theme settings, new playlists and play statistics)\nwill be lost!\n\nIt is recommended to make a new backup\nbefore you restore.\n\nContinue?\n\n\n`
			},
			saveSettingsConfig: {
				msg: 'Do you want to save all current theme settings?\n\nThis will overwrite all settings from the top menu "Options"\nin the georgia-reborn-config.jsonc file.\n\nContinue?\n\n'
			},
			loadSettingsConfig: {
				msg: 'Do you want to load all theme settings\nfrom the georgia-reborn-config.jsonc file?\n\nContinue?\n\n'
			},
			loadDefaultSettingsConfig: {
				msg: 'Do you want to load default theme settings?\n\nThis will not overwrite the georgia-reborn-config.jsonc file,\nbut you should probably first save your settings.\n\nContinue?\n\n'
			},
			resetSettingsMainConfig: {
				msg: 'Do you want to reset the config file to default?\n\n!!! WARNING !!!\n\nThis will set all settings to default.\nYou should probably make a backup first.\n\nContinue?\n\n'
			},
			resetSettingsCustomConfig: {
				msg: 'Do you want to reset the custom config file to default?\n\n!!! WARNING !!!\n\nThis will delete and replace all custom themes\nto the default custom theme template.\nYou should definitely make a backup first.\n\nContinue?\n\n'
			},
			resetSettingsAll: {
				msg: 'Do you want to reset all theme settings to default?\n\nThis will also clear all library custom views plus filters\nand Georgia-ReBORN config.\n\nContinue?\n\n'
			},
			resetSettingsAllError: {
				msg: 'Something went wrong and Georgia-ReBORN has NOT been successfully reset, try again!'
			},
			themePerformance: {
				msg: 'Do you want to change the theme performance?\n\nThese presets will change various theme settings!\nIt is recommended to save current theme settings\nto the config file. You should also make a backup\nof your playlists to be on the safe side!\n\n!!! WARNING !!!\n"High quality" and especially "Highest Quality"\ncan freeze foobar, depending how fast your CPU performs.\nIt does not matter if you are using a multi-core CPU,\nonly single-core CPU performance counts!\nIf your foobar is unresponsive, restart\nand change to a lighter preset.\n\nContinue?\n\n'
			}
		};

		this.msgMenuDevToolsOptions = {
			autoDownloadBio: {
				msg: 'Do you want to enable\nthe auto-download biography mode?\n\nThis will set the playback order to shuffle\nand activate a 6-second timer to automatically\ndownload the biography.\n\nThis is recommended when you leave your PC\nunattended for a longer period of time.\n\nContinue?\n\n'
			},
			autoDownloadLyrics: {
				msg: 'Do you want to enable\nthe auto-download lyrics mode?\n\nThis will set the playback order to playlist\nand activate a 15-second timer to automatically\ndownload the lyrics.\n\nThis is recommended when you leave your PC\nunattended for a longer period of time.\n\nContinue?\n\n'
			},
			systemFirstLaunch: {
				msg: 'Do you really want to set system to first launch?\n\nContinue?\n\n'
			},
			asyncThemePreloader: {
				msg: `Do you really want to set the script preloader\nto ${grSet.asyncThemePreloader ? 'synchronous' : 'asynchronous'}?\n\nContinue?\n\n`
			}
		};

		this.msgContextMenu = {
			discArtCustomStub: {
				msg: `The custom disc art placeholder was not found in:\n${grPath.discArtCustomStub}\n\nBe sure that image exist and has the correct filename\nin the "customDiscArtStub" section of the\ncustom config file:\n${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc\n\n`
			},
			deleteWaveformBarCache: {
				msg: 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n'
			},
			writingList: {
				msg: '>>> Attention <<<\n\nThis process may take anywhere\nfrom a few seconds to several minutes to complete,\ndepending on the number of tracks in the playlist,\nCPU power, and HDD/SSD speeds.\n\nPress OK to start the process\nand wait until it is finished.\n\n'
			}
		};

		this.msgCustomMenu = {
			customThemeInfo: {
				msg: 'You can modify the main colors, the playlist colors, the library colors and the biography colors.'
					+ 'First select a custom theme slot in the drop down menu "Options" that you want to modify.'
					+ 'You can either select the color via the color picker or paste a HEX value in the input field.\n'
					+ 'It will apply all changes in real time and saves it automatically in the georgia-reborn-custom.jsonc config file.'
					+ 'Each color has a name that you can also find in the georgia-reborn-custom.jsonc config file and modify it there.\n\n'
					+ 'To reset the colors to the default ones, select the "Reset" option from the drop down menu.\n\n'
					+ 'Tip: Download the resource pack from the Github page to open the custom theme template and modify colors in Photoshop or Gimp.\n'
					+ 'If you are happy with the result, just copy and paste the HEX values.\n\n'
					+ 'You can showcase your custom themes and share your configs here: Click on this text.'
			},
			metadataGridMenuInfo: {
				msg: 'You can modify existing entries or add your new custom patterns.\n'
					+ 'To confirm changes, press "Enter" or paste a new pattern into the input field.\n'
					+ 'All changes will be applied in real time and automatically saved in the\ngeorgia-reborn-config.jsonc file where it can be also manually modified.\n\n'
					+ 'To reset the metadata grid to its default patterns, select the "Reset" option\nfrom the drop down menu.\n\n'
					+ 'Tip: To reorder the entries, first copy the ones you want to change in your\nnotepad and paste the label and pattern afterwards.\n\n'
					+ 'Note: Not all entries will be displayed if the height of the player size is too small,\nchange to a larger player size if desired.\n\n'
					+ 'You can learn more about patterns here, click on this text.'
			}
		};

		this.msgInputBox = {
			addTracksPlaylist: {
				msg: 'Enter your new add tracks playlist or an existing playlist with its exact name:'
			},
			addTracksPlaylistError: {
				msg: `Playlist name is not valid:\n${grm.inputBox.inputBoxUserValue}\n\nDo not use any " at the beginning and the end of the playlist name.`
			},
			customCacheDir: {
				msg: `Enter your custom ${grm.inputBox.customDirString} directory:`
			},
			customCacheDirLyrics: {
				msg: 'If the custom lyrics directory has been set and is active,\nit must also be updated in the ESLyric location setting:\n\nfoobar\'s Preferences > Tools > ESLyric > Lyric Options > Save Settings > Location.\n\n'
			},
			customCacheDirError: {
				msg: `Path is not valid:\n${grm.inputBox.inputBoxUserValue}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExample of a correct path:\n\nD:\\Stuff\\Directory\\`
			},
			renameCustomTheme: {
				msg: 'Enter your desired name for your current active custom theme'
			},
			renameCustomThemeError: {
				msg: `Name is not valid:\n${grm.inputBox.inputBoxUserValue}\n\nSomething went wrong...`
			},
			playlistCustomHeaderInfo: {
				msg: 'Enter your custom playlist header info pattern:'
			},
			playlistCustomHeaderInfoError: {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`
			},
			playlistCustomTrackRow1 : {
				msg: 'Enter your custom playlist track row pattern:'
			},
			playlistCustomTrackRow2 : {
				msg: 'Enter your custom playlist track row pattern when no header displayed:'
			},
			playlistCustomTrackRowError : {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue || grm.inputBox.inputBoxUserValue2}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`
			},
			playlistSortCustom: {
				msg: 'Enter your custom playlist order pattern:'
			},
			playlistSortCustomError: {
				msg: `Pattern is not valid:\n${grm.inputBox.inputBoxUserValue}\n\nDo not use any " at the beginning and the end of your pattern.\n\nExamples of correct patterns:\n\n%album artist% %date% %album% %discnumber% %tracknumber% %title%\n\n$if2(%artist sort order%,%album artist%) $if2(%album sort order%,%album%) %edition% %codec% %discnumber% %tracknumber%`
			},
			themeDayNightModeCustom: {
				msg: 'Enter your custom day-night mode (e.g 6-18):'
			},
			themeDayNightModeCustomError: {
				msg: `Input is not valid: ${grm.inputBox.inputBoxNewValue}\n\nPlease enter valid times in 24-hour format separated by a hyphen (e.g 6-18), where both times are between 0 and 23.`
			}
		}
	}

	/**
	 * Retrieves the message for a given category and key.
	 * The concatenated message includes the content and the main or feedback message.
	 * @param {string} category - The category of the message (e.g., 'main', 'menu').
	 * @param {string} key - The key of the message within the category (e.g., 'default', 'harmonic').
	 * @param {boolean} feedback - Whether to retrieve the feedback message.
	 * @returns {string} The concatenated message or an empty string if not found.
	 */
	getMessage(category, key, feedback = false) {
		this.initMessages();

		const categories = {
			main: this.msgMain,
			themeColors: this.msgThemeColors,
			menu: {
				...this.msgMenuThemeOptions,
				...this.msgMenuStyleOptions,
				...this.msgMenuPresetOptions,
				...this.msgMenuPlayerControlsOptions,
				...this.msgMenuDetailsOptions,
				...this.msgMenuLibraryOptions,
				...this.msgMenuBiographyOptions,
				...this.msgMenuSettingsOptions,
				...this.msgMenuDevToolsOptions
			},
			contextMenu: this.msgContextMenu,
			customMenu: this.msgCustomMenu,
			inputBox: this.msgInputBox
		};

		const messages = categories[category];
		if (!messages) return '';

		const message = messages[key];
		if (!message) return '';

		const {	content = '', msg = '',	msgFb = '' } = message;
		const targetMsg = feedback ? msgFb : msg;

		return targetMsg.includes('{content}') ? targetMsg.replace('{content}', content) : targetMsg;
	}

	/**
	 * Displays a popup with customizable message and button labels.
	 * The behavior of the popup depends on the environment; if running under Wine or without Internet Explorer,
	 * it will show a simple popup message. Otherwise, it will show a confirm box with two buttons.
	 * @global
	 * @param {boolean} fbPopup - Determines if the fb.ShowPopupMessage should be shown.
	 * @param {string} fbMsg - The message to be displayed in the fb.ShowPopupMessage popup.
	 * @param {string} popUpMsg - The message to be displayed in the confirm box popup.
	 * @param {string} btn1Label - The label for the first button in the confirm box.
	 * @param {string} btn2Label - The label for the second button in the confirm box. If not provided, no second button is shown.
	 * @param {Function} callback - The callback function that is called with the confirmation status.
	 */
	showPopup(fbPopup, fbMsg, popUpMsg, btn1Label, btn2Label, callback) {
		const continue_confirmation = (status, confirmed) => {
			if (!confirmed) {
				callback(confirmed);
				return;
			}
			callback(confirmed);
		};

		if (Detect.Wine || !Detect.IE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			continue_confirmation(false, btn1Label);
			if (fbPopup) fb.ShowPopupMessage(fbMsg, 'Georgia-ReBORN');
		}
		else {
			lib.popUpBox.confirm('Georgia-ReBORN', popUpMsg, btn1Label, btn2Label, false, 'center', btn2Label ? continue_confirmation : false);
		}
	}

	/**
	 * Displays a simple popup notice message without canceling.
	 * @param {string} menuKey - The key of the menu from which to retrieve the message.
	 * @param {string} messageKey - The key of the message to be displayed.
	 * @param {string} [buttonLabel] - The optional label for the popup button.
	 */
	showPopupNotice(menuKey, messageKey, buttonLabel = 'OK') {
		const msgFb = grm.msg.getMessage(menuKey, messageKey, true);
		const msg = grm.msg.getMessage(menuKey, messageKey);
		grm.msg.showPopup(true, msgFb, msg, buttonLabel, false, (confirmed) => {});
	}
}


//////////////
// * MENU * //
//////////////
/**
 * A class that creates menus, submenus, radio groups, toggle items, etc.
 */
class Menu {
	/**
	 * Creates the `Menu` instance.
	 * @param {string} [title] - The title of the menu item. It is optional and defaults to an empty string if not provided.
	 */
	constructor(title = '') {
		if (!Menu.menuItemIndex) {
			/** @static @type {number} The starting index for the menu items. */
			Menu.menuStartIndex = 100;
			/** @static @type {number} The auto-incrementing index for each menu item created. */
			Menu.menuItemIndex = Menu.menuStartIndex;
			/** @static @type {Array<Function>} The callback functions for the menu items. */
			Menu.menuCallbacks = [];
			/** @static @type {Array<any>} The variables related to the menu items. */
			Menu.menuVariables = [];
		}
		Menu.menuItemIndex++;

		/** @private @type {PopupMenu} The instance of the popup menu created for this menu. */
		this.menu = window.CreatePopupMenu();
		/** @private @type {string} The title of the menu item. */
		this.title = title;
		/** @private @type {boolean} Indicates if the menu is a system menu. */
		this.systemMenu = false;
		/** @private @type {LibMenuManager|null} A reference to the menu manager handling this menu, if any. */
		this.menuManager = null;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Adds a menu item with a label, checked state, callback function, and optional variable to a menu.
	 * @param {string} label - The text that will be displayed for the menu item.
	 * @param {boolean} checked - Whether the menu item should be checked.
	 * @param {*} variable - A variable which will be passed to callback when item is clicked.
	 * @param {Function} callback - A function that will be executed when the menu item is clicked.
	 * @param {boolean} disabled - Whether the item should be disabled or not.
	 * @private
	 */
	_addItemWithVariable(label, checked, variable, callback, disabled) {
		this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, label);
		this.menu.CheckMenuItem(Menu.menuItemIndex, checked);
		Menu.menuCallbacks[Menu.menuItemIndex] = callback;
		if (typeof variable !== 'undefined') {
			Menu.menuVariables[Menu.menuItemIndex] = variable;
		}
		Menu.menuItemIndex++;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Creates the default foobar menu corresponding to `name`.
	 * @param {string} name - The name of the menu.
	 */
	initFoobarMenu(name) {
		if (!name) return;
		if (name === 'Media') name = 'Library'; // Remap `Media` button to foobar's `Library`
		this.systemMenu = true;
		this.menuManager = fb.CreateMainMenuManager();
		this.menuManager.Init(name);
		this.menuManager.BuildMenu(this.menu, 1, 1000);
	}

	/**
	 * Adds an item with a label, checked status, callback function, and optional disabled status.
	 * @param {string} label - The label for the item.
	 * @param {boolean} checked - Whether the menu item should be checked.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 */
	addItem(label, checked, callback, disabled = false) {
		this._addItemWithVariable(label, checked, undefined, callback, disabled);
	}

	/**
	 * Adds a toggle item to a list with a label, properties object, property name, callback function, and disabled state.
	 * @param {string} label - The label for the item.
	 * @param {object} propertiesObj - An object which contains propertyName.
	 * @param {string} propertyName - The name of the property to toggle on/off.
	 * @param {?Function} callback - A function that will be executed when the item is clicked.
	 * @param {?boolean} [disabled] - Whether the item should be disabled or not.
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
	 * Creates a set of toggled items and checks the value specified.
	 * @param {string[]} labels - The label for each item.
	 * @param {*} selectedValues - The value of the item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each entry.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	addToggleItems(labels, selectedValues, variables, callback = () => { }, disabled = false, disableCheckMarking = false, separator = []) {
		for (let i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, labels[i]);
			Menu.menuCallbacks[Menu.menuItemIndex] = callback;
			Menu.menuVariables[Menu.menuItemIndex] = variables[i];
			if (!disableCheckMarking && selectedValues.includes(variables[i])) {
				this.menu.CheckMenuItem(Menu.menuItemIndex, true);
			}
			Menu.menuItemIndex++;
			if (separator.includes(i)) {
				this.menu.AppendMenuSeparator();
			}
		}
	}

	/**
	 * Creates a set of radio items and checks the value specified.
	 * @param {string[]} labels - The label for each radio item.
	 * @param {*} selectedValue - The value of the radio item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each radio entry.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the radio check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	addRadioItems(labels, selectedValue, variables, callback = () => { }, disabled = false, disableCheckMarking = false, separator = []) {
		const startIndex = Menu.menuItemIndex;
		let selectedIndex;
		for (let i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, labels[i]);
			Menu.menuCallbacks[Menu.menuItemIndex] = callback;
			Menu.menuVariables[Menu.menuItemIndex] = variables[i];
			if (selectedValue === variables[i]) {
				selectedIndex = Menu.menuItemIndex;
			}
			Menu.menuItemIndex++;
			if (separator.includes(i)) {
				this.menu.AppendMenuSeparator();
			}
		}
		if (!disableCheckMarking && selectedIndex) {
			this.menu.CheckMenuRadioItem(startIndex, Menu.menuItemIndex - 1, selectedIndex);
		}
	}

	/**
	 * Creates a submenu consisting of radio items.
	 * @param {string} subMenuName - The name of the sub menu.
	 * @param {string[]} labels - The label for each radio item.
	 * @param {*} selectedValue - The value of the radio item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each radio entry.
	 * @param {Function} callback - A function that will be executed when the menu item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the radio check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	createRadioSubMenu(subMenuName, labels, selectedValue, variables, callback, disabled = false, disableCheckMarking = false, separator = []) {
		const subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, selectedValue, variables, callback, disabled, disableCheckMarking, separator);
		subMenu.appendTo(this, disabled);
	}

	/**
	 * Adds a separator to the menu.
	 */
	addSeparator() {
		this.menu.AppendMenuSeparator();
	}

	/**
	 * Appends a menu to a parent menu.
	 * @param {Menu} parentMenu - The menu to append the submenu to.
	 * @param {boolean} [disabled] - Whether the menu items should be disabled or not.
	 */
	appendTo(parentMenu, disabled = false) {
		this.menu.AppendTo(parentMenu.menu, MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), this.title);
	}

	/**
	 * Handles callback and automatically disposes the menu.
	 * @param {number} idx - The value of the menu item's callback to call. Comes from menu.trackPopupMenu(x, y).
	 */
	doCallback(idx) {
		if (idx > Menu.menuStartIndex && Menu.menuCallbacks[idx]) {
			Menu.menuCallbacks[idx](Menu.menuVariables[idx]);
		} else if (this.systemMenu && idx) {
			this.menuManager.ExecuteByID(idx - 1);
			this.menuManager = null;
		}
		this.menu = null;

		// Reset static properties as menu is about to be destroyed
		Menu.menuCallbacks = [];
		Menu.menuVariables = [];
		Menu.menuItemIndex = Menu.menuStartIndex;
	}

	/**
	 * Tracks a popup menu at the given coordinates and returns the index of the clicked menu item.
	 * @param {number} x - The x-coordinate where the menu will be displayed.
	 * @param {number} y - The y-coordinate where the menu will be displayed.
	 * @returns {number} The index of the menu item clicked on.
	 */
	trackPopupMenu(x, y) {
		return this.menu.TrackPopupMenu(x, y);
	}
	// #endregion
}


///////////////////
// * INPUT BOX * //
///////////////////
/**
 * A class that creates input boxes for allowing users to customize settings.
 */
class InputBox {
	/**
	 * Create the `InputBox` instance.
	 */
	constructor() {
		/** @private @type {string} The new value of the input box. */
		this.inputBoxNewValue = '';
		/** @private @type {string} The second new value of the input box. */
		this.inputBoxNewValue2 = '';
		/** @private @type {string} The user's new value of the input box. */
		this.inputBoxUserValue = '';
		/** @private @type {string} The user's second new value of the input box. */
		this.inputBoxUserValue2 = '';
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Prompts the user to enter the playlist where tracks will be added when using the add tracks button.
	 * @throws Will throw an error if the new value is not a string.
	 */
	addTracksPlaylist() {
		const inputBoxOldValue = JSON.stringify(grCfg.themeControls.addTracksPlaylist).replace(/"/g, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'addTracksPlaylist');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'addTracksPlaylistError');
				fb.ShowPopupMessage(msg, 'Add tracks playlist');
			}
			return;
		}

		grCfg.themeControls.addTracksPlaylist = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('themeControls', true);
	}

	/**
	 * Prompts the user to enter a custom directory path for various cache types and updates the configuration.
	 * It supports custom directories for library, biography, lyrics, and waveform bar.
	 * @param {string} directory - One of the following options to specify the type of cache directory:
	 * - 'library' - sets the custom Library cache directory.
	 * - 'biography' - sets the custom Biography cache directory.
	 * - 'lyrics' - sets the custom Lyrics cache directory.
	 * - 'waveformBar' - sets the custom Waveform bar cache directory.
	 * @throws Will throw an error if the new value is not a string.
	 */
	customCacheDir(directory) {
		const dirMap = {
			library: {
				name: 'customLibraryDir',
				path: grCfg.customLibraryDir,
				string: 'library',
				schema: grDef.customLibraryDirSchema
			},
			biography: {
				name: 'customBiographyDir',
				path: grCfg.customBiographyDir,
				string: 'biography',
				schema: grDef.customBiographyDirSchema
			},
			lyrics: {
				name: 'customLyricsDir',
				path: grCfg.customLyricsDir,
				string: 'lyrics',
				schema: grDef.customLyricsDirSchema
			},
			waveformBar: {
				name: 'customWaveformBarDir',
				path: grCfg.customWaveformBarDir,
				string: 'waveform',
				schema: grDef.customWaveformBarDirSchema
			}
		};

		const dirInfo = dirMap[directory] || {};
		const customDirPath = dirInfo.path || '';
		const customDirSchema = dirInfo.schema || '';
		this.customDirString = dirInfo.string || '';

		const inputBoxOldValue = JSON.stringify(customDirPath).replace(/["[\]]/g, '').replace(/\\\\/g, '\\');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'customCacheDir');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue.replace(/[\\/]/g, '\\\\')}"`);
			if (typeof this.inputBoxNewValue !== 'string') {
				throw new Error('Invalid type');
			}
			if (dirInfo.name === 'customLyricsDir') {
				grm.msg.showPopupNotice('inputBox', 'customCacheDirLyrics');
			}
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'customCacheDirError');
				fb.ShowPopupMessage(msg, `Custom ${this.customDirString} directory`);
			}

			if (dirInfo.name) grSet[dirInfo.name] = false;
			return;
		}

		grCfg.configCustom.addConfigurationObject(customDirSchema, [this.inputBoxNewValue]);
		grCfg.configCustom.writeConfiguration();
	}

	/**
	 * Prompts the user to enter a new name for the currently active custom theme and updates the configuration.
	 * It handles renaming for pre-defined custom themes, identified by keys like 'custom01', 'custom02', etc.
	 * @throws Will throw an error if the new value is not a string.
	 */
	renameCustomTheme() {
		const customThemes = {
			custom01: 'customTheme01',
			custom02: 'customTheme02',
			custom03: 'customTheme03',
			custom04: 'customTheme04',
			custom05: 'customTheme05',
			custom06: 'customTheme06',
			custom07: 'customTheme07',
			custom08: 'customTheme08',
			custom09: 'customTheme09',
			custom10: 'customTheme10'
		};
		const customTheme = customThemes[grSet.theme] || '';

		const customThemeNames = {
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
		const customThemeName = customThemeNames[grSet.theme] || '';

		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'renameCustomTheme');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', customThemeName.name, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'renameCustomThemeError');
				fb.ShowPopupMessage(msg, 'Custom theme name');
			}
			return;
		}

		customThemeName.name = this.inputBoxNewValue;
		grCfg.configCustom.updateConfigObjValues(customTheme, true);
	}

	/**
	 * Prompts the user to enter a custom pattern for playlist header information and updates the settings.
	 * @throws Will throw an error if the new value is not a string.
	 */
	playlistCustomHeaderInfo() {
		const inputBoxOldValue = JSON.stringify(grCfg.settings.playlistCustomHeaderInfo).replace(/"/g, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistCustomHeaderInfo');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistCustomHeaderInfoError');
				fb.ShowPopupMessage(msg, 'Custom playlist header info');
			}
			return;
		}

		grCfg.settings.playlistCustomHeaderInfo = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('settings', true);
	}

	/**
	 * Prompts the user to enter custom patterns for playlist track rows with and without headers.
	 * @throws Will throw an error if the new values are not strings.
	 */
	playlistCustomTrackRow() {
		const inputBoxOldValue1 = JSON.stringify(grCfg.settings.playlistCustomTitle).replace(/"/g, '');
		const inputBoxOldValue2 = JSON.stringify(grCfg.settings.playlistCustomTitleNoHeader).replace(/"/g, '');
		this.inputBoxNewValue = '';
		this.inputBoxNewValue2 = '';
		this.inputBoxUserValue = '';
		this.inputBoxUserValue2 = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistCustomTrackRow1');
			const msg2 = grm.msg.getMessage('inputBox', 'playlistCustomTrackRow2');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue1, true);
			this.inputBoxUserValue2 = utils.InputBox(window.ID, msg2, 'Georgia-ReBORN', inputBoxOldValue2, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			this.inputBoxNewValue2 = !this.inputBoxUserValue2 || typeof this.inputBoxUserValue2 !== 'string' && !this.inputBoxUserValue2.length ? '' : JSON.parse(`"${this.inputBoxUserValue2}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
			if (typeof this.inputBoxNewValue2 !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistCustomTrackRowError');
				fb.ShowPopupMessage(msg, 'Custom playlist track row');
			}
			return;
		}

		grCfg.settings.playlistCustomTitle = this.inputBoxNewValue;
		grCfg.settings.playlistCustomTitleNoHeader = this.inputBoxNewValue2;
		grCfg.config.updateConfigObjValues('settings', true);
	}

	/**
	 * Prompts the user to enter a custom sort pattern for the playlist.
	 * @throws Will throw an error if the new value is not a string.
	 */
	playlistSortCustom() {
		const inputBoxOldValue = JSON.stringify(grCfg.settings.playlistSortCustom).replace(/"/g, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistSortCustom');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistSortCustomError');
				fb.ShowPopupMessage(msg, 'Custom playlist order');
			}
			return;
		}

		grCfg.settings.playlistSortCustom = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('settings', true);
	}

	/**
	 * Prompts the user to enter a custom day-night mode start and end times.
	 * @throws Will throw an error if the format or times are invalid.
	 */
	themeDayNightModeCustom() {
		const inputBoxOldValue = Array.isArray(grCfg.themeSettings.themeDayNightMode) ? grCfg.themeSettings.themeDayNightMode.join('-') : grCfg.themeSettings.themeDayNightMode || '6-18';
		this.inputBoxNewValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'themeDayNightModeCustom');
			this.inputBoxNewValue = utils.InputBox(msg, 'Georgia-ReBORN', inputBoxOldValue, true);

			const validFormat = /^\s*(\d+)\s*-\s*(\d+)\s*$/; // Regex to match a valid input format
			const match = this.inputBoxNewValue.match(validFormat);
			if (!match) throw new Error('Invalid format');

			const startTime = Number(match[1]);
			const endTime = Number(match[2]);
			if (startTime === endTime || startTime < 0 || startTime > 23 || endTime < 0 || endTime > 23) {
				throw new Error('Invalid time');
			}

			grCfg.themeSettings.themeDayNightMode = grSet.themeDayNightMode = this.inputBoxNewValue;
		}
		catch (e) {
			if (e.message === 'Invalid format' || e.message === 'Invalid time') {
				const msg = grm.msg.getMessage('inputBox', 'themeDayNightModeCustomError');
				fb.ShowPopupMessage(msg, 'Custom Day/Night Mode');
			}
		}

		grCfg.config.updateConfigObjValues('themeSettings', true);
		initThemeDayNightMode(new Date());
		grm.ui.resetTheme();
		grm.ui.initThemeFull = true;
		grm.ui.initCustomTheme();
		grm.ui.initTheme();
		grm.ui.initStyleState();
		grm.preset.initThemePresetState();
	}
	// #endregion
}


/////////////////
// * TOOLTIP * //
/////////////////
/**
 * A class that creates or stops the tooltip timer.
 */
class TooltipTimer {
	/**
	 * Creates the `TooltipTimer` instance.
	 */
	constructor() {
		/** @private @type {number|undefined} The timer ID for the tooltip display timeout. */
		this.tooltipTimer = undefined;
		/** @private @type {number|undefined} The identifier of the current tooltip caller. */
		this.tooltipCaller = undefined;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Displays the tooltip.
	 * @param {string} text - The text to show in the tooltip.
	 * @param {boolean} [force] - Activates the tooltip whether or not text has changed.
	 */
	displayTooltip(text, force) {
		if (grm.ui.ttip && (grm.ui.ttip.Text !== text.toString() || force)) {
			grm.ui.ttip.Text = text;
			grm.ui.ttip.Activate();
		}
	}

	/**
	 * Starts a tooltip.
	 * @param {number} id - The id of the caller.
	 * @param {string} text - The text to show in the tooltip.
	 */
	start(id, text) {
		const oldCaller = this.tooltipCaller;
		this.tooltipCaller = id;

		if (!this.tooltipTimer && grm.ui.ttip.Text) {
			this.displayTooltip(text, oldCaller !== this.tooltipCaller);
		}
		else { // * There can be only one tooltip present at all times, so we can kill the timer w/o any worries
			if (this.tooltipTimer) {
				this.forceStop();
			}

			if (!this.tooltipTimer) {
				this.tooltipTimer = setTimeout(() => {
					this.displayTooltip(text);
					this.tooltipTimer = null;
				}, 300);
			}
		}
	}

	/**
	 * Stops a tooltip.
	 * @param {number} id - The id of the caller.
	 */
	stop(id) {
		if (this.tooltipCaller === id) { // Do not stop other callers
			this.forceStop();
		}
	}

	/**
	 * Forces the tooltip to stop.
	 */
	forceStop() {
		this.displayTooltip('');
		if (!this.tooltipTimer) return;
		clearTimeout(this.tooltipTimer);
		this.tooltipTimer = null;
		this.tooltipCaller = null;
	}
	// #endregion
}


/**
 * A class that creates or clears the tooltip text for normal and styled tooltips.
 */
class TooltipHandler {
	/**
	 * Creates the `TooltipHandler` instance.
	 * Constructs a unique ID and a reference to the TooltipTimer instance.
	 */
	constructor() {
		/** @private @type {number} The unique identifier for this TooltipHandler instance. */
		this.id = Math.ceil(Math.random() * 10000);
		/** @private @type {TooltipTimer} A reference to the TooltipTimer instance used to manage tooltip timing. */
		this.timer = new TooltipTimer();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Shows tooltip after delay (300ms).
	 * @param {string} text - The text to show in the tooltip.
	 */
	showDelayed(text) {
		grm.ui.styledTooltipText = text;
		if (!grSet.showStyledTooltips) {
			this.timer.start(this.id, text);
		}
	}

	/**
	 * Shows the tooltip immediately.
	 * @param {string} text - The text to show in the tooltip.
	 */
	showImmediate(text) {
		grm.ui.styledTooltipText = text;
		if (!grSet.showStyledTooltips) {
			this.timer.stop(this.id);
			this.timer.displayTooltip(text);
		}
	}

	/**
	 * Clears this tooltip if this handler created it.
	 */
	clear() {
		this.timer.stop(this.id);
	}

	/**
	 * Clears the tooltip regardless of which handler created it.
	 */
	stop() {
		this.timer.forceStop();
	}
	// #endregion
}


//////////////////////////////
// * INTERFACE HYPERLINKS * //
//////////////////////////////
/**
 * A class that creates clickable hyperlinks in the Playlist header and in the lower bar.
 */
class Hyperlink {
	/**
	 * Creates the `Hyperlink` instance.
	 * Initializes properties for the text element in the playlist.
	 * @param {string} text - The text that will be displayed in the hyperlink.
	 * @param {GdiFont} font - The font to use.
	 * @param {string} type - The field name which will be searched when clicking on the hyperlink.
	 * @param {number} xOffset - The x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 * @param {number} yOffset - The y-offset of the hyperlink.
	 * @param {number} containerWidth - The width of the container the hyperlink will be in. Used for right justification purposes.
	 * @param {boolean} [inPlaylist] - If the hyperlink is drawing in a scrolling container like a playlist, then it is drawn differently.
	 */
	constructor(text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false) {
		/** @private @type {string} */
		this.text = text;
		/** @private @type {string} */
		this.type = type;
		/** @private @type {number} */
		this.x_offset = xOffset;
		/** @private @type {number} */
		this.x = xOffset < 0 ? containerWidth + xOffset : xOffset;
		/** @private @type {number} */
		this.y_offset = yOffset;
		/** @private @type {number} */
		this.y = yOffset;
		/** @private @type {number} */
		this.container_w = containerWidth;
		/** @private @type {boolean} */
		this.state = HyperlinkStates.Normal;
		/** @private @type {boolean} */
		this.inPlaylist = inPlaylist;

		this.setFont(font);
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the hyperlink. When drawing in a playlist, we draw from the y-offset instead of y, because the playlist scrolls.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} color - The color of the hyperlink.
	 */
	draw(gr, color) {
		const font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
		DrawString(gr, this.text, font, color, this.x, this.inPlaylist ? this.y_offset : this.y, this.w + SCALE(1), this.h, Stringformat.trim_ellipsis_char);
	}

	/**
	 * Sets the xOffset of the hyperlink after it has been created.
	 * @param {number} xOffset - The x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 */
	setXOffset(xOffset) {
		this.x = xOffset < 0 ? this.container_w + xOffset : xOffset;
	}

	/**
	 * Sets the vertical position of the hyperlink.
	 * The playlist requires subtracting 2 additional pixels from y for some reason.
	 * @param {number} y - The y-coordinate.
	 */
	setY(y) {
		this.y = y + this.y_offset + (-2);
	}

	/**
	 * Sets the font for the hyperlink.
	 * @param {GdiFont} font - The font that will be used.
	 */
	setFont(font) {
		this.font = font;
		this.hoverFont = gdi.Font(font.Name, font.Size, font.Style | FontStyle.underline);
		this.link_dimensions = this.updateDimensions();
	}

	/**
	 * Sets the width of the container the hyperlink will be placed in.
	 * If hyperlink width is smaller than the container, it will be truncated.
	 * If the the xOffset is negative, the position will be adjusted as the container width changes.
	 * @param {number} w - The width.
	 */
	setContainerWidth(w) {
		if (this.x_offset < 0) {
			this.x = w + this.x_offset; // Add because offset is negative
		}
		this.container_w = w;
		this.link_dimensions = this.updateDimensions();
		this.w = Math.ceil(Math.min(this.container_w, this.link_dimensions.Width + 1));
	}

	/**
	 * Gets the width of the hyperlink.
	 * @returns {number} The width of the link in pixels.
	 */
	getWidth() {
		try {
			return Math.ceil(this.link_dimensions.Width);
		} catch (e) {
			return null;
		}
	}

	/**
	 * Updates the width and height of the hyperlinks.
	 * @returns {number} The dimensions of the text.
	 */
	updateDimensions() {
		try {
			const measureStringScratchImg = gdi.CreateImage(1000, 200);
			const gr = measureStringScratchImg.GetGraphics();
			const dimensions = gr.MeasureString(this.text, this.font, 0, 0, 0, 0);
			this.h = Math.ceil(dimensions.Height) + 1;
			this.w = Math.min(Math.ceil(dimensions.Width) + 1, this.container_w);
			measureStringScratchImg.ReleaseGraphics(gr);
			return dimensions;
		} catch (e) {
			return null; // Probably some invalid parameters on init
		}
	}

	/**
	 * Populates the result of artist, album, date or label in the "Search" playlist when a hyperlink was clicked.
	 */
	click() {
		const populatePlaylist = (query) => {
			DebugLog(query);
			try {
				const handle_list = fb.GetQueryItems(fb.GetLibraryItems(), query);
				if (handle_list.Count) {
					pl.history.ignorePlaylistMutations = true;
					const plist = plman.FindOrCreatePlaylist('Search', true);
					plman.UndoBackup(plist);
					handle_list.Sort();
					const index = fb.IsPlaying ? handle_list.BSearch(fb.GetNowPlaying()) : -1;

					if (plist === plman.PlayingPlaylist && plman.GetPlayingItemLocation().PlaylistIndex === pl && index !== -1) {
						// Remove everything in playlist except currently playing song
						plman.ClearPlaylistSelection(plist);
						plman.SetPlaylistSelection(plist, [plman.GetPlayingItemLocation().PlaylistItemIndex], true);
						plman.RemovePlaylistSelection(plist, true);
						plman.ClearPlaylistSelection(plist);

						handle_list.RemoveById(index);
					}
					else {
						// Nothing playing or Search playlist is not active
						plman.ClearPlaylist(plist);
					}

					plman.InsertPlaylistItems(plist, 0, handle_list);
					plman.SortByFormat(plist, grCfg.settings.playlistSortDefault);
					plman.ActivePlaylist = plist;
					pl.history.ignorePlaylistMutations = false;

					return true;
				}
				return false;
			}
			catch (e) {
				pl.history.ignorePlaylistMutations = false;
				console.log(`Could not successfully execute: ${query}`);
			}
		};

		/** @type {string} */
		let query;
		switch (this.type) {
			case 'update': RunCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/releases'); break;
			case 'date':   query = grSet.showPlaylistFullDate ? `"${grTF.date}" IS ${this.text}` : `"$year(%date%)" IS ${this.text}`; break;
			case 'artist': query = grSet.headerFlipRows ? `Album HAS "${this.text.replace(/"/g, '')}"` : `Artist HAS "${this.text.replace(/"/g, '')}" OR Album Artist HAS "${this.text.replace(/"/g, '')}" OR ARTISTFILTER HAS "${this.text.replace(/"/g, '')}"`; break;
			case 'album':  query = grSet.headerFlipRows ? `Artist HAS "${this.text.replace(/"/g, '')}" OR Album Artist HAS "${this.text.replace(/"/g, '')}" OR ARTISTFILTER HAS "${this.text.replace(/"/g, '')}"` : `Album HAS "${this.text.replace(/"/g, '')}"`; break;
			case 'label':  query = `Label HAS "${this.text.replace(/"/g, '')}" OR Publisher HAS "${this.text.replace(/"/g, '')}"`; break;
			default:       query = `${this.type} IS "${this.text}"`; break;
		}

		if (!populatePlaylist(query)) {
			const start = this.text.indexOf('[');
			if (start > 0) {
				query = `${this.type} IS ${this.text.slice(0, start - 3)}`; // Remove ' - [...]' from end of string in case we're showing "Album - [Deluxe Edition]", etc.
				populatePlaylist(query);
			}
		}
	}

	/**
	 * Updates the hyperlink state.
	 */
	repaint() {
		try {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		} catch (e) {
			// Probably already redrawing
		}
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Sets mouse hover state for every hyperlink not created in Playlist.
	 * @param {object} hyperlink - The hyperlink object.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	on_mouse_move(hyperlink, x, y) {
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

	/**
	 * Checks if the mouse is within the boundaries of a hyperlink.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}
	// #endregion
}


/////////////////////
// * JUMP SEARCH * //
/////////////////////
/**
 * A class that creates the jump search when using keystrokes.
 * Searches in the active Playlist first and when nothing found, it tries in the Library.
 */
class JumpSearch {
	/**
	 * Creates the `JumpSearch` instance.
	 */
	constructor() {
		/** @private @type {number} */
		this.arc1 = 5;
		/** @private @type {number} */
		this.arc2 = 4;
		/** @private @type {object} */
		this.j = {
			x: 0,
			y: 0,
			w: grSet.notificationFontSize_layout * 2,
			h: grSet.notificationFontSize_layout * 2
		};
		/** @private @type {string} */
		this.jSearch = '';
		/** @private @type {boolean} */
		this.jump_search = true;
		/** @type {{ [key: string]: number[] }}  */
		this.initials = null;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the jump search on the playlist panel.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (!this.jSearch) return;
		gr.SetSmoothingMode(4);
		this.j.w = gr.CalcTextWidth(this.jSearch, grFont.notification) + 25;
		gr.FillRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, RGBtoRGBA(grCol.popupBg, 220));
		gr.DrawRoundRect(this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, this.arc1, this.arc1, 1, 0x64000000);
		gr.DrawRoundRect(this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w - 2, this.j.h - 2, this.arc2, this.arc2, 1, 0x28ffffff);
		// gr.GdiDrawText(this.jSearch, grFont.notification, RGB(0, 0, 0), this.j.x - this.j.w / 2 + 1, this.j.y + 1, this.j.w, this.j.h, panel.cc); // Drop shadow not needed
		gr.GdiDrawText(this.jSearch, grFont.notification, this.jump_search ? grCol.popupText : 0xffff4646, this.j.x - this.j.w / 2, this.j.y, this.j.w, this.j.h, lib.panel.cc);
		gr.SetSmoothingMode(0);
	}

	/**
	 * Sets the vertical position of the jump search.
	 * @param {number} y - The y-coordinate.
	 */
	setY(y) {
		this.y = y;
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Handles key pressed events and activates the jump search.
	 * @param {number} code - The character code.
	 */
	on_char(code) {
		if (grSet.jumpSearchDisabled || lib.panel.search.active ||
			utils.IsKeyPressed(VKey.CONTROL) || utils.IsKeyPressed(VKey.ESCAPE)) {
			return;
		}

		const text = String.fromCharCode(code);
		const playlistItems = plman.GetPlaylistItems(plman.ActivePlaylist);
		const search = fb.TitleFormat(grSet.jumpSearchComposerOnly ? '%composer%' : '$if2(%album artist%, %artist%)').EvalWithMetadbs(playlistItems);
		let focusIndex = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
		let advance = false;
		let foundInPlaylist = false;
		let foundInLibrary = false;

		switch (code) {
			case lib.vk.back:
				this.jSearch = this.jSearch.slice(0, -1);
				break;
			case lib.vk.enter:
				this.jSearch = '';
				return;
			default:
				this.jSearch += text;
				break;
		}

		// * Playlist advance
		if (focusIndex >= 0 && focusIndex < search.length && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
			const char = search[focusIndex].replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (char === text && AllEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}
		// * Library advance
		else if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length && !grm.ui.displayLibrarySplit(true)) {
			const char = lib.pop.tree[lib.panel.pos].name.replace(/@!#.*?@!#/g, '').charAt(0).toLowerCase();
			if (lib.pop.tree[lib.panel.pos].sel && char === text && AllEqual(this.jSearch)) {
				this.jSearch = this.jSearch.slice(0, 1);
				advance = true;
			}
		}

		switch (true) {
			case advance: {
				if (utils.IsKeyPressed(0x0A) || utils.IsKeyPressed(VKey.BACK) ||  utils.IsKeyPressed(VKey.TAB) || utils.IsKeyPressed(VKey.CONTROL) || utils.IsKeyPressed(VKey.ESCAPE) || utils.IsKeyPressed(VKey.MULTIPLY) || utils.IsKeyPressed(VKey.SUBTRACT)) return;
				let init = '';
				let cur = 'currentArr';
				if (!this.initials) { // reset in buildTree
					this.initials = {};
					// * Playlist advance
					if (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true)) {
						for (const [i] of playlistItems.Convert().entries()) {
							const name = search[i].replace(/@!#.*?@!#/g, '');
							init = name.charAt().toLowerCase();
							if (cur !== init && !this.initials[init]) {
								this.initials[init] = [i];
								cur = init;
							} else {
								this.initials[init].push(i);
							}
						}
					}
					// * Library advance
					else {
						for (const [i, v] of lib.pop.tree.entries()) {
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
						}
					}
				}

				this.jump_search = false;

				// * Playlist advance
				if (focusIndex >= 0 && focusIndex < search.length && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
					this.matches = this.initials[text];
					DebugLog('Playlist advance results', this.matches); // Debug
					this.ix = this.matches.indexOf(focusIndex);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					focusIndex = this.matches[this.ix];
					this.jump_search = true;
				}
				// * Library advance
				else if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length && !grm.ui.displayLibrarySplit(true)) {
					this.matches = this.initials[text];
					DebugLog('Library advance results', this.matches); // Debug, can remove this soon
					this.ix = this.matches.indexOf(lib.panel.pos);
					this.ix++;
					if (this.ix >= this.matches.length) this.ix = 0;
					lib.panel.pos = this.matches[this.ix];
					this.jump_search = true;
				}

				// * Playlist advance
				if (this.jump_search && (grm.ui.displayPlaylist || grm.ui.displayLibrarySplit(true))) {
					plman.ClearPlaylistSelection(plman.ActivePlaylist);
					plman.SetPlaylistFocusItem(plman.ActivePlaylist, focusIndex);
					plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, focusIndex, true);
					window.Repaint();
				}
				// * Library advance
				else if (this.jump_search && !grm.ui.displayLibrarySplit(true)) {
					lib.pop.clearSelected();
					lib.pop.sel_items = [];
					lib.pop.tree[lib.panel.pos].sel = true;
					lib.pop.setPos(lib.panel.pos);
					lib.pop.getTreeSel();
					lib.lib.treeState(false, libSet.rememberTree);
					window.Repaint();
					if (lib.panel.imgView) lib.pop.showItem(lib.panel.pos, 'focus');
					else {
						const row = (lib.panel.pos * lib.ui.row.h - lib.sbar.scroll) / lib.ui.row.h;
						if (lib.sbar.rows_drawn - row < 3 || row < 0) lib.sbar.checkScroll((lib.panel.pos + 3) * lib.ui.row.h - lib.sbar.rows_drawn * lib.ui.row.h);
					}
					if (libSet.libSource) {
						if (lib.pop.autoFill.key) lib.pop.load(lib.pop.sel_items, true, false, false, !libSet.sendToCur, false);
						lib.pop.track(lib.pop.autoFill.key);
					} else if (lib.panel.pos >= 0 && lib.panel.pos < lib.pop.tree.length) lib.pop.setPlaylistSelection(lib.panel.pos, lib.pop.tree[lib.panel.pos]);
				}
				else {
					window.Repaint();
				}
				lib.timer.clear(lib.timer.jsearch2);
				lib.timer.jsearch2.id = setTimeout(() => {
					this.jSearch = '';
					window.Repaint();
					lib.timer.jsearch2.id = null;
				}, 2200);
			}
			break;

		case !advance:
			if (utils.IsKeyPressed(VKey.TAB) || utils.IsKeyPressed(VKey.CONTROL) || utils.IsKeyPressed(VKey.ESCAPE) || utils.IsKeyPressed(VKey.MULTIPLY) || utils.IsKeyPressed(VKey.SUBTRACT)) return;
			if (!lib.panel.search.active) {
				let pos = -1;
				lib.pop.clearSelected();
				if (!this.jSearch) return;
				lib.pop.sel_items = [];
				this.jump_search = true;
				window.Repaint();
				lib.timer.clear(lib.timer.jsearch1);

				lib.timer.jsearch1.id = setTimeout(() => {
					// * First search in the Playlist
					playlistItems.Convert().some((v, i) => {
						const name = search[i].replace(/@!#.*?@!#/g, '');
						if (name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
							foundInPlaylist = true;
							pos = i;
							plman.ClearPlaylistSelection(plman.ActivePlaylist);
							plman.SetPlaylistFocusItem(plman.ActivePlaylist, pos);
							plman.SetPlaylistSelectionSingle(plman.ActivePlaylist, pos, true);
							DebugLog(`Jumpsearch: "${name}" found in Playlist`); // Debug, can remove this soon
							return true;
						}
						return false;
					});
					// * If no Playlist results found, try search query in the Library
					if (!foundInPlaylist && grSet.jumpSearchIncludeLibrary && grSet.layout !== 'compact') {
						lib.pop.tree.some((v, i) => {
							const name = v.name.replace(/@!#.*?@!#/g, '');
							if (name !== lib.panel.rootName && name.substring(0, this.jSearch.length).toLowerCase() === this.jSearch.toLowerCase()) {
								foundInPlaylist = false;
								foundInLibrary = true;
								pos = i;
								v.sel = true;
								lib.pop.setPos(pos);
								if (lib.pop.autoFill.key) lib.pop.getTreeSel();
								lib.lib.treeState(false, libSet.rememberTree);
								DebugLog(`Jumpsearch: "${name}" found in Library`); // Debug, can remove this soon
								return true;
							}
							return false;
						});
					}

					if (!foundInPlaylist && !foundInLibrary) {
						this.jump_search = false;
						DebugLog('Jumpsearch: No results were found'); // Debug, can remove this soon
					}

					window.Repaint();

					if (foundInPlaylist) {
						grm.ui.displayPlaylist = true;
						grm.ui.displayLibrary = grSet.libraryLayout === 'split' && grm.ui.displayPlaylist;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						grm.button.initButtonState();
					}
					else if (foundInLibrary && grSet.jumpSearchIncludeLibrary) {
						grm.ui.displayPlaylist = grSet.libraryLayout === 'split' && grm.ui.displayPlaylist;
						grm.ui.displayLibrary = true;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						lib.pop.showItem(pos, 'focus');
						this.jSearch = ''; // Reset to avoid conflict with other query
						grm.button.initButtonState();
					}

					lib.timer.jsearch1.id = null;
				}, 500);

				lib.timer.clear(lib.timer.jsearch2);

				lib.timer.jsearch2.id = setTimeout(() => {
					this.jSearch = '';
					window.Repaint();
					lib.timer.jsearch2.id = null;
				}, 1200);
			}
		}
	}

	/**
	 * Sets the size and position of the jump search and updates them on window resizing.
	 */
	on_size() {
		this.j.h = grSet.notificationFontSize_layout * 2;
		this.j.x = Math.round(grSet.playlistLayout === 'full' || grSet.layout !== 'default' ? grm.ui.ww * 0.5 : grm.ui.ww * 0.5 + grm.ui.ww * 0.25);
		this.j.y = Math.round((grm.ui.wh + grm.ui.topMenuHeight - grm.ui.lowerBarHeight - this.j.h) / 2);
		this.arc1 = Math.min(5, this.j.h / 2);
		this.arc2 = Math.min(4, (this.j.h - 2) / 2);
	}
	// #endregion
}


//////////////////////
// * PAUSE BUTTON * //
//////////////////////
/**
 * A class that creates a pause button on the album art when playback is being paused.
 */
class PauseButton {
	/**
	 * Creates the `PauseButton` instance.
	 */
	constructor() {
		/** @private @type {number} */
		this.xCenter = 0;
		/** @private @type {number} */
		this.yCenter = 0;
		/** @private @type {number} */
		this.top = 0;
		/** @private @type {number} */
		this.left = 0;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the pause button on the album art cover.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		const pauseBorderWidth = SCALE(2);
		const halfBorderWidth = Math.floor(pauseBorderWidth / 2);

		gr.SetSmoothingMode(SmoothingMode.AntiAlias); // Smooth edges

		gr.FillRoundRect(this.left, this.top, grm.ui.pauseSize, grm.ui.pauseSize,
			0.1 * grm.ui.pauseSize, 0.1 * grm.ui.pauseSize, RGBA(0, 0, 0, 150));
		gr.DrawRoundRect(this.left + halfBorderWidth, this.top + halfBorderWidth, grm.ui.pauseSize - pauseBorderWidth, grm.ui.pauseSize - pauseBorderWidth,
			0.1 * grm.ui.pauseSize, 0.1 * grm.ui.pauseSize, pauseBorderWidth, RGBA(128, 128, 128, 60));
		gr.FillRoundRect(this.left + 0.26 * grm.ui.pauseSize, this.top + 0.25 * grm.ui.pauseSize,
			0.12 * grm.ui.pauseSize, 0.5 * grm.ui.pauseSize, 2, 2, RGBA(255, 255, 255, 160));
		gr.FillRoundRect(this.left + 0.62 * grm.ui.pauseSize, this.top + 0.25 * grm.ui.pauseSize,
			0.12 * grm.ui.pauseSize, 0.5 * grm.ui.pauseSize, 2, 2, RGBA(255, 255, 255, 160));
	}

	/**
	 * Sets the coordinates of the center point of the pause button.
	 * @param {number} xCenter - The centered x-coordinate.
	 * @param {number} yCenter - The centered y-coordinate.
	 */
	setCoords(xCenter, yCenter) {
		this.xCenter = xCenter;
		this.yCenter = yCenter;
		this.top = Math.round(this.yCenter - grm.ui.pauseSize / 2);
		this.left = Math.round(this.xCenter - grm.ui.pauseSize / 2);
	}

	/**
	 * Updates the pause button state.
	 */
	repaint() {
		if (grm.ui.displayLyrics && grSet.lyricsLayout !== 'normal') {
			window.RepaintRect(grm.ui.albumArtSize.x - 1, grm.ui.albumArtSize.y - 1, grm.ui.albumArtSize.w + 2, grm.ui.albumArtSize.h + 2);
		} else {
			window.RepaintRect(this.left - 1, this.top - 1, grm.ui.pauseSize + 2, grm.ui.pauseSize + 2);
		}
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of the pause button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return (x >= this.left && y >= this.top && x < this.left + grm.ui.pauseSize + 1 && y <= this.top + grm.ui.pauseSize + 1);
	}
	// #endregion
}


///////////////////////
// * VOLUME BUTTON * //
///////////////////////
/**
 * A class that creates and manages basic volume controls.
 */
class Volume {
	/**
	 * Creates the `Volume` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 */
	constructor(x, y, w, h) {
		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = w;
		/** @public @type {number} */
		this.h = h;
		/** @private @type {number} */
		this.mx = 0;
		/** @private @type {number} */
		this.my = 0;
		/** @private @type {number} */
		this.clickX = 0;
		/** @private @type {number} */
		this.clickY = 0;
		/** @private @type {boolean} */
		this.drag = false;
		/** @private @type {number} */
		this.dragVol = 0;
		/** @private @type {TooltipHandler} */
		this.tooltipHandler = new TooltipHandler();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Displays the volume bar tooltip.
	 */
	displayTooltip() {
		const volTooltip = grSet.showTooltipVolumeInPercent ? `${Math.ceil(ConvertVolume(fb.Volume, 'toPercent'))} %` : `${Math.ceil(fb.Volume.toFixed(2))} dB`;
		this.tooltipHandler.showImmediate(volTooltip);
	}

	/**
	 * Calculates the size of the fill portion of the volume bar based on current volume.
	 * @param {string} type - Either 'h' or 'w' for vertical or horizontal volume bars.
	 * @returns {number} The calculated size based on the type parameter.
	 */
	fillSize(type) {
		return Math.ceil((type === 'w' ? this.w : this.h) * (10 ** (fb.Volume / 50) - 0.01) / 0.99);
	}

	/**
	 * Checks if the given coordinates are within the boundaries of the volume button on left mouse down click.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	lbtnDown(x, y) {
		if (this.trace(x, y)) {
			this.clickX = x;
			this.clickY = y;
			this.move(x, y); // Force volume to update without needing to move or release lbtn
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Checks if the left mouse click is within the boundaries of the volume bar and adjusts the volume accordingly.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	lbtnUp(x, y) {
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

	/**
	 * Releases volume drag when mouse is out of the boundaries of the volume bar.
	 */
	leave() {
		this.drag = false;
	}

	/**
	 * Handles mouse move events on the volume bar, i.e when dragging the bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	move(x, y) {
		this.mx = x;
		this.my = y;

		if (this.clickX && this.clickY && (this.clickX !== x || this.clickY !== y)) {
			this.drag = true;
		}

		if (this.trace(x, y) || this.drag) {
			if (this.drag) {
				x -= this.x;
				const pos = x > this.w ? 1 : x / this.w;
				this.dragVol = ConvertVolume(pos, 'toDecibel');
				fb.Volume = this.dragVol;
			}
			if (grSet.showTooltipVolume) {
				this.displayTooltip();
			}
			return true;
		}

		this.drag = false;
		if (grSet.showTooltipVolume) {
			this.tooltipHandler.stop();
		}
		return false;
	}

	/**
	 * Checks if the mouse is within the boundaries of the volume bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		const margin = 5; // The area the mouse can go outside physical bounds of the volume control
		return x > this.x - margin && x < this.x + this.w + margin && y > this.y - margin && y < this.y + this.h + margin;
	}

	/**
	 * Handles mouse wheel events and adjusts the volume.
	 * @param {number} scrollAmt - The amount of scrolling that has occurred.
	 * @returns {boolean} True if the mouse is over the component and the volume was adjusted, false otherwise.
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
	// #endregion
}


/**
 * A class that creates the volume button in the lower bar next to its playback transport buttons.
 */
class VolumeButton {
	/**
	 * Creates the `Volume` instance.
	 */
	constructor() {
		/** @public @type {number} */
		this.x = 0;
		/** @public @type {number} */
		this.y = 0;
		/** @public @type {number} */
		this.w = SCALE(100);
		/** @public @type {number} */
		this.h = SCALE(12);

		/** @private @type {number} */
		this.inThisPadding = this.w * 0.5;

		// * Runtime state
		/** @private @type {boolean} */
		this.mouseInVolumeBar = false;
		/** @private @type {boolean} */
		this.displayVolumeBar = !grSet.autoHideVolumeBar;

		// * Objects
		/** @private @type {Volume} */
		this.volumeBar = undefined;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the volume bar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (!this.displayVolumeBar) return;

		const { x, y, w, h } = this;
		const p = 2;
		const fillWidth = this.volumeBar && this.volumeBar.fillSize('w');
		const arcBg = SCALE(6);
		const arcFill = SCALE(3);

		gr.SetSmoothingMode(grSet.styleVolumeBarDesign === 'rounded' ? SmoothingMode.AntiAlias : SmoothingMode.None);

		// * Default background
		if (grSet.styleVolumeBarDesign === 'rounded' && grSet.styleTransportButtons !== 'minimal') {
			FillRoundRect(gr, x - SCALE(2), y + HD_4K(p, p + 1), w + SCALE(2), h, arcBg, arcBg, grCol.volumeBar);
			DrawRoundRect(gr, x - HD_4K(this.showReloadBtn ? 3 : 2, 5), y + SCALE(1), w + HD_4K(3, 5), h + 2, arcBg, arcBg, 1, grCol.volumeBarFrame);
		}
		else if (grSet.styleVolumeBarDesign !== 'rounded' && grSet.styleTransportButtons !== 'minimal') {
			gr.FillSolidRect(x - SCALE(2), y + HD_4K(p, p + 1), w + SCALE(2), h, grCol.volumeBar);
			gr.DrawRect(x - HD_4K(this.showReloadBtn ? 3 : 2, 5), y + SCALE(1), w + HD_4K(3, 5), h + 1, 1, grCol.volumeBarFrame);
		}
		// * Style background
		if ((grSet.styleVolumeBar === 'bevel' || grSet.styleVolumeBar === 'inner') && grSet.styleTransportButtons !== 'minimal') {
			if (grSet.styleVolumeBarDesign === 'rounded') {
				FillGradRoundRect(gr, x - SCALE(2), y + HD_4K(p, p + 1) - (grSet.styleVolumeBar === 'inner' ? 1 : 0), w + SCALE(5), h + SCALE(4), arcBg, arcBg,
				grSet.styleVolumeBar === 'inner' ? -89 : 89, grSet.styleVolumeBar === 'inner' ? grCol.styleVolumeBar : 0, grSet.styleVolumeBar === 'inner' ? 0 : grCol.styleVolumeBar, grSet.styleVolumeBar === 'inner' ? 0 : 1);
			} else {
				gr.FillGradRect(x - SCALE(2), y + HD_4K(p, p + (grSet.styleVolumeBar === 'inner' ? 0 : 2)), w + SCALE(2), h, grSet.styleVolumeBar === 'inner' ? -90 : 90, 0, grCol.styleVolumeBar);
			}
		}
		// * Default fill
		if (grSet.styleVolumeBarDesign === 'rounded') {
			FillRoundRect(gr, x + 1, y + HD_4K(4, 7), fillWidth - SCALE(3), h - SCALE(4), arcFill, arcFill, grCol.volumeBarFill);
		} else {
			gr.FillSolidRect(x, y + HD_4K(4, 7), fillWidth - SCALE(2), h - SCALE(4), grCol.volumeBarFill);
		}
		// * Style fill
		if ((grSet.styleVolumeBarFill === 'bevel' || grSet.styleVolumeBarFill === 'inner')) {
			if (grSet.styleVolumeBarDesign === 'rounded') {
				FillGradRoundRect(gr, x + 1, y + HD_4K(4, 7), fillWidth - SCALE(0.5), h - SCALE(2), arcFill, arcFill, grSet.styleVolumeBarFill === 'inner' ? -89 : 89, 0, grCol.styleVolumeBarFill, 1);
			} else {
				gr.FillGradRect(x, y + HD_4K(4, 7), fillWidth - SCALE(2), h - SCALE(3), grSet.styleVolumeBarFill === 'inner' ? -90 : 90, grSet.styleBlackAndWhite ? grCol.styleVolumeBarFill : 0, grSet.styleBlackAndWhite ? 0 : grCol.styleVolumeBarFill);
			}
		}
	}

	/**
	 * Sets the metrics for the volume bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	setMetrics(x, y) {
		const buttonSize = SCALE(grSet.transportButtonSize_layout);
		const center = Math.floor(buttonSize / 2 + SCALE(4));
		const volumeBarWidth = Math.ceil((grm.ui.ww - grm.ui.lowerBarTotalBtnW) / 2 - SCALE(40));

		this.x = x + (grSet.transportButtonSize_layout * SCALE(1.25));
		this.y = y + (center - this.h);
		this.w = grm.ui.ww < SCALE(600) ? volumeBarWidth : SCALE(100);
		this.h = Math.min(grm.ui.wh - this.y, this.h);

		this.volumeBar = new Volume(this.x, this.y, this.w, this.h);
	}

	/**
	 * Shows or hides the volume bar and stops a tooltip if it is shown.
	 * @param {boolean} show - Whether to show or hide the volume bar.
	 */
	showVolumeBar(show) {
		if (!this.volumeBar) return;

		this.displayVolumeBar = show;
		this.repaint();
		if (show) this.volumeBar.tooltipHandler.stop();
	}

	/**
	 * Toggles the display state of the volume bar.
	 */
	toggleVolumeBar() {
		this.showVolumeBar(!this.displayVolumeBar);
	}

	/**
	 * Updates the volume bar state.
	 */
	repaint() {
		if (!this.volumeBar) return;

		const xyPadding = SCALE(3);
		const whPadding = xyPadding * 2;
		window.RepaintRect(this.x - xyPadding, this.volumeBar.y, this.volumeBar.w + whPadding, this.volumeBar.h + whPadding);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of the volume button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x > this.x - this.inThisPadding && x <= this.x + this.w + this.inThisPadding &&
			   y > this.y - this.h - this.inThisPadding * 0.2 && y <= this.y - this.h + this.inThisPadding;
	}

	/**
	 * Handles left mouse button down click events and calls the lbtnDown method.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (!this.volumeBar) return false;

		if (this.displayVolumeBar) {
			return this.volumeBar.lbtnDown(x, y);
		}

		return false;
	}

	/**
	 * Handles left mouse button up click events and calls the lbtnUp method.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (!this.volumeBar) return false;

		if (!grSet.lockPlayerSize) grm.utils.enableSizing(m);

		if (this.displayVolumeBar) {
			return this.volumeBar.lbtnUp(x, y);
		}

		return false;
	}

	/**
	 * Handles mouse leave events and performs actions such as hiding the volume bar if necessary.
	 */
	on_mouse_leave() {
		if (!this.volumeBar || this.volumeBar.drag) return;

		this.mouseInVolumeBar = false;

		if (this.displayVolumeBar && grSet.autoHideVolumeBar) {
			this.showVolumeBar(false);
			this.repaint();
		}

		if (grSet.autoHideVolumeBar) {
			this.volumeBar.leave();
		}
	}

	/**
	 * Handles mouse movement events and performs actions related to the volume bar display.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		if (!this.volumeBar || !this.displayVolumeBar) return;

		grm.utils.disableSizing(m);

		this.mouseInVolumeBar = this.volumeBar.trace(x, y);

		if (this.volumeBar.drag || this.mouseInThis(x, y)) {
			this.volumeBar.move(x, y);
			return;
		}

		if (grSet.autoHideVolumeBar) {
			this.showVolumeBar(false);
			this.repaint();
		}
	}

	/**
	 * Handles mouse wheel events and controls the volume on the volume bar.
	 * @param {number} step - The wheel scroll direction.
	 * @returns {boolean} True or false.
	 */
	on_mouse_wheel(step) {
		if (!this.mouseInVolumeBar) return false;

		if (this.displayVolumeBar && this.volumeBar.wheel(step)) return true;

		if (step > 0) {
			fb.VolumeUp();
		} else {
			fb.VolumeDown();
		}

		return true;
	}

	/**
	 * Updates the volume bar and displays a tooltip with the current volume in either percentage or decibels.
	 * @param {number} val - The new volume value that triggered the update.
	 */
	on_volume_change(val) {
		if (grSet.showTooltipVolume) {
			this.volumeBar.displayTooltip();
		}

		if (this.displayVolumeBar) {
			this.repaint();
		}
	}
	// #endregion
}


//////////////////////
// * PROGRESS BAR * //
//////////////////////
/**
 * A class that creates the progress bar in the lower bar when enabled.
 * Quick access via right click context menu on lower bar.
 */
class ProgressBar {
	/**
	 * Creates the `ProgressBar` instance.
	 */
	constructor() {
		/** @public @type {number} The x-coordinate of the progress bar. */
		this.x = grm.ui.edgeMargin;
		/** @public @type {number} The y-coordinate of the progress bar. */
		this.y = 0;
		/** @public @type {number} The width of the progress bar. */
		this.w = grm.ui.ww - grm.ui.edgeMarginBoth;
		/** @public @type {number} The height of the progress bar. */
		this.h = grm.ui.seekbarHeight;
		/** @public @type {number} The arc radius for rounded corners of the progress bar. */
		this.arc = Math.min(this.w, this.h) / 2;
		/** @public @type {number} The length of the progress bar fill. */
		this.progressLength = 0;
		/** @private @type {boolean} The state that indicates if the progress bar is being dragged. */
		this.drag = false;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the progress bar with various progress bar styles.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (grm.ui.showDrawExtendedTiming) grm.ui.seekbarProfiler.Reset();

		const styleRounded = grSet.styleProgressBarDesign === 'rounded';
		if (styleRounded) this.arc = Math.min(this.w, this.h) / 2;

		gr.SetSmoothingMode(styleRounded ? SmoothingMode.AntiAlias : SmoothingMode.None);

		this.drawProgressBarBg(gr);
		this.drawProgressBarFill(gr);
	}

	/**
	 * Draws the progress bar background.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawProgressBarBg(gr) {
		const barDesignNoDotsThin = !['dots', 'thin'].includes(grSet.styleProgressBarDesign);
		const styleRounded = grSet.styleProgressBarDesign === 'rounded';
		const styleDefault = grSet.styleDefault && (['blue', 'darkblue', 'red', 'cream'].includes(grSet.theme) || grSet.theme.startsWith('custom'));
		const styleCream = grSet.theme === 'cream' && (grSet.styleAlternative || grSet.styleAlternative2) && (!grSet.styleBevel && !grSet.styleBlend && !grSet.styleBlend2 && grSet.styleProgressBarDesign !== 'rounded') && !grSet.systemFirstLaunch;
		const styleBevelOrInner = barDesignNoDotsThin && ['bevel', 'inner'].includes(grSet.styleProgressBar);
		const progressBarColor = grm.ui.isStreaming && fb.IsPlaying ? grCol.progressBarStreaming : grCol.progressBar;

		if (styleRounded) {
			FillRoundRect(gr, this.x, this.y, this.w, this.h, this.arc, this.arc, progressBarColor);
		} else if (barDesignNoDotsThin) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, progressBarColor);
		}

		if (styleDefault || styleCream) {
			gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, grCol.progressBarFrame);
		}

		if (styleBevelOrInner) {
			const styleBlackReborn = grSet.styleBlackReborn && fb.IsPlaying;
			const angle = grSet.styleProgressBar === 'inner' ? (styleBlackReborn ? 90 : -90) : (styleBlackReborn ? -90 : 90);

			if (styleRounded) {
				FillGradRoundRect(gr, this.x, this.y, this.w + SCALE(2), this.h + SCALE(2.5), this.arc, this.arc, angle, 0, grCol.styleProgressBar, 1);

				const xLeft = this.x + SCALE(3);
				const xRight = this.w + this.x - SCALE(12);
				const yTop = this.y - 0.5;
				const yBottom = this.y + this.h - 0.5;
				gr.FillGradRect(xLeft, yTop, SCALE(9), 1, 179, grCol.styleProgressBarLineTop, 0); // Top left
				gr.FillGradRect(xLeft, yBottom, SCALE(9), 1, 179, grCol.styleProgressBarLineBottom, 0); // Bottom left
				gr.FillGradRect(xRight, yTop, SCALE(9), 1, 179, 0, grCol.styleProgressBarLineTop); // Top right
				gr.FillGradRect(xRight, yBottom, SCALE(9), 1, 179, 0, grCol.styleProgressBarLineBottom); // Bottom right
			}
			else {
				gr.FillGradRect(this.x, this.y, this.w, this.h, angle, 0, grCol.styleProgressBar);
			}

			const lineX1 = this.x + (styleRounded ? SCALE(12) : 0);
			const lineX2 = this.x + this.w - (styleRounded ? SCALE(12) : 1);
			gr.DrawLine(lineX1, this.y, lineX2, this.y, 1, grCol.styleProgressBarLineTop);
			gr.DrawLine(lineX1, this.y + this.h, lineX2, this.y + this.h, 1, grCol.styleProgressBarLineBottom);
		}
	}

	/**
	 * Draws the progress bar fill.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawProgressBarFill(gr) {
		if (!fb.PlaybackLength && !fb.IsPlaying) return;

		const playbackRatio = fb.PlaybackTime / fb.PlaybackLength;
		this.progressLength = Math.floor(this.w * playbackRatio);
		if (!this.progressLength) return;

		const drawBarDesign = {
			default: () => gr.FillSolidRect(this.x, this.y, this.progressLength, this.h, grCol.progressBarFill),
			rounded: () => FillRoundRect(gr, this.x, this.y, this.progressLength, this.h, this.arc, this.arc, grCol.progressBarFill),
			lines:   () => this.drawBarDesignLines(gr),
			blocks:  () => this.drawBarDesignBlocks(gr),
			dots:    () => this.drawBarDesignDots(gr),
			thin:    () => this.drawBarDesignThin(gr)
		};

		drawBarDesign[grSet.styleProgressBarDesign]();

		if (!['dots', 'thin'].includes(grSet.styleProgressBarDesign) && ['bevel', 'inner'].includes(grSet.styleProgressBarFill)) {
			if (grSet.styleProgressBarDesign === 'rounded') {
				FillGradRoundRect(gr, this.x, this.y, this.progressLength + SCALE(2), this.h + SCALE(2.5), this.arc, this.arc, grSet.styleProgressBarFill === 'inner' ? -88 : 88, grCol.styleProgressBarFill, 0);
			} else {
				gr.FillGradRect(this.x, this.y, this.progressLength, this.h, grSet.styleProgressBarFill === 'inner' ? -90 : 89, 0, grCol.styleProgressBarFill);
			}
		}
		else if (grSet.styleProgressBarFill === 'blend' && grm.ui.albumArt && grCol.imgBlended) {
			if (grSet.styleProgressBarDesign === 'rounded') {
				FillBlendedRoundRect(gr, this.x, this.y, this.progressLength + SCALE(2), this.h + SCALE(2.5), this.arc, this.arc, 88, grCol.imgBlended, 0);
			} else {
				gr.DrawImage(grCol.imgBlended, this.x, this.y, this.progressLength, this.h, 0, this.h, grCol.imgBlended.Width, grCol.imgBlended.Height);
			}
		}
	}

	/**
	 * Draws the progress bar fill in lines design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignLines(gr) {
		gr.FillSolidRect(this.x + this.progressLength, this.y, SCALE(2), grm.ui.seekbarHeight, grCol.progressBarFill);

		for (let progressLine = 0; progressLine < this.progressLength; progressLine += SCALE(4)) {
			gr.DrawLine(this.x + progressLine + SCALE(2), this.y, this.x + progressLine + SCALE(2), this.y + this.h, SCALE(2), grCol.progressBarFill);
		}
	}

	/**
	 * Draws the progress bar fill in blocks design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignBlocks(gr) {
		for (let progressLine = 0; progressLine < this.progressLength; progressLine += grm.ui.seekbarHeight + SCALE(2)) {
			gr.FillSolidRect(this.x + progressLine, this.y + SCALE(2), grm.ui.seekbarHeight, grm.ui.seekbarHeight - SCALE(4), grCol.progressBarFill);
		}

		gr.FillSolidRect(this.x + this.progressLength, this.y + 1, grm.ui.seekbarHeight, grm.ui.seekbarHeight - 1, grCol.progressBar);
		gr.FillGradRect(this.x + this.progressLength, this.y + 1, grm.ui.seekbarHeight, grm.ui.seekbarHeight - 1, grSet.styleProgressBar === 'inner' ? grSet.styleBlackReborn && fb.IsPlaying ? 88 : -88 : grSet.styleBlackReborn && fb.IsPlaying ? -88 : 88, 0, grCol.styleProgressBar);
	}

	/**
	 * Draws the progress bar fill in dots design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignDots(gr) {
		for (let progressLine = 0; progressLine < this.progressLength; progressLine += SCALE(8)) {
			gr.DrawLine(this.x + this.progressLength + SCALE(10), this.y + this.h * 0.5, this.x + this.w, this.y + this.h * 0.5, SCALE(1), grCol.progressBar);
			gr.SetSmoothingMode(SmoothingMode.AntiAlias);
			gr.DrawEllipse(this.x + progressLine, this.y + this.h * 0.5 - SCALE(1), SCALE(2), SCALE(2), SCALE(2), grCol.progressBarFill);
		}

		const posFix = HD_4K(3, grSet.layout !== 'default' ? 6 : 7);
		gr.DrawEllipse(this.x + this.progressLength, this.y + this.h * 0.5 - grm.ui.seekbarHeight * 0.5 + SCALE(2), grm.ui.seekbarHeight - SCALE(4), grm.ui.seekbarHeight - SCALE(4), SCALE(2), grCol.progressBarFill); // Knob outline
		gr.DrawEllipse(this.x + this.progressLength + posFix, this.y + this.h * 0.5 - SCALE(1), SCALE(2), SCALE(2), SCALE(2), grCol.transportIconHovered); // Knob inner
	}

	/**
	 * Draws the progress bar fill in thin design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignThin(gr) {
		gr.DrawLine(this.x, this.y + this.h * 0.5, this.x + this.w, this.y + this.h * 0.5, SCALE(1), grCol.progressBar);
		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
		gr.FillSolidRect(this.x, this.y + this.h * 0.5 - SCALE(2), this.progressLength, SCALE(4), grCol.progressBarFill);
		gr.FillSolidRect(this.x + this.progressLength, this.y + this.h * 0.5 - SCALE(3), SCALE(6), SCALE(6), grCol.progressBarFill);
	}

	/**
	 * Sets the vertical progress bar position.
	 * @param {number} y - The y-coordinate.
	 */
	setY(y) {
		this.y = y;
	}

	/**
	 * Sets the playback time of the progress bar.
	 * @param {number} x - The x-coordinate.
	 * @private
	 */
	setPlaybackTime(x) {
		const clampedPosition = Clamp((x - this.x) / this.w, 0, 1);
		const newPlaybackTime = clampedPosition * fb.PlaybackLength;
		if (fb.PlaybackTime !== newPlaybackTime) {
			fb.PlaybackTime = newPlaybackTime;
		}
	}

	/**
	 * Sets the refresh rate for the progress bar.
	 */
	setRefreshRate() {
		if (grm.ui.isStreaming) {
			grm.ui.seekbarTimerInterval = FPS._1;
		}
		else if (grSet.progressBarRefreshRate !== 'variable') {
			grm.ui.seekbarTimerInterval = grSet.progressBarRefreshRate;
		}
		else {
			const pixelsPerMillisecond = (grm.ui.ww - grm.ui.edgeMarginBoth) / fb.PlaybackLength;
			const FPS_VARIABLE = Math.ceil(1000 / pixelsPerMillisecond);
			grm.ui.seekbarTimerInterval = Clamp(FPS_VARIABLE, FPS._15, FPS._2);
		}
	}

	/**
	 * Updates the progress bar state.
	 */
	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of the progress bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
	}

	/**
	 * Handles left mouse button down click events and enables dragging.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_down(x, y) {
		this.drag = true;
	}

	/**
	 * Handles left mouse button up click events and disables dragging and updates the playback time.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_up(x, y) {
		this.drag = false;
		if (this.mouseInThis(x, y)) {
			this.setPlaybackTime(x);
		}
	}

	/**
	 * Handles mouse movement events and updates the playback time based on the mouse movement if a drag event is occurring.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_move(x, y) {
		if (this.drag) {
			this.setPlaybackTime(x);
		}
	}

	/**
	 * Updates progress bar length when playing a new track.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	on_playback_new_track(metadb) {
		if (!metadb) return;
		this.progressLength = 0;
	}

	/**
	 * Sets the size and position of the progress bar and updates them on window resizing.
	 * @param {number} w - The width of the window or element.
	 * @param {number} h - The height of the window or element.
	 */
	on_size(w, h) {
		this.x = grm.ui.edgeMargin;
		this.y = 0;
		this.w = w - grm.ui.edgeMarginBoth;
		this.h = grm.ui.seekbarHeight;
	}
	// #endregion
}


///////////////////////
// * PEAKMETER BAR * //
///////////////////////
/**
 * A class that creates the peakmeter bar in the lower bar when enabled.
 * Quick access via right click context menu on lower bar.
 */
class PeakmeterBar {
	/**
	 * Creates the `PeakmeterBar` instance.
	 */
	constructor() {
		// * GEOMETRY - STYLE HORIZONTAL * //
		// #region GEOMETRY - STYLE HORIZONTAL
		/** @public @type {number} The x-position of the peakmeter bar. */
		this.x = grm.ui.edgeMargin;
		/** @public @type {number} The y-position of the peakmeter bar. */
		this.y = 0;
		/** @public @type {number} The width of the peakmeter bar. */
		this.w = grm.ui.ww - grm.ui.edgeMarginBoth;
		/** @public @type {number} The secondary width of the peakmeter bar. */
		this.w2 = 0;
		/** @public @type {number} The height of the peakmeter bar. */
		this.h = grm.ui.seekbarHeight;
		/** @private @type {number} The height of the bar for the peakmeter. */
		this.bar_h = grSet.layout !== 'default' ? SCALE(2) : SCALE(4);
		/** @private @type {number} The half height of the bar for the peakmeter. */
		this.bar2_h = this.bar_h * 0.5;
		/** @private @type {number} The offset for the peakmeter bar. */
		this.offset = 0;
		/** @private @type {number} The middle offset for the peakmeter bar. */
		this.middleOffset = 0;
		/** @private @type {number} The middle width for the peakmeter bar. */
		this.middle_w = 0;

		// * Top
		/** @private @type {number} The width of the outer left bar. */
		this.outerLeft_w = 0;
		/** @private @type {number} The old width of the outer left bar. */
		this.outerLeft_w_old = 0;
		/** @private @type {number} The animated width of the outer left bar. */
		this.outerLeftAnim_w = 0;
		/** @private @type {number} The x-position of the animated outer left bar. */
		this.outerLeftAnim_x = 0;
		/** @private @type {number} The offset for the outer left bar. */
		this.outerLeft_k = 0;

		/** @private @type {number} The x-position of the main left bar. */
		this.mainLeft_x = 0;
		/** @private @type {number} The x-position of the animated main left bar. */
		this.mainLeftAnim_x = 0;
		/** @private @type {number} The secondary x-position of the animated main left bar. */
		this.mainLeftAnim2_x = 0;
		/** @private @type {number} The offset for the main left bar. */
		this.mainLeft_k = 0;
		/** @private @type {number} The secondary offset for the main left bar. */
		this.mainLeft2_k = 0;

		// * Bottom
		/** @private @type {number} The width of the outer right bar. */
		this.outerRight_w = 0;
		/** @private @type {number} The old width of the outer right bar. */
		this.outerRight_w_old = 0;
		/** @private @type {number} The animated width of the outer right bar. */
		this.outerRightAnim_w = 0;
		/** @private @type {number} The x-position of the animated outer right bar. */
		this.outerRightAnim_x = 0;
		/** @private @type {number} The offset for the outer right bar. */
		this.outerRight_k = 0;

		/** @private @type {number} The x-position of the main right bar. */
		this.mainRight_x = 0;
		/** @private @type {number} The x-position of the animated main right bar. */
		this.mainRightAnim_x = 0;
		/** @private @type {number} The secondary x-position of the animated main right bar. */
		this.mainRightAnim2_x = 0;
		/** @private @type {number} The offset for the main right bar. */
		this.mainRight_k = 0;
		/** @private @type {number} The secondary offset for the main right bar. */
		this.mainRight2_k = 0;
		// #endregion

		// * GEOMETRY - STYLE VERTICAL * //
		// #region GEOMETRY - STYLE VERTICAL
		/** @private @type {number} The vertical offset for the bar. */
		this.vertBar_offset = 0;
		/** @private @type {number} The vertical width of the bar. */
		this.vertBar_w = 0;
		/** @private @type {number} The vertical height of the bar. */
		this.vertBar_h = 0;
		/** @private @type {number} The x-coordinate for the left vertical bar. */
		this.vertLeft_x = 0;
		/** @private @type {number} The x-coordinate for the right vertical bar. */
		this.vertRight_x = 0;
		// #endregion

		// * PROGRESS BAR * //
		// #region PROGRESS BAR
		/** @public @type {number} The length of the progress bar. */
		this.progressLength = 0;
		/** @private @type {boolean} The state indicating whether the progress bar is being dragged. */
		this.drag = false;
		// #endregion

		// * MOUSE EVENTS * //
		// #region MOUSE EVENTS
		/** @private @type {number} The x-coordinate position of the mouse. */
		this.pos_x = 0;
		/** @private @type {number} The y-coordinate position of the mouse. */
		this.pos_y = 0;
		/** @private @type {boolean} The state indicating whether the mouse is over the peakmeter bar. */
		this.on_mouse = false;
		/** @private @type {boolean} The state indicating whether the mouse wheel is being used. */
		this.wheel = false;
		// #endregion

		// * TEXT * //
		// #region TEXT
		/** @private @type {GdiFont} The font used for text rendering. */
		this.textFont = gdi.Font('Segoe UI', HD_4K(9, 16), 1);
		/** @private @type {number} The width of the text. */
		this.textWidth = 0;
		/** @private @type {number} The height of the text. */
		this.textHeight = 0;
		/** @private @type {string} The text for the tooltip. */
		this.tooltipText = '';
		/** @private @type {number} The timer for the tooltip. */
		this.tooltipTimer = null;
		// #endregion

		// * VOLUME * //
		// #region VOLUME
		/** @private @type {number[]} The middle decibel values. */
		this.db_middle = [];
		/** @private @type {number[]} The current decibel values. */
		this.db = [];
		/** @private @type {object[]} The vertical decibel values. */
		this.db_vert = {};

		/** @private @type {number} The middle points for the peakmeter. */
		this.points_middle = 0;
		/** @private @type {number} The points for the peakmeter. */
		this.points = 0;
		/** @private @type {number} The vertical points for the peakmeter. */
		this.points_vert = 0;
		/** @private @type {number[]} The left peaks for the peakmeter. */
		this.leftPeaks_s = [];
		/** @private @type {number[]} The right peaks for the peakmeter. */
		this.rightPeaks_s = [];
		// #endregion

		// * COLORS * //
		// #region COLORS
		/** @private @type {number} The separator index for the peakmeter. */
		this.separator = 0;
		/** @private @type {number} The first separator value for the peakmeter. */
		this.sep1 = 0;
		/** @private @type {number} The second separator value for the peakmeter. */
		this.sep2 = 0;
		// #endregion

		// * INITIALIZATION * //
		// #region INITIALIZATION
		grm.ui.seekbarTimerInterval = grSet.peakmeterBarRefreshRate === 'variable' ? FPS._10 : grSet.peakmeterBarRefreshRate;
		this.VUMeter = Component.VUMeter ? new ActiveXObject('VUMeter') : null;
		this.initDecibel();
		this.initPeaks();
		this.initPoints();
		this.initSeparator();
		this.setColors();
		// #endregion
	}

	// * PUBLIC METHODS - DRAW * //
	// #region PUBLIC METHODS - DRAW
	/**
	 * Draws the peakmeter bar in various peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (!fb.IsPlaying || !this.VUMeter) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, grCol.bg);
			gr.FillSolidRect(this.x, grm.ui.seekbarY, this.w, SCALE(grSet.layout !== 'default' ? 10 : 12), grCol.progressBar);
			return;
		}

		if (grSet.peakmeterBarRefreshRate === 'variable' || grm.ui.showDrawExtendedTiming) {
			grm.ui.seekbarProfiler.Reset();
		}

		this.drawPeakmeterBar(gr);
		this.setAnimation();
		this.setRefreshRate();
	}

	/**
	 * Draws the peakmeter bar design based on design setting.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawPeakmeterBar(gr) {
		const drawBarDesign = {
			horizontal:        () => this.drawBarDesignHorizontal(gr),
			horizontal_center: () => this.drawBarDesignCenter(gr),
			vertical:          () => this.drawBarDesignVertical(gr)
		};

		drawBarDesign[grSet.peakmeterBarDesign]();
	}

	/**
	 * Draws the horizontal peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignHorizontal(gr) {
		this.drawBarGrid(gr);

		for (let i = 0; i <= this.points; i++) {
			const color = this.color[i];
			const db = this.db[i];
			const dbNext = this.db[i + 1];
			const offset = i * this.offset;

			this.drawHorizontalMainBars(gr, db, dbNext, offset, this.leftPeak, this.mainLeftAnim_x, this.mainLeftAnim2_x, 'mainLeft_x', this.mainLeft_y, color);
			this.drawHorizontalMainBars(gr, db, dbNext, offset, this.rightPeak, this.mainRightAnim_x, this.mainRightAnim2_x, 'mainRight_x', this.mainRight_y, color);

			this.drawHorizontalOuterBars(gr, db, dbNext, offset, this.leftLevel, this.outerLeftAnim_x, this.outerLeftAnim_w, this.outerLeft_y, 'outerLeft_w');
			this.drawHorizontalOuterBars(gr, db, dbNext, offset, this.rightLevel, this.outerRightAnim_x, this.outerRightAnim_w, this.outerRight_y, 'outerRight_w');

			this.drawOverBars(gr);
		}

		this.drawMiddleBars(gr);
		this.drawProgressBar(gr);
		this.drawBarInfo(gr);
	}

	/**
	 * Draws the main bars in the horizontal peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} db - The current decibel level.
	 * @param {number} dbNext - The next decibel level.
	 * @param {number} offset - The offset for drawing.
	 * @param {number} peak - The peak value.
	 * @param {number} anim_x - The animation x-coordinate.
	 * @param {number} anim2_x - The second animation x-coordinate.
	 * @param {string} main_x - The main x-coordinate property key name.
	 * @param {number} main_y - The main y-coordinate.
	 * @param {number} color - The color of the bar.
	 * @private
	 */
	drawHorizontalMainBars(gr, db, dbNext, offset, peak, anim_x, anim2_x, main_x, main_y, color) {
		if (peak <= db) return;

		if (peak < dbNext) this[main_x] = offset;

		if (grSet.peakmeterBarMainBars) {
			gr.FillSolidRect(this.x + offset, main_y, this.w2, this.bar_h, color);
		}

		if (grSet.peakmeterBarMainPeaks) {
			const color = this.color[Math.round(this.mainLeftAnim_x / this.offset)];
			gr.FillSolidRect(this.x + anim_x + this.offset, main_y, this.w2 * 0.66, this.bar_h, color);

			const x = Clamp(this.x + anim2_x + this.offset + this.w2 * 0.66, this.x, this.x + this.w - this.w2 * 0.33);
			const w = x > this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33;
			gr.FillSolidRect(x, main_y, w, this.bar_h, color);
		}
	}

	/**
	 * Draws the outer bars in the horizontal peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} db - The current decibel level.
	 * @param {number} dbNext - The next decibel level.
	 * @param {number} offset - The offset for drawing.
	 * @param {number} level - The level value.
	 * @param {number} anim_x - The animation x-coordinate.
	 * @param {number} anim_w - The animation width.
	 * @param {number} outer_y - The outer y-coordinate.
	 * @param {string} outer_w - The outer width property key name.
	 * @private
	 */
	drawHorizontalOuterBars(gr, db, dbNext, offset, level, anim_x, anim_w, outer_y, outer_w) {
		if (level <= db) return;

		if (level < dbNext) {
			this[outer_w] = offset + this.offset / Math.abs(dbNext - db) * Math.abs(level - db) - this.x;
		}

		if (grSet.peakmeterBarOuterBars) {
			gr.FillSolidRect(this.x, outer_y, this[outer_w], this.bar_h, this.color[1]);
		}

		if (grSet.peakmeterBarOuterPeaks) {
			const x = Clamp(this.x + anim_x, this.x, this.x + this.w - anim_w);
			gr.FillSolidRect(x, outer_y, anim_w <= 0 ? 2 : anim_w, this.bar_h, this.color[1]);
		}
	}

	/**
	 * Draws the horizontal center peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignCenter(gr) {
		this.drawBarGrid(gr);

		for (let i = 0; i <= this.points; i++) {
			const color = this.color[i];
			const db = this.db[i];
			const dbNext = this.db[i + 1];
			const offset = i * this.offset;
			const mainLeft_x = this.x * 0.5 + this.w * 0.5 - i * this.offset + 1;
			const mainRight_x = this.x + i * this.offset + this.w * 0.5 - 1;

			this.drawCenterMainBars(gr, db, dbNext, offset, this.leftPeak, this.mainLeftAnim_x, this.mainLeftAnim2_x, mainLeft_x, mainRight_x, 'mainLeft_x', this.mainLeft_y, color);
			this.drawCenterMainBars(gr, db, dbNext, offset, this.rightPeak, this.mainRightAnim_x, this.mainRightAnim2_x, mainLeft_x, mainRight_x, 'mainRight_x', this.mainRight_y, color);

			this.drawCenterOuterBars(gr, db, dbNext, offset, this.leftLevel, this.outerLeftAnim_x, this.outerLeftAnim_w, this.outerLeft_y, 'outerLeft_w');
			this.drawCenterOuterBars(gr, db, dbNext, offset, this.rightLevel, this.outerRightAnim_x, this.outerRightAnim_w, this.outerRight_y, 'outerRight_w');

			this.drawOverBars(gr);
		}

		this.drawMiddleBars(gr);
		this.drawProgressBar(gr);
		this.drawBarInfo(gr);
	}

	/**
	 * Draws the main bars in the horizontal center peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} db - The current decibel level.
	 * @param {number} dbNext - The next decibel level.
	 * @param {number} offset - The offset for drawing.
	 * @param {number} peak - The peak value.
	 * @param {number} anim_x - The animation x-coordinate.
	 * @param {number} anim2_x - The second animation x-coordinate.
	 * @param {number} mainLeft_x - The main left x-coordinate.
	 * @param {number} mainRight_x - The main right x-coordinate.
	 * @param {string} main_x - The main x-coordinate property key name.
	 * @param {number} main_y - The main y-coordinate.
	 * @param {string} color - The color of the bar.
	 * @private
	 */
	drawCenterMainBars(gr, db, dbNext, offset, peak, anim_x, anim2_x, mainLeft_x, mainRight_x, main_x, main_y, color) {
		if (peak <= db) return;

		if (peak < dbNext) this[main_x] = offset;

		if (grSet.peakmeterBarMainBars) {
			gr.FillSolidRect(mainLeft_x,  main_y, this.w2, this.bar_h, color);
			gr.FillSolidRect(mainRight_x, main_y, this.w2, this.bar_h, color);
		}

		if (grSet.peakmeterBarMainPeaks) {
			const color = this.color[Math.round(anim_x / this.offset)];
			const xLeft  = this.x * 0.5 + this.w * 0.5 - (anim_x + this.offset) + this.w2 * 0.33;
			const xRight = this.x + anim_x + this.offset + this.w * 0.5;
			gr.FillSolidRect(xLeft,  main_y, this.w2 * 0.66, this.bar_h, color);
			gr.FillSolidRect(xRight, main_y, this.w2 * 0.66, this.bar_h, color);

			const xLeftPeaks  = this.x + this.w * 0.5 - anim2_x - this.offset - this.w2 * 0.66;
			const wLeftPeaks  = xLeftPeaks < this.x + this.w2 * 0.5 ? 0 : this.w2 * 0.33;
			const xRightPeaks = this.x + this.w * 0.5 + anim2_x + this.offset + this.w2 * 0.66;
			const wRightPeaks = xRightPeaks > this.w + this.w2 * 0.5 ? 0 : this.w2 * 0.33;
			gr.FillSolidRect(xLeftPeaks,  main_y, wLeftPeaks,  this.bar_h, color);
			gr.FillSolidRect(xRightPeaks, main_y, wRightPeaks, this.bar_h, color);
		}
	}

	/**
	 * Draws the outer bars in the horizontal center peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} db - The current decibel level.
	 * @param {number} dbNext - The next decibel level.
	 * @param {number} offset - The offset for drawing.
	 * @param {number} level - The level value.
	 * @param {number} anim_x - The animation x-coordinate.
	 * @param {number} anim_w - The animation width.
	 * @param {number} outer_y - The outer y-coordinate.
	 * @param {string} outer_w - The outer width property name.
	 * @private
	 */
	drawCenterOuterBars(gr, db, dbNext, offset, level, anim_x, anim_w, outer_y, outer_w) {
		if (level <= db) return;

		if (level < dbNext) {
			this[outer_w] = offset + this.offset / Math.abs(dbNext - db) * Math.abs(level - db) - this.x;
		}

		if (grSet.peakmeterBarOuterBars) {
			const xLeft = Clamp(this.x + this.w * 0.5 - this[outer_w], this.x, this.w * 0.5);
			const xRight = this.x + this.w * 0.5;
			const w = Clamp(this[outer_w], 0, this.w * 0.5);
			gr.FillSolidRect(xLeft,  outer_y, w, this.bar_h, this.color[1]);
			gr.FillSolidRect(xRight, outer_y, w, this.bar_h, this.color[1]);
		}

		if (grSet.peakmeterBarOuterPeaks) {
			const x = Clamp(this.x + anim_x, this.x, this.x + this.w * 0.5 - anim_w);
			const w = anim_w <= 0 ? 2 : anim_w;
			const xLeftPeaks  = this.w * 0.5 + this.x * 2 - x - w;
			const xRightPeaks = this.w * 0.5 + x;
			gr.FillSolidRect(xLeftPeaks,  outer_y, w, this.bar_h, this.color[1]);
			gr.FillSolidRect(xRightPeaks, outer_y, w, this.bar_h, this.color[1]);
		}
	}

	/**
	 * Draws the vertical peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignVertical(gr) {
		const peakL = Math.round(this.leftPeak);
		const peakR = Math.round(this.rightPeak);
		const vertBarH = this.vertBar_h * 1.5;

		const toleranceBase = 0.05;
		const toleranceMin = 0.1;
		const toleranceMax = 1.0;
		const toleranceL = Clamp(toleranceBase * Math.abs(peakL), toleranceMin, toleranceMax);
		const toleranceR = Clamp(toleranceBase * Math.abs(peakR), toleranceMin, toleranceMax);

		for (let i = 0; i < this.points_vert; i++) {
			const dbL = this.db_vert[i];
			const dbR = this.db_vert[this.points_vert - 1 - i];
			const offset = this.vertBar_offset * i;

			if (Math.abs(peakL - dbL) <= toleranceL) this.leftPeaks_s[i] = vertBarH;
			if (Math.abs(peakR - dbR) <= toleranceR) this.rightPeaks_s[i] = vertBarH;

			this.drawVerticalPeaks(gr, this.vertLeft_x, offset, this.leftPeaks_s[i]);
			this.drawVerticalPeaks(gr, this.vertRight_x, offset, this.rightPeaks_s[i]);
		}

		if (grSet.peakmeterBarVertBaseline) {
			gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.w, this.vertBar_h, grCol.peakmeterBarProg);
		}

		this.drawProgressBar(gr);
		this.drawBarInfo(gr);
	}

	/**
	 * Draws the peaks in the vertical peakmeter bar design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} xBase - The base x-coordinate.
	 * @param {number} offset - The offset for drawing.
	 * @param {number} peak_s - The peak value.
	 * @private
	 */
	drawVerticalPeaks(gr, xBase, offset, peak_s) {
		const x = xBase + offset;
		const y = this.y + peak_s - this.vertBar_h;

		if (peak_s <= this.h) {
			const h = Math.min(this.h - peak_s, this.h);
			gr.FillSolidRect(x, y, this.vertBar_w, h, grCol.peakmeterBarVertFill);
		}

		if (grSet.peakmeterBarVertPeaks && peak_s >= 0) {
			gr.FillSolidRect(x, y, this.vertBar_w, this.vertBar_h, grCol.peakmeterBarVertFillPeaks);
		}
	}

	/**
	 * Draws the over bars in the peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @private
	 */
	drawOverBars(gr) {
		if (!grSet.peakmeterBarOverBars) return;

		const widthSize = grSet.peakmeterBarDesign === 'horizontal' ? 1 : 0.5;
		const overLeft  = this.outerLeftAnim_x  + this.outerLeftAnim_w  - (this.w * widthSize);
		const overRight = this.outerRightAnim_x + this.outerRightAnim_w - (this.w * widthSize);

		const outerAnim     = this.outerLeftAnim_x - this.outerLeftAnim_w;
		const outerAnimHalf = outerAnim * 0.5;

		const xLeft   = this.w - overLeft  - this.x;
		const xRight  = this.w - overRight - this.x;
		const xLeft2  = Clamp(this.w * 0.5 - overLeft  - outerAnim, this.x, this.w * 0.5);
		const xRight2 = Clamp(this.w * 0.5 - overRight - outerAnim, this.x, this.w * 0.5);

		const wLeft   = this.w - xLeft  + this.x;
		const wRight  = this.w - xRight + this.x;
		const wLeft2  = this.w - xLeft  + outerAnimHalf;
		const wRight2 = this.w - xRight + outerAnimHalf;

		if (overLeft > 0) { // Top
			gr.FillSolidRect(xLeft, this.overLeft_y, wLeft, this.bar2_h, this.color[10]);
			grSet.peakmeterBarDesign === 'horizontal_center' && gr.FillSolidRect(xLeft2, this.overLeft_y, wLeft2, this.bar2_h, this.color[10]);
		}
		if (overRight > 0) { // Bottom
			gr.FillSolidRect(xRight, this.overRight_y, wRight, this.bar2_h, this.color[10]);
			grSet.peakmeterBarDesign === 'horizontal_center' && gr.FillSolidRect(xRight2, this.overRight_y, wRight2, this.bar2_h, this.color[10]);
		}
	}

	/**
	 * Draws the middle bars in the peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @private
	 */
	drawMiddleBars(gr) {
		if (!grSet.peakmeterBarMiddleBars) return;

		if (grSet.peakmeterBarDesign === 'horizontal') {
			for (let i = 0; i <= this.points_middle; i++) {
				const dbMiddle = this.db_middle[i];
				const x = this.x + i * this.middleOffset;

				if (this.leftPeak > dbMiddle) {
					gr.FillSolidRect(x, this.middleLeft_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
				}
				if (this.rightPeak > dbMiddle) {
					gr.FillSolidRect(x, this.middleRight_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
				}
			}
		}
		else if (grSet.peakmeterBarDesign === 'horizontal_center') {
			for (let i = 0; i <= this.points_middle; i++) {
				const dbMiddle = this.db_middle[i];
				const x1 = this.x * 0.5 + this.w * 0.5 - i * this.middleOffset + 1;
				const x2 = this.x + this.w * 0.5 + i * this.middleOffset - 1;

				if (this.leftPeak > dbMiddle) {
					gr.FillSolidRect(x1, this.middleLeft_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
					gr.FillSolidRect(x2, this.middleLeft_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
				}
				if (this.rightPeak > dbMiddle) {
					gr.FillSolidRect(x1, this.middleRight_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
					gr.FillSolidRect(x2, this.middleRight_y, this.middle_w, this.bar2_h, grCol.peakmeterBarProgFill);
				}
			}
		}
	}

	/**
	 * Draws the progress bar in the peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @private
	 */
	drawProgressBar(gr) {
		if (!fb.IsPlaying || !grSet.peakmeterBarProgBar) return;

		const playbackRatio = fb.PlaybackTime / fb.PlaybackLength;
		this.progressLength = Math.floor(this.w * (grSet.peakmeterBarDesign === 'horizontal_center' ? 0.5 : 1) * playbackRatio);
		if (!this.progressLength) return;

		if (grSet.peakmeterBarDesign === 'horizontal') {
			gr.FillSolidRect(this.x, this.middleLeft_y, this.w, this.bar_h, grCol.peakmeterBarProg);
			gr.FillSolidRect(this.x, this.middleLeft_y, this.progressLength, this.bar_h, grCol.peakmeterBarProgFill);
		}
		else if (grSet.peakmeterBarDesign === 'horizontal_center') {
			gr.FillSolidRect(this.x, this.middleLeft_y, this.w, this.bar_h, grCol.peakmeterBarProg);
			gr.FillSolidRect(this.x + this.w * 0.5 - this.progressLength, this.middleLeft_y, this.progressLength, this.bar_h, grCol.peakmeterBarProgFill);
			gr.FillSolidRect(this.x + this.w * 0.5, this.middleLeft_y, this.progressLength, this.bar_h, grCol.peakmeterBarProgFill);
		}
		else if (grSet.peakmeterBarDesign === 'vertical') {
			gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.w, this.bar_h, grCol.peakmeterBarProg);
			gr.FillSolidRect(this.x, this.y + this.h - this.vertBar_h, this.progressLength, this.bar_h, grCol.peakmeterBarVertProgFill);
		}
	}

	/**
	 * Draws the grid in the peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarGrid(gr) {
		if (!grSet.peakmeterBarGrid) return;
		gr.FillSolidRect(this.x, this.outerLeft_y, this.w, this.bar_h, grCol.peakmeterBarProg);
		gr.FillSolidRect(this.x, this.outerRight_y, this.w, this.bar_h, grCol.peakmeterBarProg);
	}

	/**
	 * Draws the bar info in the peakmeter bar designs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarInfo(gr) {
		if (!grSet.peakmeterBarInfo) return;

		const infoTextColor = grCol.lowerBarArtist;

		if (grSet.peakmeterBarDesign === 'horizontal') {
			const text_db_w = gr.CalcTextWidth('db', this.textFont);

			for (let i = 4; i <= this.points; i += 2) {
				const text_w = gr.CalcTextWidth(this.db[i], this.textFont);
				gr.GdiDrawText(this.db[i], this.textFont, infoTextColor, this.x + this.offset * i - text_w * 0.5, this.text_y, this.w, this.h);
			}

			gr.GdiDrawText('db', this.textFont, infoTextColor, this.x + this.offset * 2 - text_db_w, this.text_y, this.w, this.h);
		}
		else if (grSet.peakmeterBarDesign === 'horizontal_center') {
			const text_db_w = gr.CalcTextWidth('db', this.textFont);

			for (let i = 4; i <= this.points; i += 2) {
				const textRight_w = gr.CalcTextWidth(this.db[i], this.textFont);
				const textLeft_w2 = gr.CalcTextWidth(`${this.db[this.points + 3 - i]}-`, this.textFont);

				gr.GdiDrawText(this.db[i], this.textFont, infoTextColor, this.w * 0.5 + this.offset * i - textRight_w * 0.5, this.text_y, this.w, this.h);
				gr.GdiDrawText(this.db[this.points + 3 - i], this.textFont, infoTextColor, this.x + this.offset * i - textLeft_w2 * 1.5, this.text_y, this.w, this.h);
			}

			gr.GdiDrawText('db', this.textFont, infoTextColor, this.w * 0.5 + this.offset * 2 - text_db_w * 0.5, this.text_y, this.w, this.h);
		}
		else if (grSet.peakmeterBarDesign === 'vertical') {
			for (let i = 0; i <= this.points_vert; i++) {
				const dbLeft = this.db_vert[i];
				const dbRight = this.db_vert[this.points_vert - 1 - i];

				const textLeft_w = gr.CalcTextWidth(`${dbLeft}--`, this.textFont);
				const textRight_w = gr.CalcTextWidth(`${dbRight}--`, this.textFont);
				const textLeft_x = this.vertLeft_x + this.vertBar_offset * i - textLeft_w / 2 + (this.vertBar_offset - this.vertBar_w);
				const textRight_x = this.vertRight_x + this.vertBar_offset * i - textRight_w / 2 + (this.vertBar_offset - this.vertBar_w);

				gr.GdiDrawText(dbLeft % 2 === 0 ? dbLeft : '', this.textFont, infoTextColor, textLeft_x, this.y, grm.ui.ww, grm.ui.wh);
				gr.GdiDrawText(dbRight % 2 === 0 ? dbRight : '', this.textFont, infoTextColor, textRight_x, this.y, grm.ui.ww, grm.ui.wh);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - INITIALIZATION * //
	// #region PUBLIC METHODS - INITIALIZATION
	/**
	 * Initializes the decibel arrays for different configurations.
	 */
	initDecibel() {
		this.db = [-20, -17.5, -15, -12.5, -10, -7.5, -5, -4.5, -4, -3.5, -3, -2.5, -2, -1.5, -1, -0.5,	0, 0.1, 1, 1.5, 2, 2.5, 3, 3.5, 5];
		this.db_middle = [-100, -95, -90, -85, -80, -75, -70, -65, -62.5, -60, -57.5, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -32.5, -30, -27.5, -25, -22.5];
		this.db_vert = {
			220: [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2],
			215: [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2],
			210: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2],
			320: [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3],
			315: [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3],
			310: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3],
			520: [-20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
			515: [-15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
			510: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
		}[grSet.peakmeterBarVertDbRange];
	}

	/**
	 * Initializes the points for different decibel arrays.
	 */
	initPoints() {
		this.points_middle = this.db_middle.length;
		this.points = this.db.length;
		this.points_vert = this.db_vert.length;

		for (let i = 0; i <= this.points_vert; i++) {
			this.leftPeaks_s[i] = 0;
			this.rightPeaks_s[i] = 0;
		}
	}

	/**
	 * Initializes the peaks arrays for left and right channels.
	 */
	initPeaks() {
		this.leftPeaks_s  = new Array(this.points_vert + 1).fill(0);
		this.rightPeaks_s = new Array(this.points_vert + 1).fill(0);
	}

	/**
	 * Initializes the separator index based on the decibel array.
	 */
	initSeparator() {
		this.separator = this.db.indexOf(0);
		this.sep1 = this.separator;
		this.sep2 = this.points - this.sep1;
	}

	/**
	 * Initializes bar geometry properties.
	 */
	initGeometry() {
		this.bar_h = grSet.layout !== 'default' ? SCALE(2) : SCALE(4);

		this.offset       = (grSet.peakmeterBarDesign === 'horizontal_center' ? this.w * 0.5 : this.w) / this.points;
		this.middleOffset = (grSet.peakmeterBarDesign === 'horizontal_center' ? this.w * 0.5 : this.w) / this.points_middle;
		this.middle_w     = this.middleOffset - (grSet.peakmeterBarGaps ? 1 : 0);
		this.w2           = this.offset - (grSet.peakmeterBarGaps ? 1 : 0);

		this.vertBar_offset = ((this.w / this.points_vert) + ((grSet.peakmeterBarVertSize === 'min' ? 2 : grSet.peakmeterBarVertSize) / this.points_vert * 0.5)) * 0.5;
		this.vertBar_w = grSet.peakmeterBarVertSize === 'min' ? Math.ceil(this.vertBar_offset * 0.1 * 0.5) : this.vertBar_offset - grSet.peakmeterBarVertSize * 0.5;
		this.vertBar_h = 2;
		this.vertLeft_x = this.x;
		this.vertRight_x = this.vertLeft_x + this.vertBar_offset * this.points_vert;
	}
	// #endregion

	// * PUBLIC METHODS - COMMON * //
	// #region PUBLIC METHODS - COMMON
	/**
	 * Resets the state of the peakmeter bar.
	 */
	reset() {
		this.leftLevel = 0;
		this.leftPeak = 0;
		this.rightLevel = 0;
		this.rightPeak = 0;
		this.leftPeaks_s = [];
		this.rightPeaks_s = [];
		this.progressLength = 0;
		this.tooltipText = '';
	}

	/**
	 * Sets all vertical peakmeter bar positions.
	 * Bars are ordered from top to bottom.
	 * @param {number} y - The y-coordinate.
	 */
	setY(y = grm.ui.seekbarY) {
		this.y = y;
		this.overLeft_y    = this.y;
		this.outerLeft_y   = this.overLeft_y    + this.bar2_h;
		this.mainLeft_y    = this.outerLeft_y   + this.bar_h;
		this.middleLeft_y  = this.mainLeft_y    + this.bar_h + SCALE(1);
		this.middleRight_y = this.middleLeft_y  + this.bar2_h;
		this.mainRight_y   = this.middleRight_y + this.bar2_h + SCALE(1);
		this.outerRight_y  = this.mainRight_y   + this.bar_h;
		this.overRight_y   = this.outerRight_y  + this.bar_h;
		this.text_y        = this.outerRight_y  + this.bar_h * 2;
	}

	/**
	 * Monitors volume levels and peaks and sets horizontal or vertical animations based on peakmeterBarDesign.
	 */
	setAnimation() {
		// * Set and monitor volume level/peaks from VUMeter
		const convertVolume = ConvertVolume;
		const vuMeter = this.VUMeter;
		this.leftLevel  = convertVolume(vuMeter.LeftLevel,  'vuLevelToDecibel');
		this.leftPeak   = convertVolume(vuMeter.LeftPeak,   'vuLevelToDecibel');
		this.rightLevel = convertVolume(vuMeter.RightLevel, 'vuLevelToDecibel');
		this.rightPeak  = convertVolume(vuMeter.RightPeak,  'vuLevelToDecibel');

		// * Debug stuff
		// DebugLog('LEFT PEAKS: ',  this.leftPeak,   '      RIGHT PEAKS: ',  this.rightPeak);
		// DebugLog('LEFT LEVEL:  ', this.leftLevel,  '      RIGHT LEVEL:  ', this.rightLevel, '\n\n');

		// * Set horizontal animation
		if (['horizontal', 'horizontal_center'].includes(grSet.peakmeterBarDesign)) {
			const increment1 = 0.09; // 0.3 ** 2
			const increment2 = 1.21; // 1.1 ** 2

			// * Main left middle peaks
			if (this.mainLeftAnim_x <= this.mainLeft_x) {
				this.mainLeftAnim_x  = this.mainLeft_x;
				this.mainLeftAnim2_x = this.mainLeft_x;
				this.mainLeft_k  = 0;
				this.mainLeft2_k = 0;
			}
			this.mainLeft_k      += increment1;
			this.mainLeftAnim_x  -= this.mainLeft_k;
			this.mainLeft2_k     += increment2;
			this.mainLeftAnim2_x += this.mainLeft2_k;

			// * Main right middle peaks
			if (this.mainRightAnim_x <= this.mainRight_x) {
				this.mainRightAnim_x  = this.mainRight_x;
				this.mainRightAnim2_x = this.mainRight_x;
				this.mainRight_k  = 0;
				this.mainRight2_k = 0;
			}
			this.mainRight_k      += increment1;
			this.mainRightAnim_x  -= this.mainRight_k;
			this.mainRight2_k     += increment2;
			this.mainRightAnim2_x += this.mainRight2_k;

			// * Outer left peaks
			if (this.outerLeftAnim_x <= this.outerLeft_w) {
				this.outerLeftAnim_x  = this.outerLeft_w;
				this.outerLeft_k = 0;
				this.outerLeftAnim_w = this.outerLeft_w - this.outerLeft_w_old < 1 ? this.outerLeftAnim_w : this.outerLeft_w - this.outerLeft_w_old + 10;
			} else {
				this.outerLeft_w_old = this.outerLeft_w;
			}
			this.outerLeft_k     += increment1;
			this.outerLeftAnim_x -= this.outerLeft_k;
			this.outerLeftAnim_w -= this.outerLeft_k * 2;

			// * Outer right peaks
			if (this.outerRightAnim_x <= this.outerRight_w) {
				this.outerRightAnim_x  = this.outerRight_w;
				this.outerRight_k = 0;
				this.outerRightAnim_w = this.outerRight_w - this.outerRight_w_old < 1 ? this.outerRightAnim_w : this.outerRight_w - this.outerRight_w_old + 10;
			} else {
				this.outerRight_w_old = this.outerRight_w;
			}
			this.outerRight_k     += increment1;
			this.outerRightAnim_x -= this.outerRight_k;
			this.outerRightAnim_w -= this.outerRight_k * 2;
		}
		// * Set vertical animation
		else if (grSet.peakmeterBarDesign === 'vertical') {
			for (let j = 0; j < this.leftPeaks_s.length; j++) {
				this.leftPeaks_s[j] = this.leftPeaks_s[j] < this.h ? this.leftPeaks_s[j] + 2 : this.h;
			}
			for (let j = 0; j < this.rightPeaks_s.length; j++) {
				this.rightPeaks_s[j] = this.rightPeaks_s[j] < this.h ? this.rightPeaks_s[j] + 2 : this.h;
			}
		}
	}

	/**
	 * Sets the peakmeter bar colors.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	setColors(metadb = fb.GetNowPlaying()) {
		let img = gdi.CreateImage(1, 1);
		const g = img.GetGraphics();
		img.ReleaseGraphics(g);

		if (metadb) img = utils.GetAlbumArtV2(metadb, 0);

		if (img) {
			try {
				grm.ui.albumArtCorrupt = false;
				this.colors = JSON.parse(img.GetColourSchemeJSON(4));
				this.c1 = grCol.peakmeterBarFillMiddle; // this.colors[1].col;
				this.c2 = grCol.peakmeterBarFillTop; // this.colors[2].col;
				this.c3 = grCol.peakmeterBarFillBack; // this.colors[3].col;
			} catch (e) {
				grm.ui.noArtwork = true;
				grm.ui.noAlbumArtStub = true;
				grm.ui.albumArtCorrupt = true;
				this.setDefaultColors();
			}
		} else {
			this.setDefaultColors();
		}

		this.color = [];
		this.color1 = [this.c2, this.c3];
		this.color2 = [this.c3, this.c1];

		for (let j = 0; j < this.sep1; j++) {
			this.color.push(CombineColors(this.color1[0], this.color1[1], j / this.sep1));
		}
		for (let j = 0; j < this.sep2; j++) {
			this.color.push(CombineColors(this.color2[0], this.color2[1], j / this.sep2));
		}
	}

	/**
	 * Sets the default peakmeter bar colors.
	 */
	setDefaultColors() {
		this.c1 = grCol.peakmeterBarFillMiddle; // RGB(0, 200, 255);
		this.c2 = grCol.peakmeterBarFillTop; // RGB(255, 255, 0);
		this.c3 = grCol.peakmeterBarFillBack; // RGB(230, 230, 30);
		this.color1 = [this.c3, this.c1];
		this.color2 = [this.c2, this.c3];
	}

	/**
	 * Sets the playback time of the progress bar.
	 * @param {number} x - The x-coordinate.
	 * @private
	 */
	setPlaybackTime(x) {
		const clampedPosition = Clamp((x - this.x) / this.w, 0, 1);
		const newPlaybackTime = clampedPosition * fb.PlaybackLength;
		if (fb.PlaybackTime !== newPlaybackTime) {
			fb.PlaybackTime = newPlaybackTime;
		}
	}

	/**
	 * Sets the refresh rate for the peakmeter bar.
	 */
	setRefreshRate() {
		if (grm.ui.isStreaming) { // Radio streaming refresh rate
			grm.ui.seekbarTimerInterval = FPS._1;
		}
		else if (grSet.peakmeterBarRefreshRate !== 'variable') { // Fixed refresh rate
			grm.ui.seekbarTimerInterval = grSet.peakmeterBarRefreshRate;
		}
		else { // Variable refresh rate calculation
			const now = Date.now();
			if (this.updateTimeLast && (now - this.updateTimeLast) < 250) return; // Check every 250 ms
			this.updateTimeLast = now;

			if (this.profilerPaintTimeLast === undefined) {
				this.profilerPaintTimeLast = grm.ui.seekbarProfiler.Time;
			}

			const timeDifference = grm.ui.seekbarProfiler.Time - this.profilerPaintTimeLast;
			grm.ui.seekbarTimerInterval = Clamp(grm.ui.seekbarTimerInterval + (timeDifference > 0 ? 8 : -5), FPS._20, FPS._10);
			this.profilerPaintTimeLast = grm.ui.seekbarProfiler.Time;

			grm.ui.clearTimer('seekbar', true);
			grm.ui.seekbarTimer = !fb.IsPaused ? setInterval(() => grm.ui.refreshSeekbar(), grm.ui.seekbarTimerInterval) : null;
		}
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse is within the boundaries of the peakmeter bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
	}

	/**
	 * Handles left mouse button down click events and enables dragging.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_down(x, y) {
		this.drag = true;
	}

	/**
	 * Handles left mouse button up click events and disables dragging and updates the playback time.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_up(x, y) {
		this.drag = false;
		if (this.on_mouse && this.mouseInThis(x, y)) {
			this.setPlaybackTime(x);
		}
	}

	/**
	 * Handle mouse leave events.
	 */
	on_mouse_leave() {
		this.drag = false;
		this.on_mouse = false;
	}

	/**
	 * Handles mouse movement events and updates the playback time based on the mouse movement if a drag event is occurring.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_move(x, y) {
		this.on_mouse = true;
		this.pos_x = x <= this.textWidth ? this.x + this.textWidth : this.x + x;
		this.pos_y = y <= this.textHeight ? this.textHeight : y;
		if (this.drag) {
			this.setPlaybackTime(x);
		}
	}

	/**
	 * Handles mouse wheel events and controls the volume offset.
	 * @param {number} step - The wheel scroll direction.
	 */
	on_mouse_wheel(step) {
		this.wheel = true;
		if (Component.VUMeter) {
			this.VUMeter.Offset = this.VUMeter.Offset + step;
			this.tooltipText = `${Math.round(this.VUMeter.Offset)} db`;
			grm.ttip.showImmediate(this.tooltipText);
		}
		if (this.tooltipTimer) {
			clearTimeout(this.tooltipTimer);
		}
		this.tooltipTimer = setTimeout(() => {
			this.wheel = false;
			if (this.tooltipTimer) clearTimeout(this.tooltipTimer);
			this.tooltipTimer = false;
			this.tooltipText = '';
			grm.ttip.stop();
		}, 2000);
	}

	/**
	 * Updates peakmeter bar colors when playing a new track.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	on_playback_new_track(metadb) {
		if (!metadb) return;
		this.progressLength = 0;
		this.setColors(metadb);
	}

	/**
	 * Resets the peakmeter bar on playback stop.
	 * @param {number} reason - The type of playback stop.
	 */
	on_playback_stop(reason = -1) {
		if (['progressbar', 'waveformbar'].includes(grSet.seekbar)) {
			return;
		}

		if (reason !== 2) {
			this.reset();
			window.Repaint();
		}
	}

	/**
	 * Sets the size and position of the peakmeter bar and updates them on window resizing.
	 */
	on_size() {
		this.x = grm.ui.edgeMargin;
		this.y = grm.ui.seekbarY;
		this.w = grm.ui.ww - grm.ui.edgeMarginBoth;
		this.h = grm.ui.seekbarHeight;

		this.initGeometry();
		this.setY();

		this.textFont = gdi.Font('Segoe UI', HD_4K(9, 16), 1);
	}
	// #endregion
}


//////////////////////
// * WAVEFORM BAR * //
//////////////////////
/**
 * A class that creates the waveform bar in the lower bar when enabled.
 * Quick access via right click context menu on lower bar.
 */
class WaveformBar {
	/**
	 * Creates the `WaveformBar` instance.
	 */
	constructor() {
		// * Dependencies
		include(`${fb.ProfilePath}georgia-reborn\\externals\\Codepages.js`);
		include(`${fb.ProfilePath}georgia-reborn\\externals\\lz-utf8\\lzutf8.js`);
		include(`${fb.ProfilePath}georgia-reborn\\externals\\lz-string\\lz-string.min.js`);

		/** @private @type {string} The match pattern used to create folder path. */
		this.matchPattern = '$replace($ascii([$replace($if2($meta(ALBUMARTIST,0),$meta(ARTIST,0)),\\,)]\\[$replace([$if3(%original release date%,%originaldate%,%date%,%fy_upload_date%,) - ]%ALBUM%,\\,)]\\%TRACKNUMBER% - $replace(%TITLE%,\\,)), ?,,= ,,?,)';
		/** @private @type {boolean} The debug flag for logging debug information. */
		this.debug = false;
		/** @private @type {boolean} The profile flag for logging performance information. */
		this.profile = false;
		/** @private @type {FbProfiler} The profiler for logging performance information. */
		this.profiler = null;

		/**
		 * The waveform bar analysis settings.
		 * @typedef {object} waveformBarAnalysis
		 * @property {string} binaryMode - The settings: ffprobe | audiowaveform | visualizer.
		 * @property {number} resolution - The pixels per second on audiowaveform, per sample on ffmpeg (higher values than 1 require resampling). Visualizer mode is adjusted via window width.
		 * @property {string} compressionMode - The settings: none | 'utf-8' (~50% compression) | 'utf-16' (~70% compression) 7zip (~80% compression).
		 * @property {string} saveMode - The settings: always | library | never.
		 * @property {boolean} autoAnalysis - The flag to auto-analyze files.
		 * @property {boolean} autoDelete - The flag to auto-delete analysis files when unloading the script, present during play session to prevent recalculation.
		 * @property {boolean} visualizerFallbackAnalysis - The flag to use visualizer mode when analyzing the file.
		 * @property {boolean} visualizerFallback - The flag to use visualizer mode when the file cannot be processed (incompatible format).
		 * @public
		 */
		/** @public @type {waveformBarAnalysis} */
		this.analysis = {
			binaryMode: grSet.waveformBarMode,
			resolution: 1,
			compressionMode: 'utf-16',
			saveMode: grSet.waveformBarSaveMode,
			autoAnalysis: true,
			autoDelete: grSet.waveformBarAutoDelete,
			visualizerFallbackAnalysis: grSet.waveformBarFallbackAnalysis,
			visualizerFallback: grSet.waveformBarFallback
		};

		/**
		 * The waveform bar binary settings.
		 * @typedef {object} waveformBarBinaries
		 * @property {string} ffprobe - The ffprobe binary to use.
		 * @property {string} audiowaveform - The audiowaveform binary to use.
		 * @property {string} visualizer - The visualizer binary to use.
		 * @public
		 */
		/** @public @type {waveformBarBinaries} */
		this.binaries = {
			ffprobe:       `${fb.ProfilePath}georgia-reborn\\externals\\ffprobe\\ffprobe.exe`,
			audiowaveform: `${fb.ProfilePath}georgia-reborn\\externals\\audiowaveform\\audiowaveform${Detect.Win64 ? '' : '_32'}.exe`,
			visualizer:    `${fb.ProfilePath}running`
		};

		/**
		 * The waveform bar preset settings.
		 * @typedef {object} waveformBarPreset
		 * @property {string} analysisMode - The waveform bar analysis mode `rms_level`, `peak_level`, `rms_peak (only available when using ffprobe)`.
		 * @property {string} barDesign - The waveform bar design `waveform`, `bars`, `dots`, `halfbars`.
		 * @property {string} paintMode - The waveform bar paint mode `full`, `partial`.
		 * @property {boolean} animate - The flag to display animation.
		 * @property {boolean} useBPM - The flag to use synced BPM.
		 * @property {boolean} indicator - The flag to show waveform bar progress indicator.
		 * @property {boolean} prepaint - The flag to prepaint waveform bar progress.
		 * @property {number} prepaintFront - The prepaint waveform bar progress length.
		 * @property {boolean} invertHalfbars - The flag to invert waveform bar halfbars.
		 * @public
		 */
		/** @public @type {waveformBarPreset} */
		this.preset = {
			analysisMode: grSet.waveformBarAnalysis,
			barDesign: grSet.waveformBarDesign,
			paintMode: grSet.waveformBarPaint,
			animate: grSet.waveformBarAnimate,
			useBPM: grSet.waveformBarBPM,
			indicator: grSet.waveformBarIndicator,
			prepaint: grSet.waveformBarPrepaint,
			prepaintFront: grSet.waveformBarPrepaintFront,
			invertHalfbars: grSet.waveformBarInvertHalfbars
		};

		/**
		 * The waveform bar ui settings.
		 * @typedef {object} waveformBarUI
		 * @property {number} sizeWave - The width size of drawn waveform.
		 * @property {number} sizeBars - The width size of drawn bars.
		 * @property {number} sizeDots - The width size of drawn dots.
		 * @property {number} sizeHalf - The width size of drawn halfbars.
		 * @property {number} sizeNormalizeWidth - The visualizer binary to use.
		 * @property {number} refreshRate - The refresh rate in ms when using animations for any type. 100 is smooth enough but the performance hit is high.
		 * @public
		 */
		/** @public @type {waveformBarUI} */
		this.ui = {
			sizeWave: grSet.waveformBarSizeWave,
			sizeBars: grSet.waveformBarSizeBars,
			sizeDots: grSet.waveformBarSizeDots,
			sizeHalf: grSet.waveformBarSizeHalf,
			sizeNormalizeWidth: grSet.waveformBarSizeNormalize,
			refreshRate: grSet.waveformBarRefreshRate === 'variable' ? FPS._5 : grSet.waveformBarRefreshRate
		};

		/**
		 * The waveform bar wheel settings.
		 * @typedef {object} waveformBarWheel
		 * @property {number} seekSpeed - The mouse wheel seek type, 'seconds' or 'percentage.
		 * @property {string} seekType - The mouse wheel seek speed.
		 * @public
		 */
		/** @public @type {waveformBarWheel} */
		this.wheel = {
			seekSpeed: grSet.waveformBarWheelSeekSpeed,
			seekType: grSet.waveformBarWheelSeekType
		};

		// * Easy access
		/** @public @type {number} The x-coordinate of the waveform bar. */
		this.x = grm.ui.edgeMargin;
		/** @public @type {number} The y-coordinate of the waveform bar. */
		this.y = 0;
		/** @public @type {number} The width of the waveform bar. */
		this.w = grm.ui.ww - grm.ui.edgeMarginBoth;
		/** @public @type {number} The height of the waveform bar. */
		this.h = grm.ui.seekbarHeight;

		// * Internals
		/** @private @type {boolean} The active state of the waveform bar. */
		this.active = true;
		/** @private @type {string} The title format used for the waveform bar. */
		this.Tf = fb.TitleFormat(this.matchPattern);
		/** @private @type {number} The maximum step for the title format. */
		this.TfMaxStep = fb.TitleFormat('[%BPM%]');
		/** @private @type {string[]} The cache storage for the waveform data. */
		this.cache = null;
		/** @private @type {string} The directory for the waveform cache. */
		this.cacheDir = `${fb.ProfilePath}cache\\waveform\\`;
		/** @private @type {string} The code page for character encoding conversion. */
		this.codePage = convertCharsetToCodepage('UTF-8');
		/** @private @type {string} The code page for UTF-16LE character encoding conversion. */
		this.codePageV2 = convertCharsetToCodepage('UTF-16LE');
		/** @private @type {number} The queue identifier for the waveform bar. */
		this.queueId = null;
		/** @private @type {number} The queue interval in milliseconds. */
		this.queueMs = 1000;
		/** @private @type {string[]} The current waveform data. */
		this.current = [];
		/** @private @type {number[]} The offset values for the waveform data. */
		this.offset = [];
		/** @private @type {number} The current step in the waveform animation. */
		this.step = 0; // 0 - maxStep
		/** @private @type {number} The maximum step for the waveform animation. */
		this.maxStep = 4;
		/** @private @type {number} The current playback time for the waveform bar. */
		this.time = 0;
		/** @private @type {boolean} The state indicating if the mouse is down. */
		this.mouseDown = false;
		/** @private @type {boolean} The state indicating if the file is allowed. Set at checkAllowedFile(). */
		this.isAllowedFile = true;
		/** @private @type {boolean} The state indicating if the file is a zipped file. Set at checkAllowedFile(). */
		this.isZippedFile = false;
		/** @private @type {boolean} The state indicating if there was an error. Set at verifyData() after retrying analysis. */
		this.isError = false;
		/** @private @type {boolean} The state indicating if fallback mode is active. For visualizerFallback, set at checkAllowedFile(). */
		this.isFallback = false;

		/**
		 * The waveform bar fallback mode settings for visualizerFallbackAnalysis.
		 * @typedef {object} waveformBarFallbackMode
		 * @property {boolean} paint - The state that indicates whether to use the paint fallback mode.
		 * @property {boolean} analysis - The state that indicates whether to use the analysis fallback mode.
		 * @public
		 */
		/** @private @type {waveformBarFallbackMode} */
		this.fallbackMode = {
			paint: false,
			analysis: false
		};

		/**
		 * The waveform bar ffprobeMode settings.
		 * @typedef {object} waveformBarFFProbeMode
		 * @property {object} rms_level - The settings for RMS level mode.
		 * @property {string} rms_level.key - The key for the RMS level mode.
		 * @property {number} rms_level.pos - The position index for RMS level mode.
		 * @property {object} rms_peak - The settings for RMS peak mode.
		 * @property {string} rms_peak.key - The key for the RMS peak mode.
		 * @property {number} rms_peak.pos - The position index for RMS peak mode.
		 * @property {object} peak_level - The settings for peak level mode.
		 * @property {string} peak_level.key - The key for peak level mode.
		 * @property {number} peak_level.pos - The position index for peak level mode.
		 * @public
		 */
		/** @private @type {waveformBarFFProbeMode} */
		this.ffprobeMode = {
			rms_level:  { key: 'rms',     pos: 1 },
			rms_peak:   { key: 'rmsPeak', pos: 2 },
			peak_level: { key: 'peak',    pos: 3 }
		};

		/**
		 * The waveform bar compatible file settings.
		 * @typedef {object} waveformBarCompatibility
		 * @property {RegExp} ffprobe - The regular expression to test for file types compatible with ffprobe.
		 * @property {RegExp} audiowaveform - The regular expression to test for file types compatible with audiowaveform.
		 * @public
		 */
		/** @private @type {waveformBarCompatibility} */
		this.compatibleFiles = {
			ffprobeList: ['2sf', 'aa', 'aac', 'ac3', 'ac4', 'aiff', 'ape', 'dff', 'dts', 'eac3', 'flac', 'hmi', 'la', 'lpcm', 'm4a', 'minincsf', 'mp2', 'mp3', 'mp4', 'mpc', 'ogg', 'ogx', 'opus', 'ra', 'snd', 'shn', 'spc', 'tak', 'tta', 'vgm', 'wav', 'wma', 'wv'],
			ffprobe: null,
			audiowaveformList: ['flac', 'mp3', 'ogg', 'opus', 'wav'],
			audiowaveform: null
		};
		for (const key of ['ffprobe', 'audiowaveform']) {
			this.compatibleFiles[key] = new RegExp(`\\.(${this.compatibleFiles[`${key}List`].join('|')})$`, 'i');
		}

		// * Initialization
		this.checkConfig();
		this.defaultSteps();
		this.setThrottlePaint();
		if (!IsFolder(this.cacheDir)) { CreateFolder(this.cacheDir); }
	}

	// * PUBLIC METHODS - DRAW * //
	// #region PUBLIC METHODS - DRAW
	/**
	 * Draws the waveform bar with various designs based on the current settings.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (!fb.IsPlaying) {
			gr.FillSolidRect(this.x, grm.ui.seekbarY, this.w, SCALE(grSet.layout !== 'default' ? 10 : 12), grCol.progressBar);
			this.reset();
			return;
		}

		if (this.current.length === 0) {
			this.drawBarInfo(gr);
			return;
		}

		if (grSet.waveformBarRefreshRate === 'variable' || grm.ui.showDrawExtendedTiming) {
			grm.ui.seekbarProfiler.Reset();
		}

		// * Set shared properties
		/** @private @type {number} The time constant for the waveform bar calculation. */
		this.timeConstant = fb.PlaybackLength / this.current.length;
		/** @private @type {number} The current X position based on playback time. */
		this.currX = this.x + this.w * ((fb.PlaybackTime / fb.PlaybackLength) || 0);
		/** @private @type {number} The width of each bar in the waveform. */
		this.barW = this.w / this.current.length;
		/** @private @type {boolean} The state whether prepaint mode is active. */
		this.prepaint = this.preset.paintMode === 'partial' && this.preset.prepaint;
		/** @private @type {boolean} The state whether visualizer mode is active. */
		this.visualizer = this.analysis.binaryMode === 'visualizer' || this.isFallback || this.fallbackMode.paint;

		const minPointDiff = 1; // in px
		const past = [{ x: 0, y: 1 }, { x: 0, y: -1 }];
		let pastIndex = 0;

		gr.SetSmoothingMode(SmoothingMode.AntiAlias);

		for (let n = 0; n < this.current.length; n++) {
			const frame = this.current[n];
			const current = this.timeConstant * n;
			const isPrepaintAllowed = (current - this.time) < this.preset.prepaintFront;

			/** @private @type {boolean} The state whether the current frame is in prepaint mode. */
			this.isPrepaint = current > this.time;
			/** @private @type {number} The scaled size of the current frame. */
			this.scaledSize = this.h / 2 * frame;
			/** @private @type {number} The x-position of the current frame. */
			this.frameX = this.x + this.barW * n;

			// * Exit loop if prepaint mode conditions are met
			if (this.preset.paintMode === 'partial' && !this.prepaint && this.isPrepaint) break;
			if (this.prepaint && this.isPrepaint && !isPrepaintAllowed) break;
			if (!this.offset[n]) this.offset[n] = 0;

			// * Calculate offsets for prepainting and visualizer animation
			/** @private @type {number} The offset value for prepainting and visualizer animation. */
			this.offset[n] += (this.prepaint && this.isPrepaint && this.preset.animate || this.visualizer ? // Add movement when pre-painting
				this.preset.barDesign === 'dots' ? Math.random() * Math.abs(this.step / this.maxStep) :
				-Math.sign(frame) * Math.random() * this.scaledSize / 10 * this.step / this.maxStep : 0);

			/** @private @type {number} The random offset value for the current frame. */
			this.offsetRandom = this.preset.barDesign === 'dots' ? this.offset[n] : Math.sign(frame) * this.offset[n];

			// * Draw the waveform bar
			if (past.every((p) =>
				(p.y !== Math.sign(frame) && this.preset.barDesign !== 'halfbars') ||
				(p.y === Math.sign(frame) || this.preset.barDesign === 'halfbars') && (this.frameX - p.x) >= minPointDiff)) {
				this.drawWaveformBar(gr);

				past[pastIndex] = { x: this.frameX, y: Math.sign(frame) };
				pastIndex = (pastIndex + 1) % past.length;
			}
		}

		this.drawBarProgressLine(gr);
		this.drawBarAnimation();
	}

	/**
	 * Draws the waveform bar based on the preset design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawWaveformBar(gr) {
		const drawBarDesign = {
			waveform: () => this.drawBarDesignWaveform(gr),
			bars:     () => this.drawBarDesignBars(gr),
			halfbars: () => this.drawBarDesignHalfbars(gr),
			dots:     () => this.drawBarDesignDots(gr)
		};

		drawBarDesign[this.preset.barDesign]();
	}

	/**
	 * Draws the waveform bar in "waveform" design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignWaveform(gr) {
		const yOffset = this.scaledSize > 0 ? Math.max(this.scaledSize + this.offsetRandom, 1) : Math.min(this.scaledSize + this.offsetRandom, -1);
		const zTop = this.visualizer ? Math.abs(yOffset) : yOffset;
		const zBottom = this.visualizer ? -Math.abs(yOffset) : yOffset;
		const { sizeWave } = this.ui;
		const { colorBack, colorFront, colorsDiffer } = this.getColors();

		if (zTop > 0) {
			if (colorsDiffer) {
				gr.FillSolidRect(this.frameX, this.y - zTop, sizeWave, zTop / 2, colorBack);
				gr.FillSolidRect(this.frameX, this.y - zTop / 2, sizeWave, zTop / 2, colorFront);
			} else {
				gr.FillSolidRect(this.frameX, this.y - zTop, sizeWave, zTop, colorBack);
			}
		}

		if (zBottom < 0) {
			if (colorsDiffer) {
				gr.FillSolidRect(this.frameX, this.y - zBottom / 2, sizeWave, -zBottom / 2, colorBack);
				gr.FillSolidRect(this.frameX, this.y, sizeWave, -zBottom / 2, colorFront);
			} else {
				gr.FillSolidRect(this.frameX, this.y, sizeWave, -zBottom, colorBack);
			}
		}
	}

	/**
	 * Draws the waveform bar in "bars" design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignBars(gr) {
		const yOffset = this.scaledSize > 0 ? Math.max(this.scaledSize + this.offsetRandom, 1) : Math.min(this.scaledSize + this.offsetRandom, -1);
		const zTop = this.visualizer ? Math.abs(yOffset) : yOffset;
		const zBottom = this.visualizer ? -Math.abs(yOffset) : yOffset;
		const sizeBars = this.barW * this.ui.sizeBars;
		const { colorBack, colorFront, colorsDiffer } = this.getColors(true, true);

		if (zTop > 0) {
			if (colorsDiffer) {
				gr.DrawRect(this.frameX, this.y - zTop, sizeBars, zTop / 2, 1, colorBack);
				gr.DrawRect(this.frameX, this.y - zTop / 2, sizeBars, zTop / 2, 1, colorFront);
			} else {
				gr.DrawRect(this.frameX, this.y - zTop, sizeBars, zTop, 1, colorBack);
			}
		}

		if (zBottom < 0) {
			if (colorsDiffer) {
				gr.DrawRect(this.frameX, this.y - zBottom / 2, sizeBars, -zBottom / 2, 1, colorBack);
				gr.DrawRect(this.frameX, this.y, sizeBars, -zBottom / 2, 1, colorFront);
			} else {
				gr.DrawRect(this.frameX, this.y, sizeBars, -zBottom, 1, colorBack);
			}
		}
	}

	/**
	 * Draws the waveform bar in "halfbars" design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignHalfbars(gr) {
		const yOffset = this.scaledSize > 0 ? Math.max(this.scaledSize + this.offsetRandom, 1) : Math.min(this.scaledSize + this.offsetRandom, -1);
		const y = this.preset.invertHalfbars ? Math.abs(yOffset) : yOffset;
		const sizeHalf = this.visualizer ? this.barW * this.ui.sizeHalf * (this.visualizer ? 0.2 : 0.5) : this.ui.sizeHalf;
		const { colorBack, colorFront, colorsDiffer } = this.getColors(false, true);

		if (y > 0) {
			if (colorsDiffer) {
				gr.FillSolidRect(this.frameX, this.y - 2 * y + this.h * 0.5, sizeHalf, y, colorBack);
				gr.FillSolidRect(this.frameX, this.y - y + this.h * 0.5, sizeHalf, y, colorFront);
			} else {
				gr.FillSolidRect(this.frameX, this.y - 2 * y + this.h * 0.5, sizeHalf, 2 * y, colorBack);
			}
		}
	}

	/**
	 * Draws the waveform bar in "dots" design.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarDesignDots(gr) {
		const yOffset = this.scaledSize > 0 ? Math.max(this.scaledSize, 1) : Math.min(this.scaledSize, -1);
		const dotStep = Math.max(this.h / 80, 5) + (this.offsetRandom || 1);
		const dotSize = Math.max(dotStep / 25, 1) * this.ui.sizeDots;
		const { colorBack, colorFront } = this.getColors();

		const drawDots = (direction, startY, yOffset, color1, color2) => {
			const sign = this.visualizer ? direction : Math.sign(yOffset);
			const step = direction * yOffset / 2;
			let currentY = startY;

			for (const endY = startY - step; sign * (currentY - endY) > 0; currentY -= sign * dotStep) {
				gr.DrawEllipse(this.frameX, currentY, dotSize, dotSize, 1, color1);
			}

			for (const endY = startY - 2 * step; sign * (currentY - endY) > 0; currentY -= sign * dotStep) {
				gr.DrawEllipse(this.frameX, currentY, dotSize, dotSize, 1, color2);
			}
		};

		drawDots(1, this.y, yOffset, colorFront, colorBack);
		if (!this.visualizer) return;
		drawDots(-1, this.y, yOffset, colorFront, colorBack);
	}

	/**
	 * Draws the progress line on the waveform bar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarProgressLine(gr) {
		if (!this.preset.indicator && !this.mouseDown) return;

		gr.SetSmoothingMode(0);

		if (this.analysis.binaryMode === 'ffprobe' || ['waveform', 'dots'].includes(this.preset.barDesign)) {
			const minBarW = Math.round(Math.max(this.barW, SCALE(1)));
			gr.DrawLine(this.currX, this.y - this.h * 0.5, this.currX, this.y + this.h * 0.5, minBarW, grCol.waveformBarIndicator);
		}
	}

	/**
	 * Draws information text when waveform data is loading or when it is not available.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBarInfo(gr) {
		if (pl.col.row_nowplaying_bg === '') return; // * Wait until nowplaying bg has a new color to prevent flashing

		const DT_CENTER = DrawText.VCenter | DrawText.Center | DrawText.EndEllipsis | DrawText.CalcRect | DrawText.NoPrefix;
		const bgColor = grSet.theme === 'reborn' ? pl.col.row_nowplaying_bg : grCol.transportEllipseBg;
		const message =
			!this.isAllowedFile && !this.isFallback && this.analysis.binaryMode !== 'visualizer' ? 'Incompatible file format' :
			!this.analysis.autoAnalysis ? 'Waveform bar file not found' :
			this.isError ? 'Waveform bar file can not be analyzed' :
			this.active ? 'Loading' : '';

		gr.FillSolidRect(this.x, this.y - this.h * 0.5, this.w, this.h, bgColor);
		gr.GdiDrawText(message, grFont.lowerBarWave, pl.col.header_artist_normal, this.x, this.y - this.h * 0.5, this.w, this.h, DT_CENTER);
	}

	/**
	 * Draw the waveform bar animation.
	 */
	drawBarAnimation() {
		if (this.prepaint && this.preset.animate || this.visualizer) {
			if (this.step >= this.maxStep) {
				this.step = -this.step;
			} else {
				if (this.step === 0) { this.offset = []; }
				this.step++;
			}
		}

		if (fb.IsPlaying && !fb.IsPaused) {
			this.setRefreshRate();

			if (this.visualizer) {
				this.throttlePaint();
			}
			else if (this.current.length && (this.prepaint || this.preset.paintMode === 'partial' || this.preset.indicator)) {
				const paintRect = this.setPaintRect(this.time);
				this.throttlePaintRect(paintRect.x, paintRect.y, paintRect.width, paintRect.height);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS - INITALIZATION * //
	// #region PUBLIC METHODS - INITALIZATION
	/**
	 * Checks if the current file is allowed to be played, i.e not corrupted.
	 * @param {object} handle - The current file handle.
	 */
	checkAllowedFile(handle = fb.GetNowPlaying()) {
		if (!handle) return;

		const noVisual = this.analysis.binaryMode !== 'visualizer';
		const noSubSong = handle.SubSong === 0;
		const validExt = this.checkCompatibleFileExtension(handle);

		this.isZippedFile = handle.RawPath.includes('unpack://');
		this.isAllowedFile = noVisual && noSubSong && validExt && !this.isZippedFile;
		this.isFallback = !this.isAllowedFile && this.analysis.visualizerFallback;
	}

	/**
	 * Checks if the file extension of the current file handle is compatible.
	 * @param {object} handle - The current file handle.
	 * @param {string} mode - The analysis binary mode.
	 * @returns {boolean} True if the file extension is compatible, otherwise false.
	 */
	checkCompatibleFileExtension(handle = fb.GetNowPlaying(), mode = this.analysis.binaryMode) {
		return (mode === 'visualizer') || (handle && this.compatibleFiles[mode].test(handle.Path));
	}

	/**
	 * Checks the report list of compatible file extensions for the given mode.
	 * @param {string} mode - The analysis binary mode.
	 * @returns {Array<string>} An array of compatible file extensions.
	 */
	checkCompatibleFileExtensionReport(mode = this.analysis.binaryMode) {
		return [...this.compatibleFiles[`${mode}List`]];
	}

	/**
	 * Checks the configuration for validity and throws an error if not, called from the constructor.
	 * @throws {Error} Throws an error if the binary mode is not recognized or path is not set.
	 */
	checkConfig() {
		if (!Object.prototype.hasOwnProperty.call(this.binaries, this.analysis.binaryMode)) {
			throw new Error(`Waveform bar => binary mode not recognized or path not set: ${this.analysis.binaryMode}`);
		}
		if (!IsFile(this.binaries[this.analysis.binaryMode])) {
			fb.ShowPopupMessage(`Waveform bar => required dependency not found: ${this.analysis.binaryMode}\n\n${JSON.stringify(this.binaries[this.analysis.binaryMode])}`, window.Name);
		}

		if (this.preset.prepaintFront <= 0 || this.preset.prepaintFront === null) {
			this.preset.prepaintFront = Infinity;
		}

		if (this.wheel.seekSpeed < 0) {
			this.wheel.seekSpeed = 1;
		} else if (this.wheel.seekSpeed > 100 && this.wheel.seekType === 'percentage') {
			this.wheel.seekSpeed = 100;
		}
	}

	/**
	 * Updates the config and ensures the UI is being updated properly after changing settings.
	 * @param {object} newConfig - The new configuration object with settings to be applied.
	 */
	updateConfig(newConfig) {
		if (newConfig) {
			DeepAssign()(this, newConfig);
		}

		this.checkConfig();
		let recalculate = false;

		if (newConfig.preset) {
			if (this.preset.paintMode === 'partial' && this.preset.prepaint || this.analysis.binaryMode === 'visualizer') {
				this.offset = [];
				this.step = 0;
			}
			if (Object.prototype.hasOwnProperty.call(newConfig.preset, 'animate') ||
				Object.prototype.hasOwnProperty.call(newConfig.preset, 'useBPM')) {
				if (this.preset.animate && this.preset.useBPM) {
					this.bpmSteps();
				} else {
					this.defaultSteps();
				}
			}
		}

		if (newConfig.ui) {
			if (Object.prototype.hasOwnProperty.call(newConfig.ui, 'refreshRate')) {
				this.setThrottlePaint();
			}
			if (Object.prototype.hasOwnProperty.call(newConfig.ui, 'sizeNormalizeWidth') ||
				Object.prototype.hasOwnProperty.call(newConfig.ui, 'normalizeWidth')) {
				recalculate = true;
			}
		}

		if (newConfig.analysis) {
			recalculate = true;
		}

		if (recalculate) {
			this.on_playback_new_track();
		} else {
			this.throttlePaint();
		}
	}
	// #endregion

	// * PUBLIC METHODS - DATA * //
	// #region PUBLIC METHODS - DATA
	/**
	 * Starts the analysis process of the waveform data and updates the current state.
	 * @param {FbMetadbHandle} handle - The handle of the current track.
	 * @param {boolean} isRetry - The flag indicating whether the method call is a retry attempt.
	 * @returns {Promise<boolean>} The promise that resolves to `true` if analysis is successful, `false` otherwise.
	 */
	async analyzeDataStart(handle, isRetry) {
		const { waveformBarFolder, waveformBarFile, sourceFile } = this.getPaths(handle);
		const files = this.getFileConfigs();
		const binaryExt = { ffprobe: 'ff', audiowaveform: 'aw' };
		const binaryDotExt = `.${binaryExt[this.analysis.binaryMode]}`;
		let analysisComplete = false;

		for (const file of files) {
			const fileWithExt = `${waveformBarFile}${file.ext}`;
			if (file.ext.startsWith(binaryDotExt) && IsFile(fileWithExt)) {
				const str = Open(fileWithExt, file.codePage) || '';
				this.current = file.decompress(str) || [];
				if (this.verifyData(handle, fileWithExt, isRetry)) {
					analysisComplete = true;
					break;
				}
			}
		}

		if (!analysisComplete && this.analysis.autoAnalysis && IsFile(sourceFile)) {
			if (this.analysis.visualizerFallbackAnalysis && this.isAllowedFile) {
				this.fallbackMode.analysis = this.fallbackMode.paint = true;
				await this.analyzeData(handle, waveformBarFolder, waveformBarFile, sourceFile);
				this.normalizePoints();
				if (this.preset.animate && this.preset.useBPM) this.bpmSteps(handle);
				if (fb.IsPlaying) this.time = fb.PlaybackTime;
			}

			this.throttlePaint(true);
			if (this.analysis.visualizerFallbackAnalysis) {
				this.fallbackMode.analysis = false;
			}

			await this.analyzeData(handle, waveformBarFolder, waveformBarFile, sourceFile);
			this.fallbackMode.analysis = this.fallbackMode.paint = false;
			analysisComplete = this.verifyData(handle, undefined, isRetry);
		}

		this.isFallback = !analysisComplete;
		this.normalizePoints(this.analysis.binaryMode !== 'visualizer' && this.ui.sizeNormalizeWidth);
	}

	/**
	 * Analyzes data of the given handle and saves the results in the waveform bar cache directory.
	 * This method handles command generation, execution, data processing, and saving.
	 * @param {FbMetadbHandle} handle - The handle to analyze.
	 * @param {string} waveformBarFolder - The folder where the waveform bar data should be saved.
	 * @param {string} waveformBarFile - The name of the waveform bar file.
	 * @param {string} [sourceFile] - The path of the source file.
	 * @returns {Promise<void>} The promise that resolves when the analysis has finished.
	 */
	async analyzeData(handle, waveformBarFolder, waveformBarFile, sourceFile = handle.Path) {
		if (!IsFolder(waveformBarFolder)) CreateFolder(waveformBarFolder);

		this.profiler = this.profile ? new FbProfiler(this.analysis.binaryMode) : null;

		const handleFileName = sourceFile.split('\\').pop();
		const handleFolder = sourceFile.replace(handleFileName, '');
		const cmd = this.analyzeDataGetCommand(handleFileName, handleFolder, waveformBarFolder);

		if (cmd) {
			console.log(`Waveform bar scanning: ${sourceFile}`);
			this.debug && console.log(cmd);
		}
		else if (!this.isAllowedFile && this.analysis.binaryMode !== 'visualizer' && !this.fallbackMode.analysis) {
			console.log(`Waveform bar skipping incompatible file: ${sourceFile}`);
		}

		const processed = cmd ? await this.analyzeDataRunCommand(cmd, waveformBarFolder, handle.Length) : true;
		if (!processed) return;

		const data = cmd ? JsonParseFile(`${waveformBarFolder}data.json`, this.codePage) : this.visualizerData(handle);
		DeleteFile(`${waveformBarFolder}data.json`);
		data && this.analyzeDataProcess(handle, waveformBarFile, data);

		if (this.preset.animate && this.preset.useBPM) {
			this.bpmSteps(handle);
		}

		if (this.profiler) {
			this.profiler.Print(`Retrieve volume levels. Compression ${this.analysis.compressionMode}.`);
		}

		if (this.current.length) {
			this.throttlePaint();
		} else {
			console.log(`${this.analysis.binaryMode}: failed analyzing the file -> ${sourceFile}`);
		}
	}

	/**
	 * Generates the command to run based on the binary mode.
	 * @param {string} handleFileName - The name of the file being processed.
	 * @param {string} handleFolder - The folder containing the file being processed.
	 * @param {string} waveformBarFolder - The folder where the waveform bar data should be saved.
	 * @returns {string} The command to run.
	 */
	analyzeDataGetCommand(handleFileName, handleFolder, waveformBarFolder) {
		if (!this.isAllowedFile || this.fallbackMode.analysis) return '';

		const commands = {
			audiowaveform: () => {
				const extension = handleFileName.match(/(?:\.)(\w+$)/i)[1];

				return `CMD /C PUSHD ${Quotes(handleFolder)} && ` +
					Quotes(this.binaries.audiowaveform) + ' -i ' + Quotes(handleFileName) +
					' --pixels-per-second ' + (Math.round(this.analysis.resolution) || 1) + ' --input-format ' + extension + ' --bits 8' +
					' -o ' + Quotes(`${waveformBarFolder}data.json`);
			},
			ffprobe: () => {
				handleFileName = handleFileName.replace(/[,:%.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, '\\\\\\\'');

				return `CMD /C PUSHD ${Quotes(handleFolder)} && ` +
					Quotes(this.binaries.ffprobe) + ' -hide_banner -v panic -f lavfi -i amovie=' + Quotes(handleFileName) +
					(this.analysis.resolution > 1 ? `,aresample=${Math.round((this.analysis.resolution || 1) * 100)},asetnsamples=${Math.round((this.analysis.resolution / 10) ** 2)}` : '') +
					',astats=metadata=1:reset=1 -show_entries frame=pkt_pts_time:frame_tags=lavfi.astats.Overall.Peak_level,lavfi.astats.Overall.RMS_level,lavfi.astats.Overall.RMS_peak -print_format json > ' +
					Quotes(`${waveformBarFolder}data.json`);
			}
		};

		return commands[this.analysis.binaryMode]();
	}

	/**
	 * Runs the command and waits for it to complete.
	 * @param {string} cmd - The command to run.
	 * @param {string} waveformBarFolder - The folder where the waveform bar data should be saved.
	 * @param {number} trackLength - The length of the track being processed.
	 * @returns {Promise<boolean>} The promise that resolves to true if the command completed successfully, false otherwise.
	 */
	async analyzeDataRunCommand(cmd, waveformBarFolder, trackLength) {
		const processed = RunCmd(cmd, false);

		return processed && (await new Promise((resolve) => {
			if (this.isFallback || this.analysis.binaryMode === 'visualizer' || this.fallbackMode.analysis) {
				resolve(true);
			}

			const timeout = Date.now() + Math.round(10000 * (trackLength / 180));

			const id = setInterval(() => {
				if (IsFile(`${waveformBarFolder}data.json`)) {
					if (JsonParseFile(`${waveformBarFolder}data.json`, this.codePage)) {
						clearInterval(id);
						resolve(true);
					}
				} else if (Date.now() > timeout) {
					clearInterval(id);
					resolve(false);
				}
			}, 300);
		}));
	}

	/**
	 * Processes the data generated by the command.
	 * @param {FbMetadbHandle} handle - The handle to analyze.
	 * @param {string} waveformBarFile - The name of the waveform bar file.
	 * @param {object} data - The data generated by the command.
	 */
	analyzeDataProcess(handle, waveformBarFile, data) {
		const processFFProbeData = (frames) => frames.map(frame => {
			const getTagValue = (tag) => tag === '-inf' ? -Infinity : Round(Number(tag), 1);
			return [
				Round(Number(frame.pkt_pts_time), 2),
				getTagValue(frame.tags['lavfi.astats.Overall.RMS_level']),
				getTagValue(frame.tags['lavfi.astats.Overall.RMS_peak']),
				getTagValue(frame.tags['lavfi.astats.Overall.Peak_level'])
			];
		});

		let processedData = null;

		// * Process data
		if (!this.isFallback && !this.fallbackMode.analysis) {
			if (this.analysis.binaryMode === 'ffprobe' && data.frames && data.frames.length) {
				processedData = processFFProbeData(data.frames);
			}
			else if (this.analysis.binaryMode === 'audiowaveform' && data.data && data.data.length) {
				processedData = data.data;
			}
		}
		else if ((this.analysis.binaryMode === 'visualizer' || this.isFallback || this.fallbackMode.analysis) && data.length) {
			processedData = data;
		}

		// * Save compressed data
		if (processedData !== null) {
			this.current = processedData;
			if (this.saveDataAllowed(handle)) {
				this.analyzeDataSave(waveformBarFile, JSON.stringify(this.current));
			}
		}
	}

	/**
	 * Saves the compressed data to a file.
	 * @param {string} waveformBarFile - The name of the waveform bar file.
	 * @param {string} dataStr - The data to be saved.
	 */
	analyzeDataSave(waveformBarFile, dataStr) {
		if (this.analysis.binaryMode === 'visualizer') return;

		const binaryExt = { ffprobe: 'ff', audiowaveform: 'aw' };
		const fileName = `${waveformBarFile}.${binaryExt[this.analysis.binaryMode]}`;

		const compression = {
			'utf-16': () => SaveFSO(`${fileName}.lz16`, LZString.compressToUTF16(dataStr), true),
			'utf-8':  () => Save(`${fileName}.lz`, LZUTF8.compress(dataStr, { outputEncoding: 'Base64' })),
			'none':   () => Save(`${fileName}.json`, dataStr)
		};

		(compression[this.analysis.compressionMode] || compression.none)();
	}

	/**
	 * Generates data for the visualizer.
	 * @param {FbMetadbHandle} handle - The handle to analyze.
	 * @param {string} preset - The preset to use for the visualizer.
	 * @param {boolean} variableLen - The flag whether the length of the data should be variable.
	 * @returns {Array} The data for the visualizer bar.
	 */
	visualizerData(handle, preset = 'classic spectrum analyzer', variableLen = false) {
		const resolution = this.analysis.resolution || 1;
		const samples = Math.max(0, Math.floor(variableLen ? handle.Length * resolution : this.w / SCALE(5) * resolution));
		const data = new Array(samples);

		if (preset === 'classic spectrum analyzer') {
			const third = Math.round(samples / 3);
			const half = Math.round(samples / 2);

			// * Filling first half
			for (let i = 0; i < third; i++) {
				const val = (Math.random() * i) / third;
				data[i] = val;
			}
			for (let i = third; i < half; i++) {
				const val = (Math.random() * i) / third;
				data[i] = val;
			}
			// * Filling second half with reversed first half
			for (let i = half, j = 0; i < samples; i++, j++) {
				data[i] = data[half - 1 - j];
			}
		}

		return data;
	}

	/**
	 * Checks if the processed data is valid.
	 * @returns {boolean} True if the data is valid.
	 */
	validData() {
		if (!Array.isArray(this.current) || !this.current.length) {
			return false; // When iterating too many tracks in a short amount of time, weird things may happen without this check
		}

		const checkFrame =
			this.analysis.binaryMode === 'ffprobe' ? (frame) => {
				const len = Object.prototype.hasOwnProperty.call(frame, 'length') ? frame.length : null;
				return len === 4 || len === 5;
			} : (frame) => frame >= -128 && frame <= 127;

		return this.current.every(checkFrame);
	}

	/**
	 * Verifies if the processed data is valid.
	 * @param {FbMetadbHandle} handle - The handle to analyze.
	 * @param {string} file - The file to analyze.
	 * @param {boolean} isRetry - The flag whether the data should be retried.
	 * @returns {boolean} True if the data is valid.
	 */
	verifyData(handle, file, isRetry = false) {
		if (this.validData()) return true;

		if (file) DeleteFile(file);

		if (isRetry) {
			console.log('File was not successfully analyzed after retrying.');
			this.isAllowedFile = false;
			this.isFallback = this.analysis.visualizerFallback;
			this.isError = true;
			this.current = [];
		} else {
			console.log(`Waveform bar file not valid. Creating new one${file ? `: ${file}` : '.'}`);
			this.on_playback_new_track(handle, true);
		}

		return false;
	}

	/**
	 * Deletes the waveform bar cache diretory with its processed data.
	 */
	removeData() {
		DeleteFolder(this.cacheDir);
	}

	/**
	 * Determines whether data should be saved based on the current analysis save mode and the handle.
	 * @param {FbMetadbHandle} handle - The handle to check against the save mode and media library.
	 * @returns {boolean} - Returns `true` if the data should be saved, `false` otherwise.
	 */
	saveDataAllowed(handle) {
		return this.analysis.saveMode === 'always' || (this.analysis.saveMode === 'library' && handle && fb.IsMetadbInMediaLibrary(handle));
	}
	// #endregion

	// * PUBLIC METHODS - COMMON * //
	// #region PUBLIC METHODS - COMMON
	/**
	 * Sets the max step based on the BPM of the track.
	 * @param {object} handle - The handle of the track.
	 * @returns {number} The max steps.
	 */
	bpmSteps(handle = fb.GetNowPlaying()) {
		if (!handle) return this.defaultSteps();

		// Don't allow anything faster than 2 steps or slower than 10 (scaled to 200 ms refresh rate) and consider setting tracks having 100 BPM as default.
		const BPM = Number(this.TfMaxStep.EvalWithMetadb(handle));
		this.maxStep = Math.round(Math.min(Math.max(200 / (BPM || 100) * 2, 2), 10) * (200 / this.ui.refreshRate) ** (1 / 2));

		return this.maxStep;
	}

	/**
	 * Sets the max step to a default value.
	 * @returns {number} The max steps.
	 */
	defaultSteps() {
		this.maxStep = Math.round(4 * (200 / this.ui.refreshRate) ** (1 / 2));
		return this.maxStep;
	}

	/**
	 * Gets the bar width based on the bar design preset.
	 * @returns {number} The width of the bar corresponding to the design preset.
	 */
	getBarWidth() {
		const barWidth = {
			waveform: this.ui.sizeWave,
			bars:     this.ui.sizeBars,
			dots:     this.ui.sizeDots,
			halfbars: this.ui.sizeHalf
		};

		return barWidth[this.preset.barDesign] || 1;
	}

	/**
	 * Gets the colors for the waveform bars.
	 * @param {boolean} useShadeColor - The flag indicating whether to use the ShadeColor for adjustments.
	 * @param {boolean} highlightCurrentPosition - The flag indicating whether to highlight the current position indicator.
	 * @returns {object} The object containing colorBack, colorFront and colorsDiffer.
	 */
	getColors(useShadeColor = true, highlightCurrentPosition = false) {
		if (highlightCurrentPosition && (this.preset.indicator || this.mouseDown) && this.analysis.binaryMode !== 'ffprobe' &&
			(this.frameX <= this.currX && this.frameX >= this.currX - 2 * this.barW)) {
			return { colorBack: grCol.waveformBarIndicator, colorFront: grCol.waveformBarIndicator, colorsDiffer: false };
		}

		const colorBack = this.prepaint && this.isPrepaint ?
			useShadeColor ? ShadeColor(grCol.waveformBarFillBack, 40) : grCol.waveformBarFillPreBack :
			grCol.waveformBarFillBack;

		const colorFront = this.prepaint && this.isPrepaint ?
			useShadeColor ? ShadeColor(grCol.waveformBarFillFront, 20) : grCol.waveformBarFillPreFront :
			grCol.waveformBarFillFront;

		return { colorBack, colorFront, colorsDiffer: colorFront !== colorBack };
	}

	/**
	 * Gets ffprobe for Windows or Linux.
	 */
	getFFprobe() {
		const url = Detect.Win64 ?
			'https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip' :
			'https://github.com/sudo-nautilus/FFmpeg-Builds-Win32/releases/download/latest/ffmpeg-master-latest-win32-gpl.zip';

		RunCmd(url);
		fb.ShowPopupMessage(`Accept download, extract ffprobe.exe from bin to ${this.binaries.ffprobe}\nand restart foobar.`, 'FFprobe');
	}

	/**
	 * Gets the configuration for the different file types to be analyzed.
	 * @returns {Array<object>} An array of file configuration objects. Each object contains:
	 * - {string} ext - The file extension.
	 * - {Function} decompress - The function to decompress and parse the file content.
	 * - {string} codePage - The code page to be used when reading the file.
	 */
	getFileConfigs() {
		return [
			{ ext: '.ff.json', decompress: JSON.parse, codePage: this.codePage },
			{ ext: '.ff.lz',   decompress: str => JSON.parse(LZUTF8.decompress(str, { inputEncoding: 'Base64' })), codePage: this.codePage },
			{ ext: '.ff.lz16', decompress: str => JSON.parse(LZString.decompressFromUTF16(str)), codePage: this.codePageV2 },
			{ ext: '.aw.json', decompress: JSON.parse, codePage: this.codePage },
			{ ext: '.aw.lz',   decompress: str => JSON.parse(LZUTF8.decompress(str, { inputEncoding: 'Base64' })), codePage: this.codePage },
			{ ext: '.aw.lz16', decompress: str => JSON.parse(LZString.decompressFromUTF16(str)), codePage: this.codePageV2 }
		];
	}

	/**
	 * Gets the paths to the waveform bar cache folder and file.
	 * @param {object} handle - The handle of the track.
	 * @returns {object} The paths to the waveform bar cache folder and file.
	 */
	getPaths(handle) {
		const id = CleanFilePath(this.Tf.EvalWithMetadb(handle)); // Ensures paths are valid!
		const fileName = id.split('\\').pop();
		const waveformBarFolder = this.cacheDir + (this.saveDataAllowed(handle) ? id.replace(fileName, '') : '');
		const waveformBarFile = this.cacheDir + id;
		const sourceFile = this.isZippedFile ? handle.Path.split('|')[0] : handle.Path;

		return { waveformBarFolder, waveformBarFile, sourceFile };
	}

	/**
	 * Gets the maximum and minimum values from the frames.
	 * @param {number[]} frames - The array of frame values.
	 * @returns {object} The object containing the `upper` and `lower` values.
	 */
	getMaxValue(frames) {
		let upper = 0;
		let lower = 0;

		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i];
			upper = Math.max(upper, frame);
			lower = Math.min(lower, frame);
		}

		return { upper, lower };
	}

	/**
	 * Gets the minimum value at a specific position in the frames.
	 * @param {Array} frames - The array of frame data.
	 * @param {number} pos - The position index in the frame data.
	 * @returns {number} The minimum value at the specified position.
	 */
	getMinValuePos(frames, pos) {
		let minVal = Infinity;

		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i];
			if (frame[pos] === null) frame[pos] = -Infinity;
			const val = frame[pos];
			if (isFinite(val)) {
				minVal = Math.min(minVal, val);
			}
		}

		return minVal === Infinity ? 0 : minVal;
	}

	/**
	 * Gets the Normalized frame values by subtracting the maximum value from each frame.
	 * @param {Array} frames - The array of frame data.
	 * @param {number} maxVal - The maximum value to be subtracted from each frame.
	 * @returns {Array} The normalized frame data.
	 */
	getNormalizedFrameValues(frames, maxVal) {
		const normalizedFrames = new Array(frames.length);

		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i];
			const newFrame = frame.slice();

			if (newFrame[4] !== 1) newFrame[4] -= maxVal;
			if (!isFinite(newFrame[4])) newFrame[4] = 0;

			normalizedFrames[i] = newFrame;
		}

		return normalizedFrames;
	}

	/**
	 * Gets the scaled frames based on the given position, maximum value, and level type.
	 * @param {Array} frames - The array of frame data.
	 * @param {number} pos - The position index in the frame data to be scaled.
	 * @param {number} max - The maximum value for scaling.
	 * @param {boolean} isRmsLevel - Whether if RMS level scaling should be applied.
	 * @returns {Array} The scaled frame data.
	 */
	getScaledFrames(frames, pos, max, isRmsLevel) {
		const scaledFrames = new Array(frames.length);
		const logMax = Math.log(Math.abs(max));

		for (let i = 0; i < frames.length; i++) {
			const frame = frames[i];
			const value = isFinite(frame[pos]) ? frame[pos] : -Infinity;

			let scaledVal =
				!isFinite(value) ? 1 :
				isRmsLevel ? 1 - Math.abs((value - max) / max) :
				Math.abs(1 - (logMax + Math.log(Math.abs(value))) / logMax);

			if (!isFinite(scaledVal)) scaledVal = 0;

			const newFrame = frame.slice(0, 4);
			newFrame.push(scaledVal);
			scaledFrames[i] = newFrame;
		}

		return scaledFrames;
	}

	/**
	 * Gets the resized frames based on the given scale and new frame count.
	 * @param {number} scale - The scale factor for resizing.
	 * @param {number} frames - The current number of frames.
	 * @param {number} newFrames - The desired number of frames after resizing.
	 * @returns {Array} The resized frame data.
	 */
	getResizedFrames(scale, frames, newFrames) {
		const data = Array(newFrames).fill(null).map(() => ({ val: 0, count: 0 }));
		const scaleFactor = newFrames < frames ? frames / newFrames : newFrames / frames;

		for (let i = 0, j = 0, h = 0; i < frames; i++) {
			const frame = this.current[i];

			if (newFrames < frames) {
				while (h >= scaleFactor) {
					const w = h - scaleFactor;
					if (j + 1 < newFrames) {
						data[j + 1].val += frame * w;
						data[j + 1].count += w;
					}
					j += 2;
					h = 0;
					if (j >= newFrames) break;
					data[j].val += frame * (1 - w);
					data[j].count += (1 - w);
				}
				if (i % 2 === 0 && j + 1 < newFrames) {
					data[j + 1].val += frame;
					data[j + 1].count++;
				} else {
					data[j].val += frame;
					data[j].count++;
					h++;
				}
			}
			else {
				while (h < scaleFactor && j < newFrames) {
					data[j].val += frame;
					data[j].count++;
					j++;
					h++;
				}
				h -= scaleFactor;
			}
		}

		return data.filter(el => el.count > 0).map(el => el.val / el.count);
	}

	/**
	 * Normalizes points to ensure all points are on the same scale to prevent distortion of the waveform.
	 * @param {boolean} normalizeWidth - If `true`, adjusts the number of frames to match the window size.
	 */
	normalizePoints(normalizeWidth = false) {
		if (!this.current.length) return;

		let { upper, lower } = this.getMaxValue(this.current);

		if (!this.isFallback && !this.fallbackMode.paint && this.analysis.binaryMode === 'ffprobe') {
			const { pos } = this.ffprobeMode[this.preset.analysisMode];
			const minVal = this.getMinValuePos(this.current, pos);

			this.current = this.getScaledFrames(this.current, pos, minVal, this.preset.analysisMode === 'rms_level');
			this.current = this.getNormalizedFrameValues(this.current, Math.min(...this.current.map(frame => frame[4])));
			this.current = this.current.map((x, i) => Math.sign((0.5 - i % 2)) * (1 - x[4]));
		}
		else if (['audiowaveform', 'visualizer'].includes(this.analysis.binaryMode) || this.isFallback || this.fallbackMode.paint) {
			const maxVal = Math.max(Math.abs(upper), Math.abs(lower));
			this.current = this.current.map(frame => frame / maxVal);
		}

		if (normalizeWidth) {
			const barW = this.getBarWidth();
			const frames = this.current.length;
			const newFrames = Math.floor(this.w / barW);

			if (newFrames === frames) return;

			this.current = this.getResizedFrames(frames / newFrames, frames, newFrames);

			const bias = Math.abs(upper / lower);
			upper = lower = 0;
			({ upper, lower } = this.getMaxValue(this.current));
			const newBias = Math.abs(upper / lower);
			const biasDiff = bias - newBias;

			if (biasDiff > 0.1) {
				const distort = bias / newBias;
				const sign = Math.sign(biasDiff);
				this.current = this.current.map(frame => (sign === 1 && frame > 0) || (sign !== 1 && frame < 0) ? frame * distort : frame);
			}
		}
	}

	/**
	 * Resets the state of the waveform bar.
	 */
	reset() {
		this.current = [];
		this.cache = null;
		this.time = 0;
		this.step = 0;
		this.maxStep = 6;
		this.offset = [];
		this.isAllowedFile = true;
		this.isZippedFile = false;
		this.isError = false;
		this.isFallback = false;
		this.fallbackMode.paint = this.fallbackMode.analysis = false;
		this.resetAnimation();
		clearTimeout(this.queueId);
	}

	/**
	 * Resets the state of the waveform bar animation.
	 */
	resetAnimation() {
		this.step = 0;
		this.offset = [];
		this.defaultSteps();
	}

	/**
	 * Sets the refresh rate for the waveform bar.
	 */
	setRefreshRate() {
		if (grm.ui.isStreaming) { // Radio streaming refresh rate
			this.ui.refreshRate = grm.ui.seekbarTimerInterval = FPS._1;
		}
		else if (grSet.waveformBarRefreshRate !== 'variable') { // Fixed refresh rate
			this.ui.refreshRate = grm.ui.seekbarTimerInterval = grSet.waveformBarRefreshRate;
		}
		else { // Variable refresh rate calculation
			const now = Date.now();
			if (this.updateTimeLast && (now - this.updateTimeLast) < 250) return; // Check every 250 ms
			this.updateTimeLast = now;

			if (this.profilerPaintTimeLast === undefined) {
				this.profilerPaintTimeLast = grm.ui.seekbarProfiler.Time;
			}

			const timeDifference = grm.ui.seekbarProfiler.Time - this.profilerPaintTimeLast;
			this.ui.refreshRate = grm.ui.seekbarTimerInterval = Clamp(grm.ui.seekbarTimerInterval + (timeDifference > 0 ? 12 : -7), FPS._10, FPS._5);
			this.profilerPaintTimeLast = grm.ui.seekbarProfiler.Time;

			grm.ui.clearTimer('seekbar', true);
			grm.ui.seekbarTimer = !fb.IsPaused ? setInterval(() => grm.ui.refreshSeekbar(), grm.ui.seekbarTimerInterval) : null;
		}
	}

	/**
	 * Sets the rectangular area to be painted.
	 * @param {number} time - The current playback time.
	 * @returns {{ x: number, y: number, width: number, height: number }} The object containing the dimensions of the rectangle to be painted.
	 */
	setPaintRect(time) {
		const widerModesScale = ['bars', 'halfbars'].includes(this.preset.barDesign) ? 2 : 1;
		const barW = Math.ceil(Math.max(this.w / this.current.length, SCALE(2))) * widerModesScale;
		const currX = this.x + (this.w * time / fb.PlaybackLength);

		const prePaintW = Math.min(
			this.prepaint && this.preset.prepaintFront !== Infinity || this.preset.animate
				? this.preset.prepaintFront === Infinity && this.preset.animate
					? Infinity
					: (this.preset.prepaintFront / this.timeConstant * barW) + barW
				: 2.5 * barW,
			this.w - currX + barW
		);

		return {
			x: currX - barW - grm.ui.edgeMargin,
			y: this.y,
			width: prePaintW + grm.ui.edgeMarginBoth,
			height: this.h
		};
	}

	/**
	 * Sets the throttle paint methods based on the current UI refresh rate.
	 */
	setThrottlePaint() {
		/**
		 * Throttles the window repaint to improve performance by limiting the rate of repaint operations.
		 * This function is specifically tailored to repaint a defined rectangular area of the window.
		 * The repaint is controlled by the UI refresh rate.
		 * @param {boolean} [force] - If set to true, the repaint will be forced even if the window is not dirty.
		 * @private
		 */
		this.throttlePaint = Throttle((force = false) =>
			window.RepaintRect(this.x - SCALE(2), this.y - this.h * 0.5 - SCALE(4), this.w + SCALE(4), this.h + SCALE(8), force), this.ui.refreshRate);

		/**
		 * Throttles the window repaint to improve performance by limiting the rate of repaint operations.
		 * This function allows for the specification of the rectangular area to be repainted.
		 * The repaint is controlled by the UI refresh rate.
		 * @param {number} x - The x-coordinate of the upper-left corner of the rectangle to repaint.
		 * @param {number} y - The y-coordinate of the upper-left corner of the rectangle to repaint.
		 * @param {number} w - The width of the rectangle to repaint.
		 * @param {number} h - The height of the rectangle to repaint.
		 * @param {boolean} [force] - If set to true, the repaint will be forced even if the window is not dirty.
		 * @private
		 */
		this.throttlePaintRect = Throttle((x, y, w, h, force = false) =>
			window.RepaintRect(x - SCALE(2), y - h * 0.5 - SCALE(4), w + SCALE(4), h + SCALE(8), force), this.ui.refreshRate);
	}

	/**
	 * Sets the vertical waveform bar position.
	 * @param {number} y - The y-coordinate.
	 */
	setY(y) {
		this.y = y + SCALE(10);
	}

	/**
	 * This method is currently not used.
	 * @param {boolean} [enable] - If true, activates the component; if false, deactivates it.
	 */
	switch(enable = !this.active) {
		if (!fb.IsPlaying) return;

		const wasActive = this.active;
		this.active = enable;

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

	/**
	 * Checks if the mouse is within the boundaries of the waveform bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return (x >= this.x && y >= this.y && x <= this.x + this.w && y <= this.y + this.h);
	}

	/**
	 * Updates the waveform bar with the current track information, playback time and size.
	 * @param {boolean} current - Whether the current track has changed or not.
	 */
	updateBar(current) {
		if (!current) this.on_playback_new_track(fb.GetNowPlaying());
		this.on_playback_time(fb.PlaybackTime);
		this.on_size(grm.ui.ww, grm.ui.wh);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Handles left mouse button up click events and disables dragging and updates the playback time.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} mask - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_up(x, y, mask) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar) ||
			!this.active || !this.trace(x, y) || !fb.IsPlaying || this.current.length === 0) {
			this.mouseDown = false;
			return false;
		}

		this.mouseDown = false;

		if (!fb.GetSelection()) return;

		const barW = this.w / this.current.length;
		const time = Math.round(fb.PlaybackLength / this.current.length * (x - this.x) / barW);
		fb.PlaybackTime = Clamp(time, 0, fb.PlaybackLength);
		this.throttlePaint(true);

		return true;
	}

	/**
	 * Handles mouse movement events on the waveform bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} mask - The mouse mask.
	 */
	on_mouse_move(x, y, mask) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar)) {
			return;
		}

		this.mouseDown = (mask === MouseKey.LButton && this.on_mouse_lbtn_up(x, y, mask));
	}

	/**
	 * Handles the mouse wheel event to seek through the playback.
	 * @param {number} step - The wheel scroll direction.
	 * @returns {boolean} True or false.
	 */
	on_mouse_wheel(step) {
		if (!this.active || !fb.GetSelection() || !fb.IsPlaying || this.current.length === 0) {
			return false;
		}

		const seekType = {
			seconds:    (scroll) => scroll * this.wheel.seekSpeed,
			percentage: (scroll) => (scroll * this.wheel.seekSpeed) / 100 * fb.PlaybackLength
		};

		const seekTypeFunc = seekType[this.wheel.seekType] || seekType.seconds;
		const newTime = fb.PlaybackTime + seekTypeFunc(step);
		fb.PlaybackTime = Clamp(newTime, 0, fb.PlaybackLength);
		this.throttlePaint(true);

		return true;
	}

	/**
	 * Resets the current waveform and processes new data for the new current playing track.
	 * @param {FbMetadbHandle} handle - The handle of the new track.
	 * @param {boolean} [isRetry] - The flag indicating whether the method call is a retry attempt.
	 * @returns {Promise<void>} The promise that resolves when the processing has finished.
	 */
	async on_playback_new_track(handle = fb.GetNowPlaying(), isRetry = false) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar) || !this.active || !handle) {
			return;
		}

		this.reset();
		this.checkAllowedFile(handle);
		await this.analyzeDataStart(handle, isRetry);
		this.resetAnimation();

		if (this.preset.animate && this.preset.useBPM) this.bpmSteps(handle);
		if (fb.IsPlaying) this.time = fb.PlaybackTime;

		this.throttlePaint();
	}

	/**
	 * Schedules the `on_playback_new_track` event to be triggered after a specified delay.
	 * This is useful for debouncing the event, ensuring it is fired only once after a series of track changes.
	 */
	on_playback_new_track_queue() {
		clearTimeout(this.queueId);

		this.queueId = setTimeout(() => {
			this.on_playback_new_track(...arguments);
		}, this.queueMs);
	}

	/**
	 * Resets the waveform bar on playback stop.
	 * @param {number} reason - The type of playback stop.
	 */
	on_playback_stop(reason = -1) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar) || reason !== -1 && !this.active) {
			return;
		}

		this.reset();
		if (reason !== 2) this.throttlePaint();
	}

	/**
	 * Updates the waveform bar with throttled repaints.
	 * @param {number} time - The current playback time.
	 */
	on_playback_time(time) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar) || !this.active) {
			return;
		}

		this.time = time;

		if ((this.preset.paintMode === 'full' || this.preset.indicator || this.analysis.binaryMode === 'visualizer') &&
			this.cache === this.current) {
			return;
		}

		this.cache = this.current;

		if (this.analysis.binaryMode === 'visualizer' || !this.current.length) {
			this.throttlePaint();
		}
		else if (this.preset.paintMode === 'partial' || this.preset.indicator) {
			const paintRect = this.setPaintRect(this.time);
			this.throttlePaintRect(paintRect.x, paintRect.y, paintRect.width, paintRect.height);
		}
	}

	/**
	 * Handles the waveform bar state when reloading the theme.
	 */
	on_script_unload() {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar)) return;
		if (this.analysis.autoDelete) this.removeData();
	}

	/**
	 * Sets the size and position of the waveform bar and updates them on window resizing.
	 * @param {number} w - The width of the waveform bar.
	 * @param {number} h - The height of the waveform bar.
	 */
	on_size(w, h) {
		if (['progressbar', 'peakmeterbar'].includes(grSet.seekbar)) return;
		this.x = grm.ui.edgeMargin;
		this.y = 0;
		this.w = w - grm.ui.edgeMarginBoth;
		this.h = grm.ui.seekbarHeight;
	}
	// #endregion
}
