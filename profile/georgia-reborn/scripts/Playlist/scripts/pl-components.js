/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Components                      * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-10-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////////
// * PLAYLIST LINKED LIST * //
//////////////////////////////
/**
 * A class that represents a LinkedList data structure that's generic over T.
 * @template T The type of elements in the linked list.
 */
class PlaylistLinkedList {
	/**
	 * Creates the `PlaylistLinkedList` instance.
	 */
	constructor() {
		/** @private @type {?PlaylistLinkedListNode<T>} */
		this._back = null;
		/** @private @type {?PlaylistLinkedListNode<T>} */
		this._front = null;
		/** @private @type {number} */
		this._size = 0;
		/** @private @type {PlaylistLinkedListNode<T>} End sentinel node */
		this.end_node = new PlaylistLinkedListNode(null, null, null);
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Adds a node to a linked list and updates the previous and next pointers accordingly.
	 * @param {PlaylistLinkedListNode} node - A node in a linked list.
	 * @private
	 */
	_add_node(node) {
		if (node.prev) {
			node.prev.next = node;
		}
		else {
			this._front = node;
		}

		if (node.next) {
			node.next.prev = node;
		}
		else {
			this._back = node;
		}

		++this._size;
	}

	/**
	 * Removes a node from a linked list and updates the previous and next pointers accordingly.
	 * @param {?PlaylistLinkedListNode} node - A node in a linked list.
	 * @private
	 */
	_remove_node(node) {
		if (!node) {
			return;
		}

		if (node.prev) {
			node.prev.next = node.next;
		}
		else {
			this._front = node.next;
		}

		if (node.next) {
			node.next.prev = node.prev;
		}
		else {
			this._back = node.prev;
		}

		--this._size;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Pushes a new value to the back of the queue.
	 * @param {T} value - The value to push.
	 */
	push_back(value) {
		this._add_node(new PlaylistLinkedListNode(value, this._back, null));
	}

	/**
	 * Pushes a new value to the front of the queue.
	 * @param {T} value - The value to push.
	 */
	push_front(value) {
		this._add_node(new PlaylistLinkedListNode(value, null, this._front));
	}

	/**
	 * Removes the node at the front of the linked list and returns its value.
	 */
	pop_front() {
		this._remove_node(this._front);
	}

	/**
	 * Removes the node at the back of the linked list and returns its value.
	 */
	pop_back() {
		this._remove_node(this._back);
	}

	/**
	 * Gets the value at the front of the queue.
	 * @returns {T} The value at the front of the queue.
	 */
	front() {
		return this._front.value;
	}

	/**
	 * Gets the value at the back of the queue.
	 * @returns {T} The value at the back of the queue.
	 */
	back() {
		return this._back.value;
	}

	/**
	 * Gets the number of elements in the queue.
	 * @returns {number} The number of elements in the queue.
	 */
	length() {
		return this._size;
	}

	/**
	 * Gets an iterator for the beginning of the queue.
	 * @returns {PlaylistLinkedListIterator<T>} An iterator for the beginning of the queue.
	 */
	begin() {
		return new PlaylistLinkedListIterator(this, this._front || this.end_node);
	}

	/**
	 * Gets an iterator for the end of the queue.
	 * @returns {PlaylistLinkedListIterator<T>} An iterator for the end of the queue.
	 */
	end() {
		return new PlaylistLinkedListIterator(this, this.end_node);
	}

	/**
	 * Clears all elements from the linked list.
	 * @returns {void}
	 */
	clear() {
		this._back = null;
		this._front = null;
		this._size = 0;
	}

	/**
	 * Removes the value at the given iterator.
	 * @param {PlaylistLinkedListIterator<T>} iterator - The iterator to remove.
	 * @throws {InvalidTypeError} Throws an InvalidTypeError if the provided argument is not an instance of PlaylistLinkedListIterator.
	 * @throws {LogicError} Throws a LogicError if the iterator belongs to a different list.
	 * @throws {LogicError} Throws a LogicError if trying to remove an iterator that points to the end of the list.
	 */
	remove(iterator) {
		if (!(iterator instanceof PlaylistLinkedListIterator)) {
			throw new InvalidTypeError(iterator, typeof iterator, 'Iterator');
		}

		if (iterator.parent !== this) {
			throw new LogicError('Using iterator from a different list');
		}

		if (iterator.compare(this.end())) {
			throw new LogicError('Removing invalid iterator');
		}

		this._remove_node(iterator.cur_node);

		iterator.cur_node = this.end_node;
	}
	// #endregion
}


/**
 * A class that encapsulates a linked list iterator and is used to iterate through the list.
 */
class PlaylistLinkedListIterator {
	/**
	 * Creates the `PlaylistLinkedListIterator` instance.
	 * @param {PlaylistLinkedList} parent - The parent of the node.
	 * @param {PlaylistLinkedListNode} node - The node that is pointed to by the iterator.
	 */
	constructor(parent, node) {
		/** @private @type {PlaylistLinkedList} */
		this.parent = parent;
		/** @private @type {PlaylistLinkedListNode} */
		this.cur_node = node;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets the value of the current element.
	 * @returns {*} The value of the current element.
	 * @throws {LogicError} Throws a LogicError if trying to access the value of the end node.
	 */
	value() {
		if (this.cur_node === this.parent.end_node) {
			throw new LogicError('Accessing end node');
		}

		return this.cur_node.value;
	}

	/**
	 * Increments the iterator to the next element.
	 * @returns {void}
	 * @throws {LogicError} Throws a LogicError if the iterator is out of bounds when incrementing.
	 */
	increment() {
		if (this.cur_node === this.parent.end_node) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node.next;
		if (!this.cur_node) {
			this.cur_node = this.parent.end_node;
		}
	}

	/**
	 * Decrements the iterator to the previous element.
	 * @returns {void}
	 * @throws {LogicError} Throws a LogicError if the iterator is out of bounds when decrementing.
	 */
	decrement() {
		if (this.cur_node === this.parent._front) {
			throw new LogicError('Iterator is out of bounds');
		}

		this.cur_node = this.cur_node === this.parent.end_node ? this.parent._back : this.cur_node.prev;
	}

	/**
	 * Compares this iterator to another iterator to check if they are at the same position.
	 * @param {PlaylistLinkedListIterator} iterator - The other iterator to compare to.
	 * @returns {boolean} True if both iterators point to the same node, false otherwise.
	 * @throws {LogicError} Throws a LogicError if comparing iterators from different lists.
	 */
	compare(iterator) {
		if (iterator.parent !== this.parent) {
			throw new LogicError('Comparing iterators from different lists');
		}
		return iterator.cur_node === this.cur_node;
	}
	// #endregion
}


/**
 * A class that defines a Node class for the linked list.
 * @template T The type of the value stored in the node.
 */
class PlaylistLinkedListNode {
	/**
	 * Creates the `PlaylistLinkedListNode` instance.
	 * @param {T} value - The value of the node.
	 * @param {?PlaylistLinkedListNode<T>} prev - The previous node in the linked list.
	 * @param {?PlaylistLinkedListNode<T>} next - The next node in the linked list.
	 */
	constructor(value, prev = null, next = null) {
		this.value = value;
		this.prev = prev;
		this.next = next;
	}
}


//////////////////////////////////
// * PLAYLIST BATCH PROCESSOR * //
//////////////////////////////////
/**
 * A class that processes the playlist content in batches to optimize performance.
 * It adjusts the size of each batch based on the processing time of the previous batch to approach a target time.
 */
class PlaylistBatchProcessor {
	/**
	 * Creates a `PlaylistBatchProcessor` instance and initializes parameters.
	 * The initial batch size is set to ~1000 tracks to optimize startup performance.
	 */
	constructor() {
		/** @private @type {boolean} Indicates if the current batch is the first one. */
		this.batchIsFirst = true;
		/** @private @type {number} The minimum size of a batch. */
		this.batchSizeMin = 1000;
		/** @private @type {number} The maximum size of a batch. */
		this.batchSizeMax = 50000;
		/** @private @type {number} The current size of the batch. */
		this.batchSizeCurrent = 1000;
		/** @private @type {number} The target duration for batch processing in milliseconds. */
		this.batchTimeGoal = 2500;
		/** @private @type {number} The duration of the previous batch processing in milliseconds. */
		this.batchTimePrevious = 0;
		/** @private @type {number} The factor by which the batch size is increased. */
		this.batchGrowthFactor = 1.5;
		/** @private @type {number} The factor by which the batch size is decreased. */
		this.batchShrinkFactor = 0.5;
		/** @public @type {Map<string, string>} The cache of album directories to optimize batch processing. */
		this.batchAlbumDirCache = null;
		/** @public @type {Map<string, string>} The cache of processed playlists to optimize batch processing. */
		this.batchProcessedCache = new Map();
		/** @public @type {boolean} Indicates if the batch processing is complete. */
		this.batchProcessComplete = false;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Caches the album directories from the playlist items to optimize batch processing.
	 * @returns {Map<string, string>} The cache mapping each item's path to its album directory.
	 * @private
	 */
	_cacheAlbumDirs() {
		const albumDirCache = new Map();
		const items = pl.playlist.playlist_items_array;
		const multiDiscPattern = /\\(CD|Vinyl|Disc|Bonus|Vol\.?|Volume)\s*(\d+|I{1,3}|IV|V(?:I{0,3}|X)?|X{0,3})$/i;

		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			let albumPath = item.Path.substring(0, item.Path.lastIndexOf('\\'));

			if (multiDiscPattern.test(albumPath)) {
				// If the path ends with a recognized pattern, consider the parent directory as the album directory
				albumPath = albumPath.substring(0, albumPath.lastIndexOf('\\'));
			}

			albumDirCache.set(item.Path, albumPath);
		}

		return albumDirCache;
	}

	/**
	 * Initializes the album directory cache if it has not been initialized yet.
	 * @private
	 */
	_initAlbumDirCache() {
		if (!this.batchAlbumDirCache) {
			this.batchAlbumDirCache = this._cacheAlbumDirs();
		}
	}

	/**
	 * Adjusts the current batch size based on the processing time of the previous batch.
	 * Increases or decreases the batch size to optimize processing time towards the goal.
	 * @private
	 */
	_adjustBatchSize() {
		if (this.batchIsFirst) return;

		// Calculate adjustment based on time difference
		const timeDiff = this.batchTimePrevious - this.batchTimeGoal;
		const adjustmentFactor = Math.abs(timeDiff) / this.batchTimeGoal;
		const adjustment = timeDiff > 0 ?
			Math.max(1 - adjustmentFactor, this.batchShrinkFactor) :
			Math.min(1 + adjustmentFactor, this.batchGrowthFactor);

		// Apply the calculated adjustment
		this.batchSizeCurrent = Math.round(this.batchSizeCurrent * adjustment);
		this.batchSizeCurrent = Clamp(this.batchSizeCurrent, this.batchSizeMin, this.batchSizeMax);
	}

	/**
	 * Adjusts the batch time goal dynamically based on CPU performance.
	 * Modifies the `this.batchTimeGoal` to optimize processing efficiency.
	 * @returns {number} The adjusted batch time goal.
	 */
	_adjustBatchTimeGoal() {
		const performanceRatio = this.batchTimePrevious / this.batchTimeGoal;

		if (performanceRatio < 0.5) {
			this.batchTimeGoal *= 1.1; // Very fast CPU
		} else if (performanceRatio < 0.8) {
			this.batchTimeGoal *= 1.2; // Fast CPU
		} else if (performanceRatio < 1.2) {
			this.batchTimeGoal *= 1.0; // Moderate CPU
		} else if (performanceRatio < 1.5) {
			this.batchTimeGoal *= 0.8; // Slow CPU
		} else {
			this.batchTimeGoal *= 0.7; // Very slow CPU
		}

		this.batchTimeGoal = Math.ceil(Clamp(this.batchTimeGoal, 1000, 5000));
		return this.batchTimeGoal;
	}

	/**
	 * Finds the end index for the current batch, ensuring all items in the same album are processed together.
	 * @param {number} batchIndex - The start index of the current batch.
	 * @param {Map<string, string>} albumDirCache - The cached album directory paths.
	 * @param {number} totalRows - The total number of rows in the playlist.
	 * @returns {number} The calculated end index of the batch.
	 * @private
	 */
	_findBatchIndexEnd(batchIndex, albumDirCache, totalRows) {
		let batchIndexEnd = Math.min(batchIndex + this.batchSizeCurrent, totalRows);
		if (batchIndexEnd === 0) return 0; // In case the playlist is empty

		if (!albumDirCache) albumDirCache = this._cacheAlbumDirs();
		const albumPathLast = albumDirCache.get(pl.playlist.playlist_items_array[batchIndexEnd - 1].Path);

		for (; batchIndexEnd < totalRows; batchIndexEnd++) {
			const albumPathCurrent = albumDirCache.get(pl.playlist.playlist_items_array[batchIndexEnd].Path);
			if (albumPathCurrent !== albumPathLast) break;
		}

		return batchIndexEnd;
	}

	/**
	 * Schedules the processing of the next batch or completes processing if all batches are done.
	 * @param {Array} rows - The rows of the playlist to be processed.
	 * @param {number} batchIndexEnd - The end index of the current batch.
	 * @param {number} totalRows - The total number of rows in the playlist.
	 * @private
	 */
	_scheduleBatchProcessing(rows, batchIndexEnd, totalRows) {
		if (batchIndexEnd < totalRows) {
			const delayMinimum = 500; // Minimum delay to avoid too frequent batch processing
			const delayAfterStartup = 5000; // Longer initial delay to allow for system stabilization
			const delayAverage = Math.round(this.batchTimeGoal * (this.batchTimePrevious / this.batchTimeGoal) * 0.5);
			const delay = this.batchIsFirst ? delayAfterStartup : Math.max(delayMinimum, delayAverage); // Longer for the initial first batch, dynamically adjusted for subsequent batches

			console.log(`Playlist => batch schedule delay: ${delay} ms\n`);

			setTimeout(() => this.processHeaderBatches(rows, batchIndexEnd), delay);
			this.batchIsFirst = false;
			return;
		}
		// All headers have been processed and are now cached; proceed to process all headers at once.
		this._processAllHeaders();
	}

	/**
	 * Updates the playlist content after a batch has been processed.
	 * @private
	 */
	_updatePlaylistContent() {
		pl.playlist.cnt.update_items_w_size(pl.playlist.list_w);

		if (plSet.show_header) {
			pl.playlist.collapse_handler = new PlaylistCollapseHandler(/** @type {PlaylistContent} */ pl.playlist.cnt);

			pl.playlist.collapse_handler.set_callback(() => {
				pl.playlist.on_list_items_change();
			});

			if (plSet.auto_collapse) {
				pl.playlist.header_collapse();
			}
		}

		pl.playlist.on_list_items_change();
		pl.playlist.repaint();
	}

	/**
	 * Processes a specific batch of playlist items by creating a batch list and generating headers.
	 * This method handles the creation of a batch from the specified range in the playlist,
	 * adds the items to the batch, and then creates and appends the headers for these items.
	 * @param {Array} rows - The rows of the playlist to be processed.
	 * @param {number} batchIndex - The starting index of the batch in the playlist.
	 * @param {number} batchIndexEnd - The ending index of the batch in the playlist.
	 * @private
	 */
	_processBatch(rows, batchIndex, batchIndexEnd) {
		const batch = new FbMetadbHandleList();
		const batchRows = rows.slice(batchIndex, batchIndexEnd);

		for (let j = batchIndex; j < batchIndexEnd; j++) {
			batch.Add(pl.playlist.playlist_items_array[j]);
		}

		const batchHeaders = pl.playlist._create_headers(batchRows, batch);
		pl.playlist.cnt.sub_items.push(...batchHeaders);

		this._updatePlaylistContent();
	}

	/**
	 * Processes all headers in the playlist at once, typically used when batch processing is complete.
	 * @private
	 */
	_processAllHeaders() {
		const startTime = Date.now();
		const batch = new FbMetadbHandleList(pl.playlist.playlist_items_array);
		const batchHeaders = pl.playlist._create_headers(pl.playlist.cnt.rows, batch); // Check why rows argument does not work
		pl.playlist.cnt.sub_items = [];
		pl.playlist.cnt.sub_items.push(...batchHeaders);

		this._updatePlaylistContent();
		this.batchProcessedCache.set(pl.playlist.cur_playlist_idx, true);
		this.batchProcessComplete = true;
		pl.plman.reinitialize();

		console.log(`Playlist => all tracks processed (${Date.now() - startTime}ms)`);
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Processes the playlist headers in batches, starting from the specified batch index.
	 * @param {Array} rows - The rows of the playlist to be processed.
	 * @param {number} batchIndex - The starting index of the batch in the playlist.
	 * @param {boolean} batchIsFirst - Indicates if the current batch is the initial one.
	 * @returns {Array} The processed sub-items of the playlist.
	 */
	processHeaderBatches(rows, batchIndex, batchIsFirst) {
		const totalRows = pl.playlist.playlist_items_array.length;

		if (batchIsFirst) {
			this.batchSizeCurrent = 1000;
			this.batchProcessComplete = false;
			this._initAlbumDirCache();
		}

		if (this.batchProcessedCache.get(pl.playlist.cur_playlist_idx)) {
			console.log('Playlist => playlist already processed, loading from cache...');
			this._processAllHeaders();
			return pl.playlist.cnt.sub_items;
		}

		const startProcess = (batchIndex) => {
			const startTime = Date.now();
			this._adjustBatchSize();

			const batchIndexEnd = this._findBatchIndexEnd(batchIndex, this.batchAlbumDirCache, totalRows);
			console.log(`Playlist => batch processing: ${batchIndex} to ${batchIndexEnd} tracks ${this.batchIsFirst ? ' (first batch)' : ''}`);
			this._processBatch(rows, batchIndex, batchIndexEnd);
			console.log(`Playlist => batch processed:  ${batchIndexEnd} of ${totalRows} tracks (size: ${batchIndexEnd - batchIndex} - time: ${Date.now() - startTime}ms - goal: ${this.batchTimeGoal}ms)`);

			this.batchTimePrevious = Date.now() - startTime;
			this._adjustBatchTimeGoal();
			this._scheduleBatchProcessing(rows, batchIndexEnd, totalRows);
		};

		startProcess(batchIndex);
		return pl.playlist.cnt.sub_items;
	}

	/**
	 * Clears the batch caches when the playlist is modified.
	 */
	clearBatchCaches() {
		this.batchAlbumDirCache = null;
		this.batchProcessedCache.clear();
		console.log('Playlist => batch caches have been cleared.');
	}
	// #endregion
}


////////////////////////
// * PLAYLIST IMAGE * //
////////////////////////
/**
 * A class that manages playlist images and implements debouncing to limit the rate
 * at which the fetch operation is invoked.
 */
class PlaylistImage {
	/**
	 * Creates the `PlaylistImage` instance.
	 * @param {number} [debounceTime] - The number of milliseconds to delay the getHeaderArtwork call after the last invocation.
	 */
	constructor(debounceTime = 500) {
		/** @private @type {number} */
		this.debounceTime = debounceTime;
		/** @private @type {Function} */
		this.debouncedGetAlbumArt = this._debounce(this.getHeaderArtwork.bind(this));
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Creates a debounced function that delays invoking the provided function until after wait milliseconds have elapsed
	 * since the last time the debounced function was invoked. The debounced function comes with a cancel method to cancel delayed invocations.
	 * @param {Function} func - The function to debounce.
	 * @returns {Function} A new, debounced function.
	 * @private
	 */
	_debounce(func) {
		let timeout;
		return (...args) => {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, this.debounceTime);
		};
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets album art for playlist headers and is only executed if certain conditions are met.
	 * @param {Array<PlaylistHeader>} items - The array of PlaylistHeader objects for which album art needs to be fetched.
	 */
	getAlbumArt(items) {
		if (!plSet.show_album_art || plSet.use_compact_header) {
			return;
		}
		this.debouncedGetAlbumArt(items);
	}

	/**
	 * Checks if the album art is loaded for each item in the given array, and if not,
	 * retrieves the artwork asynchronously and assigns it to the item. Typically called in a debounce.
	 * @param {PlaylistHeader[]} items - The array of PlaylistHeader objects to check and potentially update with album art.
	 */
	getHeaderArtwork(items) {
		for (const item of items) {
			if (!(item instanceof PlaylistHeader)) continue;

			const { metadb } = item.get_first_row();
			const isArtLoaded = item.is_art_loaded();

			if (isArtLoaded) continue;

			const cached_art = PlaylistHeader.img_cache.get_image_for_meta(metadb);

			if (cached_art) {
				item.assign_art(cached_art);
				item.repaint();
			}
			else if (!pl.thumbnail_list.has(metadb)) {
				// TODO: Once this has been better tested, remove on_get_album_art_done callback from this file, and probably gr-callbacks.js as well
				// utils.GetAlbumArtAsync(window.ID, metadb, g_album_art_id.front);
				pl.thumbnail_list.add(metadb);
				utils.GetAlbumArtAsyncV2(window.ID, metadb, AlbumArtId.front).then((artResult) => {
					if (!item.is_art_loaded()) {
						item.assign_art(artResult.image);
						item.repaint();
					}
				});
			}
		}
	}
	// #endregion
}


/**
 * A class that manages the playlist image cache for storing images associated with metadata handles.
 */
class PlaylistImageCache {
	/**
	 * Creates the `PlaylistImageCache` instance.
	 * @param {number} maxCacheSize - The maximum size of the cache.
	 */
	constructor(maxCacheSize) {
		/** @private @type {PlaylistLinkedList<FbMetadbHandle>} */
		this.queue = new PlaylistLinkedList();
		/** @private @type {Map<string, {metadb: FbMetadbHandle, img: GdiBitmap, queueIterator: Iterator}>} */
		this.cache = new Map();
		/** @private @type {number} */
		this.maxCacheSize = maxCacheSize;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Adds an image to the cache for the given metadata handle.
	 * @param {GdiBitmap} img - The image to add.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 */
	add_image_for_meta(img, metadb) {
		const metadbPath = metadb.Path;
		const cacheItem = this.cache.get(metadbPath);

		if (cacheItem) {
			cacheItem.img = img;
			this.move_item_to_top(cacheItem);
		} else {
			this.queue.push_front(metadb);
			const queueIterator = this.queue.begin();

			this.cache.set(metadbPath, {
				metadb,
				img,
				queueIterator
			});

			if (this.queue.length() > this.maxCacheSize) {
				const lastMetadb = this.queue.back();
				this.cache.delete(lastMetadb.Path);
				this.queue.pop_back();
			}
		}
	}

	/**
	 * Gets the image for the given metadata handle from the cache.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 * @returns {?GdiBitmap} The image for the given metadata handle, or undefined if not loaded.
	 */
	get_image_for_meta(metadb) {
		const metadbPath = metadb.Path;
		const cacheItem = this.cache.get(metadbPath);

		if (!cacheItem) return undefined;

		this.move_item_to_top(cacheItem);
		return cacheItem.img;
	}

	/**
	 * Clears the cache and the queue.
	 */
	clear() {
		this.cache.clear();
		this.queue.clear();
	}

	/**
	 * Moves a cache item to the top of the queue.
	 * @param {object} cacheItem - The cache item to move.
	 */
	move_item_to_top(cacheItem) {
		this.queue.remove(cacheItem.queueIterator);
		this.queue.push_front(cacheItem.metadb);
		cacheItem.queueIterator = this.queue.begin();
	}
	// #endregion
}


////////////////////////////
// * PLAYLIST SCROLLBAR * //
////////////////////////////
/**
 * A class that creates the scrollbar with the ScrollBarPart object and handles scrollbar events.
 */
class PlaylistScrollbar {
	/**
	 * Creates the `PlaylistScrollbar` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} row_h - The height of the row that this scrollbar occupies.
	 * @param {boolean} fn_redraw - Called to redraw the list on the next draw.
	 */
	constructor(x, y, w, h, row_h, fn_redraw) {
		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = w;
		/** @public @type {number} */
		this.h = h;

		/** @private @type {number} */
		this.row_h = row_h;
		/** @private @type {number} */
		this.rows_drawn = 0; // Visible list size in rows (might be float)
		/** @private @type {number} */
		this.row_count = 0; // All rows in associated list

		/** @private @type {Function} Callback for list redraw */
		this.fn_redraw = fn_redraw;
		/** @private @type {boolean} */
		this.draw_timer = false;
		/** @private @type {object} */
		this.sb_parts = this.sb_parts || {};

		// * Buttons
		/** @private @type {number} */
		this.btn_h = 0;
		/** @private @type {number} */
		this.thumb_h = 0;
		/** @private @type {number} Upper y */
		this.thumb_y = 0;

		/** @public @type {boolean} */
		this.in_sbar = false;
		/** @public @type {boolean} */
		this.b_is_dragging = false;
		/** @public @type {boolean} */
		this.is_scrolled_down = false;
		/** @public @type {boolean} */
		this.is_scrolled_up = true;
		/** @private @type {number} How far should the thumb move, when the list shifts by one row. */
		this.drag_distance_per_row = 0;
		/** @private @type {number} Dragging. */
		this.initial_drag_y = 0;

		/** @public @type {number} Lines shifted in list (float). */
		this.scroll = 0;
		/** @public @type {number} */
		this.desiredScrollPosition = undefined;
		/** @public @type {number} */
		this.lastScrollPosition = undefined;
		/** @public @type {boolean} */
		this.scrollbar_wheel_scroll_page = plSet.scrollbar_wheel_scroll_page;
		/** @public @type {number} Space between sb_parts (arrows). */
		this.scrollbar_h = 0;
		/** @public @type {number} Not visible rows (row_count - rows_drawn). */
		this.scrollable_lines = 0;
		/** @public @type {number} Space for thumb to travel (scrollbar_h - thumb_h). */
		this.scrollbar_travel = 0;

		/** @private @type {array} */
		this.scrollbar_images = {};
		/** @private @type {string} */
		this.cur_part_key = null;
		/** @private @type {string} */
		this._alpha_timer_internal = null;

		// * Timers
		/** @private @type {number} */
		this.throttled_scroll_y = 0;
		/** @private @type {number} */
		this.timer_shift = null;
		/** @private @type {number} */
		this.timer_shift_count = null;
		/** @private @type {number} */
		this.timer_stop_y = -1;
		/** @private @type {number} */
		this.smoothScrollTimer = null;

		// * Helpers
		/**
		 * Applies an easing effect to a given value.
		 * @type {Function}
		 * @param {number} x - The absolute progress of the animation in the bounds of 0 (beginning of the animation) and 1 (end of animation).
		 * @returns {number} The interpolated value.
		 * @private
		 */
		this.easeOut = (x) => 1 - (1 - x) ** 3;

		/**
		 * Scrolls to the specified scroll position throttled.
		 * @type {Function}
		 * @private
		 */
		this.throttled_scroll_to = Throttle(() => {
			this.smooth_scroll_to((this.throttled_scroll_y - this.btn_h) / this.drag_distance_per_row);
		}, 1000 / 60);

		this._create_scrollbar_images();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Starts the alpha timer.
	 * @private
	 */
	_startAlphaTimer() {
		const hoverInStep = 50;
		const hoverOutStep = 15;
		const downOutStep = 50;
		const timerDelay = 25;

		const actions = {
			normal: (item, part) => {
				item.hover_alpha = Math.max(0, item.hover_alpha - hoverOutStep);
				item.hot_alpha = Math.max(0, item.hot_alpha - hoverOutStep);
				item.pressed_alpha = part === 'thumb' ? Math.max(0, item.pressed_alpha - hoverOutStep) : Math.max(0, item.pressed_alpha - downOutStep);
			},
			hover: (item) => {
				item.hover_alpha = Math.min(255, item.hover_alpha + hoverInStep);
				item.hot_alpha = Math.max(0, item.hot_alpha - hoverOutStep);
				item.pressed_alpha = Math.max(0, item.pressed_alpha - downOutStep);
			},
			pressed: (item) => {
				item.hover_alpha = 0;
				item.hot_alpha = 0;
				item.pressed_alpha = 255;
			},
			hot: (item) => {
				item.hover_alpha = Math.max(0, item.hover_alpha - hoverOutStep);
				item.hot_alpha = Math.min(255, item.hot_alpha + hoverInStep);
				item.pressed_alpha = Math.max(0, item.pressed_alpha - downOutStep);
			}
		};

		if (!this._alpha_timer_internal) {
			this._alpha_timer_internal = setInterval(() => {
				for (const part in this.sb_parts) {
					const item = this.sb_parts[part];
					if (actions[item.state]) {
						actions[item.state](item, part);
					}
					// console.log(part, item.state, item.hover_alpha, item.pressed_alpha, item.hot_alpha);
					// item.repaint();
				}

				this.repaint();

				const alphaInProgress = Object.values(this.sb_parts).some((item) =>
					(item.hover_alpha > 0 && item.hover_alpha < 255) ||
					(item.pressed_alpha > 0 && item.pressed_alpha < 255) ||
					(item.hot_alpha > 0 && item.hot_alpha < 255)
				);

				if (!alphaInProgress) {
					this._stopAlphaTimer();
				}
			}, timerDelay);
		}
	}

	/**
	 * Stops and clears the alpha timer.
	 * @private
	 */
	_stopAlphaTimer() {
		if (this._alpha_timer_internal) {
			clearInterval(this._alpha_timer_internal);
			this._alpha_timer_internal = null;
		}
	}

	/**
	 * Creates images for the scrollbar up and down buttons.
	 * @private
	 */
	_create_scrollbar_images() {
		if (this.scrollbar_images.length > 0) {
			return;
		}

		const fontSegoeUI = pl.font.scrollbar;

		const ico_back_colors =
		[
			pl.col.bg,
			pl.col.bg,
			pl.col.bg,
			pl.col.bg
		];

		const ico_fore_colors =
		[
			pl.col.sbar_btn_normal,
			pl.col.sbar_btn_hovered,
			pl.col.sbar_btn_hovered,
			pl.col.sbar_btn_normal
		];

		const btn =
			{
				lineUp:   {
					ico:  '\uE010',
					font: fontSegoeUI,
					w:    this.w,
					h:    this.w
				},
				lineDown: {
					ico:  '\uE011',
					font: fontSegoeUI,
					w:    this.w,
					h:    this.w
				}
			};

		this.scrollbar_images = [];

		for (const i in btn) {
			const item = btn[i];
			const { w, h } = item;
			// const m = 2;
			const stateImages = []; // 0=normal, 1=hover, 2=down, 3=hot;

			for (let s = 0; s < 4; s++) {
				const img = gdi.CreateImage(w, h);
				const grClip = img.GetGraphics();

				const icoColor = ico_fore_colors[s];
				// const backColor = ico_back_colors[s];

				// Don't really need this button backgrounds
				// if (i === 'lineUp') {
				// 	grClip.FillSolidRect(m, 0, w - m * 2, h - 1, backColor);
				// }
				// else if (i === 'lineDown') {
				// 	grClip.FillSolidRect(m, 1, w - m * 2, h - 1, backColor);
				// }

				grClip.SetSmoothingMode(SmoothingMode.HighQuality);
				grClip.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);

				const btn_format = Stringformat.h_align_center | Stringformat.v_align_far;
				if (i === 'lineDown') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, HD_4K(-12, -25), w, h, btn_format);
				}
				else if (i === 'lineUp') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, 0, w, h, btn_format);
				}

				img.ReleaseGraphics(grClip);
				stateImages[s] = img;
			}

			this.scrollbar_images[i] =
				{
					normal:  stateImages[0],
					hover:   stateImages[1],
					pressed: stateImages[2],
					hot:     stateImages[3]
				};
		}
	}

	/**
	 * Creates images for the scrollbar thumb.
	 * @param {number} thumb_w - The width of the scrollbar thumb.
	 * @param {number} thumb_h - The height of the scrollbar thumb.
	 * @private
	 */
	_create_dynamic_scrollbar_images(thumb_w, thumb_h) {
		const thumb_colors =
			[
				pl.col.sbar_thumb_normal,
				pl.col.sbar_thumb_hovered,
				pl.col.sbar_thumb_drag
			];

		const m = 2;
		const stateImages = []; // 0=normal, 1=hover, 2=down;

		for (let s = 0; s <= 2; s++) {
			const img = gdi.CreateImage(thumb_w, thumb_h);
			const grClip = img.GetGraphics();

			const color = thumb_colors[s];
			grClip.FillSolidRect(m, 0, thumb_w - m * 2, thumb_h, color);

			img.ReleaseGraphics(grClip);
			stateImages[s] = img;
		}

		this.scrollbar_images.thumb =
			{
				normal:  stateImages[0],
				hover:   stateImages[1],
				pressed: stateImages[2]
			};
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the scrollbar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	paint(gr) {
		gr.SetSmoothingMode(SmoothingMode.None); // Disable anti-aliasing, otherwise there will be an ugly 1px outline in style blending

		for (const part in this.sb_parts) {
			const item = this.sb_parts[part];
			const { x, y, w, h } = item;

			gr.DrawImage(item.img_normal, x, y, w, h, 0, 0, w, h, 0, 255);
			switch (part) {
				case 'lineUp':
				case 'lineDown':
					gr.DrawImage(item.img_hot, x, y, w, h, 0, 0, w, h, 0, item.hot_alpha);
					gr.DrawImage(item.img_hover, x, y, w, h, 0, 0, w, h, 0, item.hover_alpha);
					gr.DrawImage(item.img_pressed, x, y, w, h, 0, 0, w, h, 0, item.pressed_alpha);
					break;

				case 'thumb':
					gr.DrawImage(item.img_hover, x, y, w, h, 0, 0, w, h, 0, item.hover_alpha);
					gr.DrawImage(item.img_pressed, x, y, w, h, 0, 0, w, h, 0, item.pressed_alpha);
					break;
			}
		}
	}

	/**
	 * Updates the scrollbar via repaint.
	 */
	repaint() {
		window.RepaintRect(this.x - HD_4K(6, 13), this.y, this.w, this.h);
	}

	/**
	 * Flushes the scrollbar position.
	 */
	flush() {
		if (this.desiredScrollPosition !== undefined) {
			this.scroll_to(this.desiredScrollPosition);
			this.desiredScrollPosition = undefined;
		}
	}

	/**
	 * Resets the current scroll of scrollbar.
	 */
	reset() {
		this.flush();
		this._stopAlphaTimer();
		this.stop_shift_timer();
		this.scroll = 0;
		this.calc_params();
	}

	/**
	 * Checks if the mouse is within the boundaries of the scrollbar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return x + SCALE(10) > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}

	/**
	 * Sets the window parameters for the scrollbar.
	 * @param {number} rows_drawn - The number of rows drawn.
	 * @param {number} row_count - The total number of rows.
	 */
	set_window_param(rows_drawn, row_count) {
		this.rows_drawn = rows_drawn;
		this.row_count = row_count;
		this.calc_params();
		this.create_parts();
	}

	/**
	 * Calculates the scrollbar parameters.
	 */
	calc_params() {
		this.btn_h = this.w;
		// * Draw info
		this.scrollbar_h = this.h - this.btn_h * 2;
		this.thumb_h = Math.max(Math.round(this.scrollbar_h * this.rows_drawn / this.row_count), HD_4K(30, 45));
		this.scrollbar_travel = this.scrollbar_h - this.thumb_h;
		// * Scrolling info
		this.scrollable_lines = Math.ceil(this.row_count - this.rows_drawn);
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
	}

	/**
	 * Creates the button and thumb scrollbar parts.
	 */
	create_parts() {
		this._create_dynamic_scrollbar_images(this.w, this.thumb_h);

		const { x, y, w, h } = this;
		const thumb_width = w - SCALE(14);
		const buttonX = x + (thumb_width - w) / 2 + SCALE(1);

		this.sb_parts = {
			lineUp:   new PlaylistScrollbarPart(buttonX, y, w, this.btn_h, this.scrollbar_images.lineUp),
			thumb:    new PlaylistScrollbarPart(x, y + this.thumb_y, thumb_width, this.thumb_h, this.scrollbar_images.thumb),
			lineDown: new PlaylistScrollbarPart(buttonX, y + h - this.btn_h, w, this.btn_h, this.scrollbar_images.lineDown)
		};
	}

	/**
	 * Handles mouse wheel scrolling events.
	 * @param {number} wheel_direction - The up or down wheel direction.
	 */
	wheel(wheel_direction) {
		const direction = -wheel_direction;
		const scrollStep = direction * grSet.playlistWheelScrollSteps;

		if (this.scrollbar_wheel_scroll_page) {
			this.shift_page(direction);
			return;
		}

		if (typeof this.desiredScrollPosition === 'undefined') {
			this.desiredScrollPosition = this.scroll; // this.nearestScroll(direction);
		}

		this.desiredScrollPosition = Math.round(
			Math.max(0, Math.min(this.desiredScrollPosition + scrollStep, this.scrollable_lines))
		);

		if (grSet.playlistSmoothScrolling) {
			this.smooth_scroll_to(this.desiredScrollPosition);
		} else {
			this.scroll_to(this.desiredScrollPosition);
		}
	}

	/**
	 * Handles mouse leaving events over each scrollbar part.
	 */
	parts_leave() {
		this.in_sbar = false;
		this.cur_part_key = null;

		for (const part in this.sb_parts) {
			this.sb_parts[part].cs('normal');
		}
		this._startAlphaTimer();
	}

	/**
	 * Handles mouse leaving events of the scrollbar.
	 */
	leave() {
		if (this.b_is_dragging) {
			return;
		}

		this.parts_leave();
	}

	/**
	 * Handles mouse movement of the scrollbar parts.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {string} The key of the current scrollbar part that the mouse is over, if any.
	 */
	parts_move(x, y) {
		const hover_part_key = FindKey(this.sb_parts, (item) => item.trace(x, y));

		const changeHotStatus = this.trace(x, y) !== this.in_sbar;
		if (changeHotStatus) {
			this.in_sbar = !this.in_sbar;
			if (this.in_sbar) {
				if (hover_part_key !== 'lineUp' && this.cur_part_key !== 'lineUp') {
					this.sb_parts.lineUp.cs('hot');
				}
				if (hover_part_key !== 'lineDown' && this.cur_part_key !== 'lineDown') {
					this.sb_parts.lineDown.cs('hot');
				}
			}
			else {
				if (this.cur_part_key !== 'lineUp') {
					this.sb_parts.lineUp.cs('normal');
				}
				if (this.cur_part_key !== 'lineDown') {
					this.sb_parts.lineDown.cs('normal');
				}
			}
			this._startAlphaTimer();
		}

		if (this.cur_part_key === hover_part_key) { // Nothing to do: same button
			return this.cur_part_key;
		}

		if (this.cur_part_key) {
			if (this.cur_part_key === 'thumb') {
				this.sb_parts[this.cur_part_key].cs('normal');
			}
			else {
				if (this.sb_parts[this.cur_part_key].state === 'pressed') {
					// Stop btn fast scroll
					this.stop_shift_timer();
				}

				// Return prev button to normal or hot state
				this.sb_parts[this.cur_part_key].cs(this.in_sbar ? 'hot' : 'normal');
			}
			this._startAlphaTimer();
		}

		if (hover_part_key) { // Select current button
			this.sb_parts[hover_part_key].cs('hover');
			this._startAlphaTimer();
		}

		this.cur_part_key = hover_part_key;
		return this.cur_part_key;
	}

	/**
	 * Handles mouse moving events over the scrollbar.
	 * @param {number} p_x - The x-coordinate.
	 * @param {number} p_y - The y-coordinate.
	 */
	move(p_x, p_y) {
		if (this.b_is_dragging) {
			this.throttled_scroll_y = p_y - this.y - this.initial_drag_y;
			this.throttled_scroll_to();
			// this.scroll_to( (p_y - this.y - this.initial_drag_y - this.btn_h) / this.drag_distance_per_row);
			return;
		}

		this.parts_move(p_x, p_y);
	}

	/**
	 * Handles left mouse button down events on the scrollbar.
	 */
	parts_lbtn_down() {
		if (this.cur_part_key) {
			this.sb_parts[this.cur_part_key].cs('pressed');
			this._startAlphaTimer();
		}
	}

	/**
	 * Handles left mouse button down events on the scrollbar.
	 * @param {number} p_x - The x-coordinate.
	 * @param {number} p_y - The y-coordinate.
	 */
	lbtn_dn(p_x, p_y) {
		if (!this.trace(p_x, p_y) || this.row_count <= this.rows_drawn) {
			return;
		}

		this.parts_lbtn_down();

		const y = p_y - this.y;

		if (y < this.btn_h) {
			this.shift_line(-1);
			this.start_shift_timer(-1);
		}
		else if (y > this.h - this.btn_h) {
			this.shift_line(1);
			this.start_shift_timer(1);
		}
		else if (y < this.thumb_y) {
			this.shift_page(-1);
			this.timer_stop_y = y;
			this.start_shift_timer(-this.rows_drawn);
		}
		else if (y > this.thumb_y + this.thumb_h) {
			this.shift_page(1);
			this.timer_stop_y = y;
			this.start_shift_timer(this.rows_drawn);
		}
		else { // On bar
			this.b_is_dragging = true;
			this.initial_drag_y = y - this.thumb_y;
		}
	}

	/**
	 * Handles left mouse button down events on the scrollbar parts.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if the current part was in 'pressed' state, otherwise false.
	 */
	parts_lbtn_up(x, y) {
		if (!this.cur_part_key || this.sb_parts[this.cur_part_key].state !== 'pressed') {
			return false;
		}

		const new_state = this.sb_parts[this.cur_part_key].trace(x, y) ? 'hover' : 'normal';

		this.sb_parts[this.cur_part_key].cs(new_state);
		this._startAlphaTimer();

		return true;
	}

	/**
	 * Handles left mouse button up events on the scrollbar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	lbtn_up(x, y) {
		this.parts_lbtn_up(x, y);
		if (this.b_is_dragging) {
			this.b_is_dragging = false;
			this.desiredScrollPosition = undefined;
		}
		this.initial_drag_y = 0;

		this.stop_shift_timer();
	}

	/**
	 * Scrolls to the start of the list.
	 */
	scroll_to_start() {
		this.smooth_scroll_to(0);
	}

	/**
	 * Scrolls one line up or down.
	 * @param {number} direction - The up or down scroll direction.
	 */
	shift_line(direction) {
		const newScroll = this.nearestScroll(direction);
		this.smooth_scroll_to(newScroll);
	}

	/**
	 * Scrolls one page up or down.
	 * @param {number} direction - The up or down scroll direction.
	 */
	shift_page(direction) {
		const newScroll = this.nearestScroll(direction);
		this.smooth_scroll_to(newScroll + direction * Math.floor(Math.max(this.rows_drawn - 1, 1)));
	}

	/**
	 * Scrolls to the end of the list.
	 */
	scroll_to_end() {
		this.smooth_scroll_to(this.scrollable_lines);
	}

	/**
	 * Starts a timer to shift the scrollbar. This method inserts a delay (8x45ms) when holding
	 * the mouse btn down before scrolling starts, after the first scroll event happens.
	 * @param {number} shift_amount - The number of rows to shift.
	 */
	start_shift_timer(shift_amount) {
		if (this.timer_shift != null) return;

		this.timer_shift_count = 0;
		this.timer_shift = setInterval(() => {
			if (++this.timer_shift_count <= 8) return;

			const thumb_y = this.btn_h + (this.scroll + shift_amount) * this.scrollbar_travel / this.scrollable_lines;
			const thumb_out_bounds = this.thumb_y <= this.btn_h || this.thumb_y + this.thumb_h >= this.h - this.btn_h;
			const thumb_reached_stop = this.timer_stop_y !== -1 && ((shift_amount > 0 && thumb_y >= this.timer_stop_y) || (shift_amount < 0 && thumb_y + this.thumb_h <= this.timer_stop_y));

			if (thumb_out_bounds || thumb_reached_stop) {
				clearInterval(this.timer_shift);
				this.timer_shift = null;
			} else {
				this.desiredScrollPosition = (this.desiredScrollPosition || this.scroll) + shift_amount;
				this.smooth_scroll_to(this.desiredScrollPosition);
			}
		}, 45);
	}

	/**
	 * Stops the timer that is shifting the scrollbar.
	 */
	stop_shift_timer() {
		if (this.timer_shift != null) {
			clearInterval(this.timer_shift);
			this.timer_shift = undefined;
		}
		this.timer_stop_y = -1;
	}

	/**
	 * Calculates the nearest scroll position to the current position.
	 * @param {number} direction - The direction of the scroll.
	 * @returns {number} The nearest scroll position.
	 */
	nearestScroll(direction) {
		if (direction === 0) return Math.round(this.scroll);

		const scrollFloor = Math.floor(this.scroll);
		const scrollShift = this.scroll - scrollFloor;

		if (direction < 0) {
			return scrollShift !== 0 ? scrollFloor : scrollFloor + direction;
		} else {
			return scrollShift !== 0 ? Math.ceil(this.scroll) : scrollFloor + direction;
		}
	}

	/**
	 * Stops the scrollbar scroll and clears the timer.
	 */
	stopScrolling() {
		clearTimeout(this.smoothScrollTimer);
		this.smoothScrollTimer = null;
	}

	/**
	 * Scrolls to desired row over grSet.playlistWheelScrollDuration (400ms default).
	 * Can be called repeatedly (during wheel or holding down arrows) to update the desired position.
	 * @param {number} newPosition - The new row position to scroll to.
	 */
	smooth_scroll_to(newPosition) {
		if (!grSet.playlistSmoothScrolling) {
			this.scroll_to(newPosition, false);
			return;
		}

		const endPos = Math.max(0, Math.min(newPosition, this.scrollable_lines));
		if (endPos === this.scroll) return;
		clearTimeout(this.smoothScrollTimer);

		const startPos = this.scroll;
		const totalDistance = endPos - startPos;
		const scrollDuration = grSet.playlistWheelScrollDuration / 10;
		let animationProgress = 0; // Percent of animation completion: 0 (startPos) - 100 (endPos)

		/**
		 * Performs a single step in a smooth scrolling animation and schedules subsequent steps.
		 * Continues until the target position is reached or the animation ends.
		 * @private
		 */
		const _scrollStep = () => {
			animationProgress += 8;
			const newVal = startPos + this.easeOut(animationProgress / 100) * totalDistance;

			const isEnding =
				Math.abs(endPos - newVal) < 0.1
				||
				totalDistance > 0 && newVal >= endPos
				||
				totalDistance < 0 && newVal <= endPos;

			const scrollPos = isEnding ? endPos : Math.round(newVal * 100) / 100;

			this.scroll_to(scrollPos, false);

			if (isEnding) {
				animationProgress = 100;
				this.desiredScrollPosition = endPos;
				this.stopScrolling();
				return;
			}

			this.smoothScrollTimer = setTimeout(_scrollStep, scrollDuration);
		};

		_scrollStep();
	}

	/**
	 * Scrolls to the specified scroll position.
	 * @param {number} new_position - The new row position to scroll to.
	 * @param {boolean} scroll_wo_redraw - Calls a redraw to update the scrollbar.
	 */
	scroll_to(new_position, scroll_wo_redraw = false) {
		const clampedPos = Math.max(0, Math.min(new_position, this.scrollable_lines));
		const invalidPos = (plSet.scrollbar_pos || clampedPos) > this.scrollable_lines; // Prevent scroll crash
		if (clampedPos === this.scroll) return;

		this.scroll = invalidPos ? 0 : clampedPos;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.sb_parts.thumb.y = this.y + this.thumb_y;

		this.is_scrolled_up = (this.scroll === 0);
		this.is_scrolled_down = Math.abs(this.scroll - this.scrollable_lines) < 0.0001;

		if (!scroll_wo_redraw) {
			this.fn_redraw();
		}
	}

	/**
	 * Sets the x-coordinate of the scrollbar.
	 * @param {number} x - The x-coordinate.
	 */
	set_x(x) {
		this.x = x;
		for (const part in this.sb_parts) {
			this.sb_parts[part].x = x;
		}
	}
	// #endregion
}


/**
 * A class that creates scrollbar parts with specified dimensions and images.
 */
class PlaylistScrollbarPart {
	/**
	 * Creates the `PlaylistScrollbarPart` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {GdiBitmap} img_src - The image sources for different states of the scrollbar part.
	 */
	constructor(x, y, w, h, img_src) {
		/** @private @type {number} */
		this.x = x;
		/** @private @type {number} */
		this.y = y;
		/** @private @type {number} */
		this.w = w;
		/** @private @type {number} */
		this.h = h;

		/** @private @type {GdiBitmap} */
		this.img_normal = undefined;
		/** @private @type {GdiBitmap} */
		this.img_hover = undefined;
		/** @private @type {GdiBitmap} */
		this.img_pressed = undefined;
		/** @private @type {GdiBitmap} */
		this.img_hot = undefined;

		/** @private @type {number} */
		this.hover_alpha = 0;
		/** @private @type {number} */
		this.hot_alpha = 0;
		/** @private @type {number} */
		this.pressed_alpha = 0;
		/** @private @type {string} */
		this.state = 'normal';

		this._assign_imgs(img_src);
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Assigns the images to the scrollbar part.
	 * @param {object} imgs - The images.
	 * @private
	 */
	_assign_imgs(imgs) {
		this.img_normal = this.img_hover = this.img_hover = this.img_hover = null;

		if (imgs === undefined) return;

		this.img_normal = imgs.normal;
		this.img_hover = imgs.hover ? imgs.hover : this.img_normal;
		this.img_pressed = imgs.pressed ? imgs.pressed : this.img_normal;
		this.img_hot = imgs.hot ? imgs.hot : this.img_normal;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the state of the scrollbar part.
	 * @param {string} s - The state.
	 */
	cs(s) {
		this.state = s;
		this.repaint();
	}

	/**
	 * Updates the scrollbar part via repaint.
	 */
	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	/**
	 * Checks if the mouse is within the boundaries of the scrollbar part.
	 * @param {number} x - The x coordinate.
	 * @param {number} y - The y coordinate.
	 * @returns {boolean} True if the coordinates are inside the scrollbar part.
	 */
	trace(x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}
	// #endregion
}


//////////////////////////
// * PLAYLIST HISTORY * //
//////////////////////////
/**
 * A class that manages the history of playlist states, allowing users to navigate
 * back and forward between previous states and updates the playlist accordingly.
 */
class PlaylistHistory {
	/**
	 * Creates the `PlaylistHistory` instance.
	 * Initializes a playlist with a maximum number of states.
	 * @param {number} maxStates - The maximum number of states that can be stored in the history array.
	 */
	constructor(maxStates = 10) {
		/** @private @type {number} */
		this.maxStates = maxStates;
		/** @private @type {PlaylistState[]} */
		this.history = [];
		/** @private @type {number} */
		this.stateIndex = 0;
		/** @private @type {boolean} */
		this.updatingPlaylist = false;

		this.playlistAltered(PlaylistMutation.Init);
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Gets the length of the playlist history.
	 * @returns {number} The length of the "history" array.
	 */
	get length() {
		return this.history.length;
	}

	/**
	 * Gets whether the history should ignore upcoming mutations and changes to the playlist.
	 * @returns {boolean} Whether to ignore playlist mutations.
	 */
	get ignorePlaylistMutations() {
		return this.ignorePlaylistMutations;
	}

	/**
	 * Sets whether the history should ignore upcoming mutations and changes to the playlist.
	 *
	 * Playlist updates are synchronous, but notifications are async. If setting to false, we
	 * update that value async as well to hopefully happen after all callbacks have called,
	 * and then manually call playlistAltered in case the playlist state has changed.
	 * @param {boolean} ignore - Whether to ignore playlist mutations.
	 */
	set ignorePlaylistMutations(ignore) {
		if (!ignore) {
			setTimeout(() => {
				this.updatingPlaylist = false;
				this.playlistAltered(PlaylistMutation.Switch);
			}, 1);
		} else {
			this.updatingPlaylist = true;
		}
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Sets and updates the state of a playlist by adding or removing items based on the current playback state.
	 * @private
	 */
	_setPlaylistState() {
		pl.history_used = true;
		this.updatingPlaylist = true;
		/** @type {PlaylistState} */ const activeState = this.history[this.stateIndex];
		const pbQueue = plman.GetPlaybackQueueContents();
		const playingItem = plman.GetPlayingItemLocation();
		const plIndex = activeState.playlistId
		plman.UndoBackup(plIndex);
		plman.ActivePlaylist = plIndex;

		if (!activeState.locked) {
			if (!playingItem.IsValid || playingItem.PlaylistIndex !== plIndex) {
				plman.ClearPlaylist(plIndex);
				plman.InsertPlaylistItems(plIndex, 0, activeState.playlistEntries);
			} else {
				const handles = plman.GetPlaylistItems(plIndex);
				const index = handles.Find(fb.GetNowPlaying());
				const stateHandles = activeState.playlistEntries.Clone();
				const stateIndex = stateHandles.Find(fb.GetNowPlaying());
				const stateHandlesClone = stateHandles.Clone();
				console.log('>>> Playlist now playing index:', index);
				// Remove everything in playlist except currently playing song
				plman.ClearPlaylistSelection(plIndex);
				plman.SetPlaylistSelection(plIndex, [playingItem.PlaylistItemIndex], true);
				plman.RemovePlaylistSelection(plIndex, true);
				plman.ClearPlaylistSelection(plIndex);
				try {
					stateHandles.RemoveById(stateIndex);
				} catch (e) {
					plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
				}
				if (stateIndex > 0) {
					stateHandles.RemoveRange(stateIndex, stateHandles.Count);
					plman.InsertPlaylistItems(plIndex, 0, stateHandles);
				}
				if (stateIndex < stateHandlesClone.Count) {
					stateHandlesClone.RemoveRange(0, stateIndex);
					plman.InsertPlaylistItems(plIndex, plman.PlaylistItemCount(plIndex), stateHandlesClone);
				}
				// Remove currently playing song duplicate
				plman.SetPlaylistSelection(plIndex, [playingItem.PlaylistItemIndex], true);
				plman.RemovePlaylistSelection(plIndex);
			}
		}

		this._restorePlaybackQueue(pbQueue);

		// * Wait for callbacks to be called
		setTimeout(() => {
			pl.history_used = false;
			this.updatingPlaylist = false;
		}, 1);

		// * Scroll to now playing when auto-scroll is active and playlist has now playing
		const playing_item_location = plman.GetPlayingItemLocation();
		const playlistNowPlaying = playing_item_location.PlaylistIndex === plman.ActivePlaylist;
		if (playlistNowPlaying && (grSet.playlistAutoScrollNowPlaying || fb.PlaybackFollowCursor || fb.CursorFollowPlayback)) {
			setTimeout(() => { // * Wait until new album art / disc art loaded and other things finished for smoother auto-scrolling
				pl.playlist.show_now_playing();
			}, 200);
		}
	}

	/**
	 * Checks if a new playlist state should be added to the history based on the playlist ID, new items, and mutation type.
	 * @param {number} playlistId - The playlist id.
	 * @param {FbMetadbHandleList} newItems - The list of handles of playlist items.
	 * @param {string} mutationType - The type of mutation that occurred.
	 * @returns {boolean} True or false.
	 * @private
	 */
	_shouldAddState(playlistId, newItems, mutationType) {
		const start = Date.now();
		const currState = this.history[this.stateIndex];
		if (!currState) {
			// init'ing playlist history
			return true
		}

		// if playlist ID is unchanged, and playlist is locked, don't save
		if (playlistId === currState.playlistId && plman.IsPlaylistLocked(playlistId)) {
			return false;
		}
		if (playlistId !== currState.playlistId ||
			currState.locked || plman.IsPlaylistLocked(playlistId) ||
			newItems.Count !== currState.playlistEntries.Count) {
			return true;
		}
		for (let i = 0; i < newItems.Count; i++) {
			if (newItems[i].RawPath !== currState.playlistEntries[i].RawPath) {
				// console.log(newItems[i].RawPath, currState.playlistEntries[i].RawPath);
				return true;
			}
		}
		DebugLog(`Playlist history => checking for duplicate playlist states took: ${Date.now() - start}ms`);
		return false;
	}

	/**
	 * Restores a playback queue by adding items to the queue based on their playlist and index,
	 * or by adding them directly if no playlist or index is specified.
	 * @param {FbPlaybackQueueItem[]} pbQueue - The playback queue state to restore.
	 * @private Attempts to re-mark playbackQueue items after setting playlist state.
	 */
	_restorePlaybackQueue(pbQueue) {
		plman.FlushPlaybackQueue();
		for (const queueItem of pbQueue) {
			const itemPlaylist = queueItem.PlaylistIndex;
			const itemIndex = queueItem.PlaylistItemIndex;
			if (itemPlaylist !== -1 && itemIndex !== -1) {
				const plContents = {};
				if (!plContents[itemPlaylist]) {
					plContents[itemPlaylist] = plman.GetPlaylistItems(itemPlaylist);
				}
				const playlistHandles = plContents[itemPlaylist];
				if (playlistHandles && playlistHandles[itemIndex] && playlistHandles[itemIndex].Path === queueItem.Handle.Path) {
					plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, itemIndex);
				} else {
					const index = plContents[itemPlaylist].Find(queueItem.Handle);
					if (index >= 0) {
						plman.AddPlaylistItemToPlaybackQueue(itemPlaylist, index);
					} else {
						plman.AddItemToPlaybackQueue(queueItem.Handle);
					}
				}
			} else {
				plman.AddItemToPlaybackQueue(queueItem.Handle);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Logs the type of playlist mutation and checks if the playlist should be added to the history of playlist states.
	 * Notify the PlaylistHistory that a playlist was altered.
	 * @param {string} mutationType - The type of mutation that occurred.
	 */
	playlistAltered(mutationType) {
		// ignore playlist alterations when changing states
		console.log(mutationType);
		if (!this.updatingPlaylist && plman.ActivePlaylist >= 0) {
			const plItems = plman.GetPlaylistItems(plman.ActivePlaylist);
			if (this._shouldAddState(plman.ActivePlaylist, plItems, mutationType)) {
				if (this.stateIndex < this.length - 1) {
					this.history = this.history.slice(0, this.stateIndex + 1);
				}
				if (this.length >= this.maxStates) {
					this.history.shift();
				}
				this.history.push(new PlaylistState(plman.ActivePlaylist, plItems));
				this.stateIndex = this.length - 1;
				if (grm.button.btn.back) {
					grm.button.btn.back.repaint();
					grm.button.btn.forward.repaint();
				}
				DebugLog('Playlist history => stateIndex:', this.stateIndex, ' new items count:', plItems.Count, this.stateIndex);
			}
		}
	}

	/**
	 * Handles the playlist history button action in the playlist manager bar.
	 * @param {string} btn - The playlist history back or forward button.
	 */
	buttons(btn) {
		if (btn.isEnabled && btn.isEnabled()) {
			if (btn.id === 'Back') {
				this.back();
			} else {
				this.forward();
			}
		}
	}

	/**
	 * Checks if there is a previous state in the playlist history.
	 * @returns {boolean} True or false.
	 */
	canBack() {
		return this.stateIndex > 0;
	}

	/**
	 * Checks if there is a next state available to navigate forward to.
	 * @returns {boolean} True or false.
	 */
	canForward() {
		return this.stateIndex < this.length - 1;
	}

	/**
	 * Decreases the state index and sets the playlist state accordingly.
	 */
	back() {
		this.stateIndex--;
		if (this.stateIndex <= 0) {
			this.stateIndex = 0;
		}
		DebugLog('Playlist history => pl.history back =>', this.stateIndex);
		this._setPlaylistState();
	}

	/**
	 * Increments the state index and sets the playlist state, ensuring that the state index
	 * does not exceed the length of the playlist.
	 */
	forward() {
		this.stateIndex++;
		if (this.stateIndex >= this.length) {
			this.stateIndex = this.length - 1;
		}
		DebugLog('Playlist history => pl.history forward =>', this.stateIndex);
		this._setPlaylistState();
	}

	/**
	 * Clears the playlist history. Should always be called from on_playlists_changed
	 * because all saved playlistIds have been invalidated.
	 */
	reset() {
		this.history = [];
		this.playlistAltered(PlaylistMutation.Init);
	}
	// #endregion
}


/**
 * A class that manages the state of an active playlist, including its ID,
 * lock status, and a list of playlist entries if it is not locked.
 */
class PlaylistState {
	/**
	 * Creates the `PlaylistState` instance.
	 * @param {number} playlistId - The ID of the playlist.
	 * @param {FbMetadbHandleList} plItems - The playlist items in the current playlist.
	 * @public
	 */
	constructor(playlistId, plItems) {
		/** @public @type {number} */
		this.playlistId = playlistId;
		/** @public @type {boolean} */
		this.locked = plman.IsPlaylistLocked(playlistId);

		if (!this.locked) {
			// don't need to save items if playlist is locked, we'll just switch to it
			/** @type {FbMetadbHandleList} */ this.playlistEntries = plItems;
		}
	}
}


/////////////////////////
// * PLAYLIST RATING * //
/////////////////////////
/**
 * A class that creates and draws the rating in the playlist rows.
 */
class PlaylistRating {
	/**
	 * Creates the `PlaylistRating` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} max_w - The maximum width.
	 * @param {number} h - The height.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	constructor(x, y, max_w, h, metadb) {
		/** @private @type {number} */
		this.btn_w = SCALE(grSet.playlistFontSize_layout + 2);

		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = Math.min(this.btn_w * 5, max_w);
		/** @public @type {number} */
		this.h = h;

		/** @private @type {FbMetadbHandle} */
		this.metadb = metadb;
		/** @private @type {?number} */
		this.rating = undefined;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Computes the raw album rating.
	 * @param {Array<PlaylistRow|PlaylistBaseHeader>} sub_items - The sub-items.
	 * @returns {number} The average rating.
	 * @private
	 */
	_compute_album_rating(sub_items) {
		let totalRating = 0;
		let trackCount = 0;

		const iterate = (items) => {
			for (const item of items) {
				if (item instanceof PlaylistRow) {
					const rating = this.get_track_rating(item.metadb);
					if (rating > 0) {
						totalRating += rating;
						trackCount++;
					}
				}
				else {
					iterate(item.sub_items);
				}
			}
		};

		iterate(sub_items);
		return trackCount > 0 ? Math.round(totalRating / trackCount * 10) / 10 : 0;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws stars as rating in the playlist row.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} color - The color of the stars.
	 */
	draw(gr, color) {
		const cur_rating = this.get_rating();
		let cur_rating_x = this.x;
		const y = this.y - HD_4K(1, 3);

		for (let j = 0; j < 5; j++) {
			if (j < cur_rating) {
				gr.DrawString('\u2605', pl.font.rating_set, grm.ui.loadingThemeComplete ? RGBA(0, 0, 0, 100) : color, cur_rating_x, y, this.btn_w + 1, this.h + 2, Stringformat.align_center);
				gr.DrawString('\u2605', pl.font.rating_set, color, cur_rating_x, y, this.btn_w, this.h, Stringformat.align_center);
			} else if (grSet.showPlaylistRatingGrid) {
				gr.DrawString('\u2219', pl.font.rating_not_set, pl.col.row_title_normal, cur_rating_x, y, this.btn_w, this.h, Stringformat.align_center);
			}
			cur_rating_x += this.btn_w;
		}
	}

	/**
	 * Sets rating in the playlist row rating area when double clicked.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	click(x, y) {
		if (!this.trace(x, y)) {
			return;
		}

		pl.playlist.clear_cache();

		const ratingNew = Math.floor((x - this.x) / this.btn_w) + 1;
		const ratingCurrent = this.get_rating();
		let ratingUpdated = ratingCurrent;

		if (plSet.use_rating_from_tags) {
			if (!this.metadb.RawPath.startsWith('http')) {
				const handle = new FbMetadbHandleList();
				handle.Add(this.metadb);
				const newValue = (ratingCurrent === ratingNew) ? '' : ratingNew;
				handle.UpdateFileInfoFromJSON(JSON.stringify({ RATING: newValue }));
				ratingUpdated = newValue === '' ? 0 : Number(newValue);
			}
		} else {
			const command = ratingCurrent === ratingNew ? '<not set>' : ratingNew;
			fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${command}`, this.metadb);
			ratingUpdated = command === '<not set>' ? 0 : ratingNew;
		}

		this.rating = ratingUpdated;
		const trackId = $('%artist% - %album% - %title%', this.metadb) || this.metadb.RawPath;
		pl.track_ratings.set(trackId, ratingUpdated);
		pl.playlist.update_playlist_headers();
	}

	/**
	 * Traces mouse movement and checks if mouse is within the boundaries of the clickable rating.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Gets the ratings for the current artist, album, and track.
	 * @returns {object} An object containing artist rating, album rating and track rating.
	 */
	get_current_ratings() {
		const artistRating = this.get_artist_rating();
		const albumRating = this.get_album_rating();
		const trackRating = this.get_track_rating();

		return { artistRating, albumRating, trackRating };
	}

	/**
	 * Gets the average rating for an artist.
	 * @returns {Map<string, number>} A map where the key is the artist name and the value is the average rating of all tracks by that artist.
	 */
	get_artist_rating() {
		// Return cached results if available
		if (pl.artist_ratings.size !== 0) {
			return pl.artist_ratings;
		}

		const artists = new Map();
		const playlistItems = pl.playlist.playlist_items_array;

		// Group tracks by artist
		for (let i = 0; i < playlistItems.length; ++i) {
			const track = playlistItems[i];
			const artistName = $('%artist%', track);
			const rating = this.get_track_rating(track);

			if (rating === null) continue; // Skip tracks with no rating

			if (artists.has(artistName)) {
				const artistData = artists.get(artistName);
				artistData.artistTotalRating += rating;
				artistData.artistTrackCount++;
			} else {
				artists.set(artistName, { artistTotalRating: rating, artistTrackCount: 1 });
			}
		}

		// Calculate average rating for each artist
		for (const [artistName, { artistTotalRating, artistTrackCount }] of artists) {
			if (artistTrackCount > 0) {
				const artistAverageRating = Number((artistTotalRating / artistTrackCount).toFixed(2));
				pl.artist_ratings.set(artistName, artistAverageRating);
			}
		}

		return pl.artist_ratings;
	}

	/**
	 * Gets the average rating for an album by iterating over the provided sub-items (local to the header/album).
	 * @param {Array<PlaylistRow|PlaylistBaseHeader>} sub_items - The sub-items (tracks/discs) for this album/header.
	 * @returns {number} The average rating (rounded to 1 decimal), or 0 if no rated tracks.
	 */
	get_album_rating(sub_items = pl.playlist.cnt.sub_items) {
		if (!plSet.show_rating_header) return 0;

		const albumKey = PlaylistHeader.get_album_key(this.metadb);
		let rating = pl.album_ratings.get(albumKey);

		if (rating === undefined) {
			rating = this._compute_album_rating(sub_items);
			pl.album_ratings.set(albumKey, rating);
		}

		return rating;
	}

	/**
	 * Gets the rating for a given track.
	 * If no track is provided, it defaults to the current playlist row.
	 * @param {FbMetadbHandle} [track] - The track to get the rating for.
	 * @returns {number|null} The rating of the provided or default track, or null if no rating.
	 */
	get_track_rating(track = this.metadb) {
		let currentRating;

		if (plSet.use_rating_from_tags) {
			const fileInfo = track.GetFileInfo();
			const ratingIdx = fileInfo.MetaFind('RATING');
			currentRating = ratingIdx !== -1 ? fileInfo.MetaValue(ratingIdx, 0) : 0;
		} else {
			currentRating = $('%rating%', track);
		}

		return currentRating === '' ? null : Number(currentRating);
	}

	/**
	 * Gets the rating for the current track.
	 * If no rating has been fetched yet, it fetches the rating using the get_track_rating method.
	 * @returns {number|null} The rating of the current track, or null if no rating.
	 */
	get_rating() {
		const trackId = $('%artist% - %album% - %title%', this.metadb) || this.metadb.RawPath;
		let rating = pl.track_ratings.get(trackId);

		if (rating === undefined) {
			let currentRating;

			if (plSet.use_rating_from_tags) {
				const file_info = this.metadb.GetFileInfo();
				const rating_meta_idx = file_info.MetaFind('RATING');
				currentRating = rating_meta_idx !== -1 ? file_info.MetaValue(rating_meta_idx, 0) : 0;
			} else {
				currentRating = $('%rating%', this.metadb);
			}

			rating = isNaN(Number(currentRating)) || currentRating === '' ? 0 : Number(currentRating);
			pl.track_ratings.set(trackId, rating);
			this.rating = rating;
		}

		return rating;
	}

	/**
	 * Resets and clears the current rating.
	 */
	reset_queried_data() {
		this.rating = undefined;
	}
	// #endregion
}


//////////////////////////
// * PLAYLIST MANAGER * //
//////////////////////////
/**
 * A class that represents the playlist manager at the top of the panel
 * and acts like a drop down menu that contains various options.
 */
class PlaylistManager {
	/**
	 * Creates the `PlaylistManager` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 */
	constructor(x, y, w, h) {
		pl.history = new PlaylistHistory();

		/** @public @type {number} */
		this.x = x;
		/** @public @type {number} */
		this.y = y;
		/** @public @type {number} */
		this.w = w;
		/** @public @type {number} */
		this.h = h;

		/** @public @enum {number} */
		this.state = {
			normal:  0,
			hovered: 1,
			pressed: 2
		};

		/** @public @type {state} */
		this.panel_state = this.state.normal;
		/** @public @type {number} */
		this.hover_alpha = 0;

		/** @private @type {?GdiBitmap} */
		this.image_normal = null;
		/** @private @type {?GdiBitmap} */
		this.image_hovered = null;
		/** @private @type {?string} */
		this.info_text = undefined;
		/** @private @type {number} */
		this.cur_playlist_idx = undefined;

		/**
		 * Throttles a function to limit how often it can be invoked. This specific throttled function
		 * is used to repaint a rectangular area of a window at most once every frame at a rate of 60fps.
		 * @type {Function}
		 * @private
		 */
		this.throttled_repaint = Throttle(() => {
			window.RepaintRect(this.x - SCALE(1), this.y, this.w + SCALE(2), this.h);
		}, 1000 / 60);

		/**
		 * The animation timer for the playlist manager text button.
		 * This timer adjusts the alpha transparency of the button based on whether it is being hovered over.
		 * It uses an alpha_timer factory function to create an object with start and stop methods to control the animation.
		 * @type {{ start: Function, stop: Function }}
		 * @private
		 */
		this.alpha_timer = this._alpha_timer([this], (item) => item.panel_state === this.state.hovered);
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Appends a context menu item to the given parent menu that allows the user
	 * to toggle the visibility of the playlist manager text button.
	 * @param {ContextMenu} parent_menu - The parent menu to append the item to.
	 * @static
	 */
	static append_playlist_info_visibility_context_menu_to(parent_menu) {
		parent_menu.appendItem('Show playlist manager', () => {
			// plSet.show_plman = !plSet.show_plman;
			if (grSet.layout === 'compact') {
				grSet.showPlaylistManager_compact = !grSet.showPlaylistManager_compact;
			} else if (grSet.layout === 'artwork') {
				grSet.showPlaylistManager_artwork = !grSet.showPlaylistManager_artwork;
			} else {
				grSet.showPlaylistManager_default = !grSet.showPlaylistManager_default;
			}
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
		}, { is_checked: grSet.showPlaylistManager_layout });
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Animates the alpha of the playlist manager text button at the top.
	 * @param {Array<PlaylistItem>} items_arg - The list of items to animate.
	 * @param {function(PlaylistItem): boolean} hover_predicate_arg - The predicate to determine if an item is hovered.
	 * @returns {{start: Function, stop: Function}} An object with 'start' and 'stop' methods to control the animation.
	 * @private
	 */
	_alpha_timer(items_arg, hover_predicate_arg) {
		let alpha_timer_internal = null;
		const hover_in_step = 50;
		const hover_out_step = 15;

		const start = () => {
			if (!alpha_timer_internal) {
				alpha_timer_internal = setInterval(() => {
					for (const item of items_arg) {
						const saved_alpha = item.hover_alpha;
						item.hover_alpha = hover_predicate_arg(item) ? Math.min(255, item.hover_alpha += hover_in_step) : Math.max(0, item.hover_alpha -= hover_out_step);

						if (saved_alpha !== item.hover_alpha) {
							item.repaint();
						}
					}

					const alpha_in_progress = items_arg.some(item => item.hover_alpha > 0 && item.hover_alpha < 255);

					if (!alpha_in_progress) {
						stop();
					}
				}, 25);
			}
		};

		const stop = () => {
			if (alpha_timer_internal) {
				clearInterval(alpha_timer_internal);
				alpha_timer_internal = null;
			}
		};

		return { start, stop };
	}

	/**
	 * Changes the state of the playlist manager text button.
	 * @param {state} new_state - The new state of the button.
	 * @private
	 */
	_change_state(new_state) {
		if (this.panel_state === new_state) {
			return;
		}

		const old_state = this.panel_state;
		this.panel_state = new_state;

		if (old_state === this.state.pressed) {
			// Mouse click action opens context menu, which triggers on_mouse_leave, thus causing weird hover animation
			this.hover_alpha = 0;
		}
		if (new_state === this.state.hovered || new_state === this.state.normal) {
			this.alpha_timer.start();
		}

		this.repaint();
	}

	/**
	 * Draws the playlist manager text button and defines its states.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {state} panel_state - The state of the playlist manager text button.
	 * @private
	 */
	_draw_on_image(gr, x, y, w, h, panel_state) {
		let text_color;
		let bg_color;

		switch (panel_state) {
			case this.state.normal: {
				text_color = grSet.styleBlend && grSet.autoHidePlman || !grSet.showPlaylistManager_layout ? '' : pl.col.plman_text_normal;
				bg_color = pl.col.plman_bg;
				break;
			}
			case this.state.hovered: {
				text_color = pl.col.plman_text_hovered;
				bg_color = pl.col.plman_bg;
				break;
			}
			case this.state.pressed: {
				text_color = pl.col.plman_text_pressed;
				bg_color = pl.col.plman_bg;
				break;
			}
		}

		if (!grSet.styleBlend) gr.FillSolidRect(x, y, w, h, bg_color); // Playlist Manager Hide Top Rows that shouldn't be visible
		// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
		gr.SetTextRenderingHint(grSet.styleBlend || grSet.customThemeFonts && grSet.playlistHeaderFontSize_layout > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

		if (plman.ActivePlaylist !== -1 && plman.IsPlaylistLocked(plman.ActivePlaylist)) {
			// Position above scrollbar for eye candy
			// const sbar_x = x + w - pl.geo.scrollbar_w - pl.geo.scrollbar_right_pad;
			const lock_x = grm.ui.ww - SCALE(29);
			const lock_text = '\uf023';
			const lock_w = Math.ceil(
				/** @type {!number} */
				gr.MeasureString(lock_text, pl.font.font_awesome, 0, 0, 0, 0).Width
			);
			gr.DrawString(lock_text, pl.font.font_awesome, text_color, lock_x, y, lock_w, h, Stringformat.align_center);

			// right_pad += lock_w;  // Deactivated -> PLM text should be always centered
		}

		const centralPoint = y + h * 0.5;
		const info_w = this.info_text_measure.Width;
		const info_h = this.info_text_measure.Height;
		const info_x = x + (w - info_w) * 0.5;
		const info_y = centralPoint - (info_h * 0.5);

		gr.DrawString(this.info_text, pl.font.title_selected, text_color, info_x, info_y, info_w, info_h, Stringformat.trim_ellipsis_char | Stringformat.no_wrap);

		const showBtns = grSet.autoHidePlman && (panel_state !== this.state.normal && info_x > pl.playlist.x) || !grSet.autoHidePlman;
		const btn_h = SCALE(22);
		const btn_y = this.y + (h * 0.5) - (btn_h * 0.5) + HD_4K(-1, 2);
		const btn_back_x = showBtns ? info_x - btn_h * 1.2 : 9999;
		const btn_forward_x = showBtns ? info_x + info_w + btn_h * 0.4 : 9999;
		const hasPlaylistHistory = pl.history.canBack() || pl.history.canForward();

		if (grSet.showPlaylistHistory && grSet.showPlaylistManager_layout && hasPlaylistHistory) {
			grm.button.btn.back = new Button(btn_back_x, btn_y, btn_h, btn_h, 'Back', grm.button.btnImg.Back, null, pl.history.canBack.bind(pl.history));
			grm.button.btn.forward = new Button(btn_forward_x, btn_y, btn_h, btn_h, 'Forward', grm.button.btnImg.Forward, null, pl.history.canForward.bind(pl.history));
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Calculates the total duration of the current playlist and formats it.
	 * @param {object} metadb_list - The metadb handle list of the playlist.
	 * @returns {string} The formatted duration string if the duration is non-zero.
	 */
	get_duration(metadb_list) {
		if (!metadb_list) return '';
		const duration = Math.round(metadb_list.CalcTotalDuration());
		return duration ? utils.FormatDuration(duration) : '';
	}

	/**
	 * Reinitializes the playlist manager text button state.
	 */
	reinitialize() {
		this.info_text = undefined;
		this.panel_state = this.state.normal;
		this.hover_alpha = 0;
		this.get_duration();
	}

	/**
	 * Sets the width of the playlist manager text button.
	 * @param {number} w - The width of the button.
	 */
	set_w(w) {
		this.w = w;
	}

	/**
	 * Sets the size and position of the playlist manager text button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width of the button.
	 */
	set_xywh(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = SCALE(plSet.row_h + 4);
	}

	/**
	 * Traces mouse movement and checks when mouse is within the boundaries of the playlist manager text button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		return x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h;
	}

	/**
	 * Registers key actions and handles key presses.
	 * @param {PlaylistKeyActionHandler} key_handler - The PlaylistKeyActionHandler object.
	 */
	register_key_actions(key_handler) {
		key_handler.register_key_action(VKey.KEY_N,
			(modifiers) => {
				if (modifiers.ctrl) {
					plman.CreatePlaylist(plman.PlaylistCount, '');
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				}
			});

		key_handler.register_key_action(VKey.KEY_M,
			(modifiers) => {
				if (modifiers.ctrl) {
					fb.RunMainMenuCommand('View/Playlist Manager');
				}
			});
	}

	/**
	 * Updates the playlist manager text button state via repaint.
	 */
	repaint() {
		this.throttled_repaint();
	}
	// #endregion

	// * CALLBACKS * //
	// #region Callbacks
	/**
	 * Draws the playlist manager text button at the top.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	on_paint(gr) {
		if (!this.info_text || this.cur_playlist_idx !== plman.ActivePlaylist) {
			this.cur_playlist_idx = plman.ActivePlaylist;
			let metadb_list = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
			let is_selected = true;

			if (!metadb_list.Count) {
				metadb_list = plman.GetPlaylistItems(this.cur_playlist_idx);
				is_selected = false;
			}

			const track_count = metadb_list.Count;
			let tracks_text = '';
			let duration_text = '';
			if (track_count > 0) {
				tracks_text = track_count.toString() + (track_count > 1 ? ' tracks' : ' track');
				if (is_selected) {
					tracks_text += ' selected';
				}

				if (!duration_text && pl.playlist.batch_processor.batchProcessComplete) {
					// ! There is a significant performance issue during foobar startup or playlist switch when using CalcTotalDuration()
					// ! The playlist total duration should be calculated after foobar has completely loaded
					duration_text = this.get_duration(metadb_list);
				}
			}

			this.info_text = plman.GetPlaylistName(this.cur_playlist_idx);
			if (tracks_text) {
				this.info_text += `: ${tracks_text}`;
			}
			if (duration_text) {
				this.info_text += `, Length: ${duration_text}`;
			}

			this.info_text_measure = gr.MeasureString(this.info_text, pl.font.title_selected, 0, 0, this.w, this.h);
		}

		if (this.panel_state === this.state.pressed
			|| (this.panel_state === this.state.normal && !this.hover_alpha)
			|| (this.panel_state === this.state.hovered && this.hover_alpha === 255)) {
			if (this.image_normal) {
				this.image_normal = null;
			}
			if (this.image_hovered) {
				this.image_hovered = null;
			}

			this._draw_on_image(gr, this.x, this.y, this.w, this.h, this.panel_state);
		}
		else {
			if (!this.image_normal) {
				const image = gdi.CreateImage(this.w, this.h);
				const image_gr = image.GetGraphics();

				this._draw_on_image(image_gr, 0, 0, this.w, this.h, this.state.normal);

				image.ReleaseGraphics(image_gr);
				this.image_normal = image;
			}

			if (!this.image_hovered) {
				const image = gdi.CreateImage(this.w, this.h);
				const image_gr = image.GetGraphics();

				this._draw_on_image(image_gr, 0, 0, this.w, this.h, this.state.hovered);

				image.ReleaseGraphics(image_gr);
				this.image_hovered = image;
			}

			gr.DrawImage(this.image_normal, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);
			gr.DrawImage(this.image_hovered, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, this.hover_alpha);
		}
	}

	/**
	 * Handles left mouse button down events and changes the playlist manager text button state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_down(x, y, m) {
		if (grm.button.btn.back && grm.button.btn.back.mouseInThis(x, y) || grm.button.btn.forward && grm.button.btn.forward.mouseInThis(x, y)) {
			return; // Handled in back forward buttons
		}
		if (!this.trace(x, y)) {
			return;
		}

		this._change_state(this.state.pressed);
	}

	/**
	 * Handles left mouse button up events and opens the playlist manager drop down list menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		const was_pressed = this.panel_state === this.state.pressed;

		if (grm.button.btn.back && grm.button.btn.back.mouseInThis(x, y) || grm.button.btn.forward && grm.button.btn.forward.mouseInThis(x, y)) {
			return; // Handled in back forward buttons
		}
		if (!this.trace(x, y)) {
			this._change_state(this.state.normal);
			return;
		}
		else {
			this._change_state(this.state.hovered);
			if (!was_pressed) {
				return;
			}
		}

		grm.topMenu.topMenuPlaylists(x, y);

		this.repaint();
	}

	/**
	 * Handles mouse leave events and resets the playlist manager text button state.
	 * @override
	 */
	on_mouse_leave () {
		this._change_state(this.state.normal);
	}

	/**
	 * Handles the button state of the playlist manager text button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_move(x, y, m) {
		if (this.panel_state === this.state.pressed) {
			return;
		}

		this._change_state(this.trace(x, y) ? this.state.hovered : this.state.normal);
	}

	/**
	 * Handles right mouse button down events and changes the playlist manager text button state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_rbtn_down(x, y, m) {
		if (!this.trace(x, y)) {
			return true;
		}

		this._change_state(this.state.pressed);

		return false;
	}

	/**
	 * Handles right mouse button up events and opens the playlist manager.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_rbtn_up(x, y, m) {
		const was_pressed = this.panel_state === this.state.pressed;

		if (!this.trace(x, y)) {
			this._change_state(this.state.normal);
			return true;
		}
		else {
			this._change_state(this.state.hovered);
			if (!was_pressed) {
				return true;
			}
		}

		const cmm = new ContextMainMenu();

		fb.RunMainMenuCommand('View/Playlist Manager'); // PlaylistManager.append_playlist_info_visibility_context_menu_to(cmm);

		if (utils.IsKeyPressed(VKey.SHIFT)) {
			grm.ctxMenu.contextMenuDefault(cmm);
		}

		grm.ui.activeMenu = true;
		cmm.execute(x, y);
		grm.ui.activeMenu = false;

		return true;
	}

	/**
	 * Handles playlist modified events and clears the button name.
	 */
	on_playlist_modified() {
		this.info_text = undefined;
		this.repaint();
	}
	// #endregion
}


////////////////////////////////
// * PLAYLIST META PROVIDER * //
////////////////////////////////
/**
 * A class that provides various metadata for artists, albums, tracks, ratings, playcounts and more.
 */
class PlaylistMetaProvider {
	/**
	 * Creates the `PlaylistMetaProvder` instance.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	constructor(metadb) {
		/** @private @type {FbMetadbHandle} The metadb of the track. */
		this.metadb = metadb;
		/** @public @type {PlaylistRating} The rating instance for the playlist. */
		this.rating = new PlaylistRating();
		/** Initialize all Maps. */
		this.init_metadata_maps();
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Initializes the given meta value if it exists and is not equal to '?', otherwise returns the default value.
	 * Empty meta string values are stored as a question mark '?' placeholder, which are then remapped to the specified default value.
	 * @param {string} value - The meta value to initialize. If the value is an empty string or a question mark '?', it will be considered invalid.
	 * @param {string|string[]} defaultValue - The default value(s) to return if the meta value is invalid. This can be a string or an array of strings.
	 * @param {boolean} toArray - If true, the result will be an array of strings, splitting the valid meta value by commas. If false, the result will be a single string.
	 * @returns {string|string[]} The initialized value, either as a string or an array of strings, or the default value(s) if the meta value is invalid.
	 * @static
	 */
	static initMetaValue(value, defaultValue, toArray) {
		if (value && value !== '?') {
			return toArray ? value.split(',').map(item => item.trim()) : value;
		}
		return defaultValue;
	}

	/**
	 * Initializes the meta map with a default value for the given key if it doesn't already exist.
	 * - For genres, countries, and labels, a new Set is used to avoid duplicates.
	 * - For ratings and playcounts, a number (default 0) is used.
	 * - For other cases, a string is used.
	 * @param {Map<any, string|number|Set<any>>} map - The map to initialize.
	 * @param {any} key - The key to check in the map.
	 * @param {string|number|Set<any>} defaultValue - The default value to set for the key.
	 * @returns {string|number|Set<any>} - The value associated with the key in the map.
	 * @static
	 */
	static initMetaMapValue(map, key, defaultValue) {
		if (!map.has(key)) map.set(key, defaultValue);
		return map.get(key);
	}

	/**
	 * Updates the meta value for a given key in the map by incrementing it.
	 * If the key does not exist, it initializes it with the increment value.
	 * @param {Map<any, number>} map - The map to update.
	 * @param {any} key - The key for which the value should be updated.
	 * @param {number} incrementBy - The value to increment the key's value by.
	 * @returns {number} - The updated value for the key in the map.
	 * @static
	 */
	static updateMetaMapValue(map, key, incrementBy) {
		const updatedValue = (map.get(key) || 0) + incrementBy;
		map.set(key, updatedValue);
		return updatedValue;
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Processes album metadata and updates internal maps and sets.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @private
	 */
	_process_metadata_album_data(metadata) {
		const { artist, album, year, genre, label, country } = metadata;

		// * Set maps have entries for artist and album
		this.artistGenre.set(artist, PlaylistMetaProvider.initMetaMapValue(this.artistGenre, artist, new Set()));
		this.artistCountry.set(artist, PlaylistMetaProvider.initMetaMapValue(this.artistCountry, artist, new Set()));
		this.albumArtist.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumArtist, album, artist));
		this.albumYear.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumYear, album, year));
		this.albumGenre.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumGenre, album, new Set()));
		this.albumLabel.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumLabel, album, new Set()));
		this.albumCountry.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumCountry, album, new Set()));

		// * Set ratings, counts, and playcounts to 0 if they don't exist
		this.artistRatings.set(artist, PlaylistMetaProvider.initMetaMapValue(this.artistRatings, artist, 0));
		this.albumRatings.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumRatings, album, 0));
		this.artistCounts.set(artist, PlaylistMetaProvider.initMetaMapValue(this.artistCounts, artist, 0));
		this.albumCounts.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumCounts, album, 0));
		this.artistPlaycounts.set(artist, PlaylistMetaProvider.initMetaMapValue(this.artistPlaycounts, artist, 0));
		this.albumPlaycounts.set(album, PlaylistMetaProvider.initMetaMapValue(this.albumPlaycounts, album, 0));

		// * Add genres to artist/album, labels to album, and countries to artist/album sets
		for (const genreAlbum of genre) {
			this.artistGenre.get(artist).add(genreAlbum);
			this.albumGenre.get(album).add(genreAlbum);
		}
		for (const labelAlbum of label) {
			this.albumLabel.get(album).add(labelAlbum);
		}
		for (const countryAlbum of country) {
			this.artistCountry.get(artist).add(countryAlbum);
			this.albumCountry.get(album).add(countryAlbum);
		}
	}

	/**
	 * Processes track metadata and updates internal maps and sets.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @private
	 */
	_process_metadata_track_data(metadata) {
		const { artist, album, year, title, genre, label, country, rating, playcount } = metadata;

		this.trackArtist.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackArtist, title, artist));
		this.trackAlbum.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackAlbum, title, album));
		this.trackYear.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackYear, title, year));
		this.trackGenre.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackGenre, title, new Set()));
		this.trackLabel.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackLabel, title, new Set()));
		this.trackCountry.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackCountry, title, new Set()));
		this.trackRatings.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackRatings, title, 0));
		this.trackCounts.set(title, PlaylistMetaProvider.initMetaMapValue(this.trackCounts, title, 0));

		this.artistRatings.set(artist, PlaylistMetaProvider.updateMetaMapValue(this.artistRatings, artist, rating));
		this.albumRatings.set(album, PlaylistMetaProvider.updateMetaMapValue(this.albumRatings, album, rating));
		this.trackRatings.set(title, PlaylistMetaProvider.updateMetaMapValue(this.trackRatings, title, rating));
		this.artistCounts.set(artist, PlaylistMetaProvider.updateMetaMapValue(this.artistCounts, artist, 1));
		this.albumCounts.set(album, PlaylistMetaProvider.updateMetaMapValue(this.albumCounts, album, 1));
		this.trackCounts.set(title, PlaylistMetaProvider.updateMetaMapValue(this.trackCounts, title, 1));
		this.artistPlaycounts.set(artist, PlaylistMetaProvider.updateMetaMapValue(this.artistPlaycounts, artist, playcount));
		this.albumPlaycounts.set(album, PlaylistMetaProvider.updateMetaMapValue(this.albumPlaycounts, album, playcount));
		this.trackPlaycounts.set(title, PlaylistMetaProvider.updateMetaMapValue(this.trackPlaycounts, title, playcount));

		// * Process genre, label, country metadata fields
		for (const genreTrack of genre) {
			this.trackGenre.get(title).add(genreTrack);
			this.genrePlaycounts.set(genreTrack, PlaylistMetaProvider.updateMetaMapValue(this.genrePlaycounts, genreTrack, playcount));
		}

		for (const labelTrack of label) {
			this.trackLabel.get(title).add(labelTrack);
			this.labelPlaycounts.set(labelTrack, PlaylistMetaProvider.updateMetaMapValue(this.labelPlaycounts, labelTrack, playcount));
		}

		for (const countryTrack of country) {
			this.trackCountry.get(title).add(countryTrack);
			this.countryPlaycounts.set(countryTrack, PlaylistMetaProvider.updateMetaMapValue(this.countryPlaycounts, countryTrack, playcount));
		}
	}

	/**
	 * Processes the top-rated stats based on metadata ratings.
	 * @private
	 */
	_process_metadata_top_rated_stats() {
		this.topRatedArtists = SortKeyValuesByAvg(this.artistRatings, this.artistCounts);
		this.topRatedAlbums  = SortKeyValuesByAvg(this.albumRatings, this.albumCounts);
		this.topRatedTracks  = SortKeyValuesByAvg(this.trackRatings, this.trackCounts);
	}

	/**
	 * Processes the top-played stats based on metadata play counts.
	 * @private
	 */
	_process_metadata_top_played_stats() {
		this.topPlayedArtists   = SortKeyValuesByDsc(this.artistPlaycounts);
		this.topPlayedAlbums    = SortKeyValuesByDsc(this.albumPlaycounts);
		this.topPlayedTracks    = SortKeyValuesByDsc(this.trackPlaycounts);
		this.topPlayedGenres    = SortKeyValuesByDsc(this.genrePlaycounts);
		this.topPlayedLabels    = SortKeyValuesByDsc(this.labelPlaycounts);
		this.topPlayedCountries = SortKeyValuesByDsc(this.countryPlaycounts);
	}

	/**
	 * Calculates the total stats from the given metadata.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @private
	 */
	_process_metadata_total_stats(metadata) {
		const artists = new Set();
		const albums = new Set();
		const years = new Set();
		const genres = new Set();
		const labels = new Set();
		const countries = new Set();

		let totalTracks = 0;
		let totalRatings = 0;
		let totalPlaycounts = 0;

		for (const album of metadata.values()) {
			artists.add(album.artist);
			albums.add(album.album);
			years.add(album.year);
			genres.add(album.genre);
			labels.add(album.label);
			countries.add(album.country);

			totalTracks += album.tracks.length;
			for (const track of album.tracks) {
				totalRatings += track.rating;
				totalPlaycounts += track.playcount;
			}
		}

		this.totalArtists = artists.size;
		this.totalAlbums = albums.size;
		this.totalTracks = totalTracks;
		this.totalYears = years.size;
		this.totalGenres = genres.size;
		this.totalLabels = labels.size;
		this.totalCountries = countries.size;
		this.totalRatings = totalRatings;
		this.totalPlaycounts = totalPlaycounts;

		const playcountSum = (playcounts) => [...playcounts.values()].reduce((acc, count) => acc + count, 0);
		this.totalArtistPlays  = playcountSum(this.artistPlaycounts);
		this.totalAlbumPlays   = playcountSum(this.albumPlaycounts);
		this.totalTrackPlays   = playcountSum(this.trackPlaycounts);
		this.totalGenrePlays   = playcountSum(this.genrePlaycounts);
		this.totalLabelPlays   = playcountSum(this.labelPlaycounts);
		this.totalCountryPlays = playcountSum(this.countryPlaycounts);
	}

	/**
	 * Determines the best-rated stats based on average ratings.
	 * @private
	 */
	_process_metadata_best_rated_stats() {
		this.bestRatedArtist = GetKeyByHighestAvg(this.artistRatings, this.artistCounts);
		this.bestRatedAlbum  = GetKeyByHighestAvg(this.albumRatings, this.albumCounts);
		this.bestRatedTrack  = GetKeyByHighestAvg(this.trackRatings, this.trackCounts);
	}

	/**
	 * Determines the most-listened stats based on play counts.
	 * @private
	 */
	_process_metadata_most_listened_stats() {
		this.mostPlayedArtist  = GetKeyByHighestVal(this.artistPlaycounts);
		this.mostPlayedAlbum   = GetKeyByHighestVal(this.albumPlaycounts);
		this.mostPlayedTrack   = GetKeyByHighestVal(this.trackPlaycounts);
		this.mostPlayedGenre   = GetKeyByHighestVal(this.genrePlaycounts);
		this.mostPlayedLabel   = GetKeyByHighestVal(this.labelPlaycounts);
		this.mostPlayedCountry = GetKeyByHighestVal(this.countryPlaycounts);

		this.artistPlaycount  = this.artistPlaycounts.get(this.mostPlayedArtist);
		this.albumPlaycount   = this.albumPlaycounts.get(this.mostPlayedAlbum);
		this.trackPlaycount   = this.trackPlaycounts.get(this.mostPlayedTrack);
		this.genrePlaycount   = this.genrePlaycounts.get(this.mostPlayedGenre);
		this.labelPlaycount   = this.labelPlaycounts.get(this.mostPlayedLabel);
		this.countryPlaycount = this.countryPlaycounts.get(this.mostPlayedCountry);

		this.artistPercentage  = (this.artistPlaycount / this.totalArtistPlays) * 100;
		this.albumPercentage   = (this.albumPlaycount / this.totalAlbumPlays) * 100;
		this.trackPercentage   = (this.trackPlaycount / this.totalTrackPlays) * 100;
		this.genrePercentage   = (this.genrePlaycount / this.totalGenrePlays) * 100;
		this.labelPercentage   = (this.labelPlaycount / this.totalLabelPlays) * 100;
		this.countryPercentage = (this.countryPlaycount / this.totalCountryPlays) * 100;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes all metadata maps.
	 * This method sets up various maps to store metadata information for artists, albums, and tracks.
	 */
	init_metadata_maps() {
		/** @type {Map<string, string>} A map of artist names to their genres. */
		this.artistGenre = new Map();
		/** @type {Map<string, string>} A map of artist names to their countries. */
		this.artistCountry = new Map();

		/** @type {Map<string, string>} A map of album names to their artists. */
		this.albumArtist = new Map();
		/** @type {Map<string, number>} A map of album names to their release years. */
		this.albumYear = new Map();
		/** @type {Map<string, string>} A map of album names to their genres. */
		this.albumGenre = new Map();
		/** @type {Map<string, string>} A map of album names to their labels. */
		this.albumLabel = new Map();
		/** @type {Map<string, string>} A map of album names to their countries. */
		this.albumCountry = new Map();

		/** @type {Map<string, string>} A map of track names to their artists. */
		this.trackArtist = new Map();
		/** @type {Map<string, string>} A map of track names to their albums. */
		this.trackAlbum = new Map();
		/** @type {Map<string, number>} A map of track names to their release years. */
		this.trackYear = new Map();
		/** @type {Map<string, string>} A map of track names to their genres. */
		this.trackGenre = new Map();
		/** @type {Map<string, string>} A map of track names to their labels. */
		this.trackLabel = new Map();
		/** @type {Map<string, string>} A map of track names to their countries. */
		this.trackCountry = new Map();

		/** @type {Map<string, number>} A map of artist names to their ratings. */
		this.artistRatings = new Map();
		/** @type {Map<string, number>} A map of album names to their ratings. */
		this.albumRatings = new Map();
		/** @type {Map<string, number>} A map of track names to their ratings. */
		this.trackRatings = new Map();

		/** @type {Map<string, number>} A map of artist names to their play counts. */
		this.artistCounts = new Map();
		/** @type {Map<string, number>} A map of album names to their play counts. */
		this.albumCounts = new Map();
		/** @type {Map<string, number>} A map of track names to their play counts. */
		this.trackCounts = new Map();

		/** @type {Map<string, number>} A map of artist names to their play counts. */
		this.artistPlaycounts = new Map();
		/** @type {Map<string, number>} A map of album names to their play counts. */
		this.albumPlaycounts = new Map();
		/** @type {Map<string, number>} A map of track names to their play counts. */
		this.trackPlaycounts = new Map();
		/** @type {Map<string, number>} A map of genres to their play counts. */
		this.genrePlaycounts = new Map();
		/** @type {Map<string, number>} A map of labels to their play counts. */
		this.labelPlaycounts = new Map();
		/** @type {Map<string, number>} A map of countries to their play counts. */
		this.countryPlaycounts = new Map();
	}

	/**
	 * Iterates through the current active playlist and builds metadata for each album.
	 * @returns {Map<string, object>} The map where keys are album names and values are objects with properties:
	 * - artist: {string} The name of the artist of the album.
	 * - album: {string} The name of the album.
	 * - title: {string} The title of the album.
	 * - year: {string} The year of the album.
	 * - genre: {string} The genre of the album.
	 * - label: {string} The label the artist is signed to.
	 * - country: {string} The country the artist is from.
	 * - artistAverageRating: {number} The calculated average artist rating.
	 * - artistPlaycount: {number} The calculated total playcount of the artist.
	 * - albumTrackCount: {number} The total number of tracks on the album.
	 * - albumTotalRating: {number} The calculated total rating of all tracks on the album.
	 * - albumTotalPlaycount: {number} The calculated total playcount of all tracks on the album.
	 * - albumAverageRating: {number} The calculated average album rating.
	 * - albumAveragePlaycount: {number} The calculated average album playcount.
	 * - tracks: {Array<Object>} An array of track objects, each with properties:
	 *   - artist: {string} The name of the artist of the track.
	 *   - album: {string} The name of the album the track belongs to.
	 *   - trackNumber: {string} The track number.
	 *   - title: {string} The title of the track.
	 *   - year: {string} The release year of the track.
	 *   - genre: {string} The genre of the track.
	 *   - label: {string} The label the track is signed to.
	 *   - country: {string} The country the artist is from.
	 *   - rating: {number} The rating of the track.
	 *   - playcount: {number} The playcount of the track.
	 *   - fileSize: {number} The file size of the track.
	 *   - length: {number} The length of the track.
	 *   - path: {string} The file path of the track.
	 */
	get_metadata() {
		const metadata = new Map();
		const playlistItems = pl.playlist.playlist_items_array;
		const getArtistRating = this.rating.get_artist_rating();

		const createTrackLevelMeta = (metadata) => ({
			artist: PlaylistMetaProvider.initMetaValue($(grTF.artist, metadata), 'NO ARTIST'),
			album: PlaylistMetaProvider.initMetaValue($('%album%', metadata), 'NO ALBUM'),
			trackNumber: PlaylistMetaProvider.initMetaValue($('%tracknumber%', metadata), '??'),
			title: PlaylistMetaProvider.initMetaValue($('$if2($meta(title),)', metadata), 'NO TRACK TITLE'),
			year: PlaylistMetaProvider.initMetaValue($(grTF.year, metadata), 'NO YEAR'),
			genre: PlaylistMetaProvider.initMetaValue($('%genre%', metadata), ['NO GENRE'], true),
			label: PlaylistMetaProvider.initMetaValue($('$if2(%label%,[%publisher%])', metadata), ['NO LABEL'], true),
			country: PlaylistMetaProvider.initMetaValue($(grTF.artist_country, metadata), ['NO COUNTRY'], true),
			rating: PlaylistMetaProvider.initMetaValue(this.rating.get_track_rating(metadata), 0),
			playcount: PlaylistMetaProvider.initMetaValue(this.get_track_playcount(metadata), 0),
			fileSize: metadata.FileSize,
			length: metadata.Length,
			path: metadata.Path
		});

		const createAlbumLevelMeta = (metadata) => ({
			artist: metadata.artist,
			album: metadata.album,
			trackNumber: metadata.trackNumber,
			title: metadata.title,
			year: metadata.year,
			genre: metadata.genre,
			label: metadata.label,
			country: metadata.country,
			rating: metadata.rating,
			playcount: metadata.playcount,
			artistAverageRating: 0,
			artistPlaycount: 0,
			albumTrackCount: 0,
			albumTotalRating: 0,
			albumTotalPlaycount: 0,
			albumAverageRating: 0,
			albumAveragePlaycount: 0,
			tracks: []
		});

		for (const playlistItem of playlistItems) {
			const track = createTrackLevelMeta(playlistItem);
			const album = metadata.get(track.album) || createAlbumLevelMeta(track);

			// * Update album metadata with track information
			album.albumTrackCount += 1;
			album.albumTotalRating += track.rating;
			album.albumTotalPlaycount += track.playcount;
			album.tracks.push(track);

			this.artistPlaycounts.set(track.artist, (this.artistPlaycounts.get(track.artist) || 0) + track.playcount);
			metadata.set(track.album, album);
		}

		for (const album of metadata.values()) {
			album.artistAverageRating = getArtistRating.get(album.artist) || 0;
			album.artistPlaycount = this.artistPlaycounts.get(album.artist) || 0;
			album.albumAverageRating = album.albumTrackCount ? Number((album.albumTotalRating / album.albumTrackCount).toFixed(2)) : 0;
			album.albumAveragePlaycount = album.albumTrackCount ? Math.round(album.albumTotalPlaycount / album.albumTrackCount) : 0;
		}

		return metadata;
	}

	/**
	 * Gets metadata statistics for artists, albums, and tracks from the current active playlist.
	 * Sets default values where data is missing, computes various stats like ratings, counts, playcounts, and sorts them to find top rated and most played entries.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @returns {object} An object with aggregated metadata statistics, including:
	 * - Mappings of artists to genres, countries, and their ratings, counts, and playcounts.
	 * - Mappings of albums to artists, years, genres, labels, countries, and their ratings, counts, and playcounts.
	 * - Mappings of tracks to artists, albums, years, genres, labels, and their ratings, counts.
	 * - Sorted lists of top rated and most played artists, albums, tracks, genres, labels, and countries.
	 * - Total play counts for artists, albums, tracks, genres, labels, and countries.
	 */
	get_metadata_stats(metadata) {
		this.init_metadata_maps();

		for (const album of metadata.values()) {
			this._process_metadata_album_data(album);
			for (const track of album.tracks) {
				this._process_metadata_track_data({ ...track, ...album });
			}
		}

		this._process_metadata_top_rated_stats();
		this._process_metadata_top_played_stats();
		this._process_metadata_total_stats(metadata);
		this._process_metadata_best_rated_stats();
		this._process_metadata_most_listened_stats();

		return {
			artistGenre: this.artistGenre, artistCountry: this.artistCountry,
			albumArtist: this.albumArtist, albumYear: this.albumYear, albumGenre: this.albumGenre,
			albumLabel: this.albumLabel, albumCountry: this.albumCountry,
			trackArtist: this.trackArtist, trackAlbum: this.trackAlbum, trackYear: this.trackYear, trackGenre: this.trackGenre, trackLabel: this.trackLabel, trackCountry: this.trackCountry,

			artistRatings: this.artistRatings, albumRatings: this.albumRatings, trackRatings: this.trackRatings,
			artistCounts: this.artistCounts, albumCounts: this.albumCounts, trackCounts: this.trackCounts,
			artistPlaycounts: this.artistPlaycounts, albumPlaycounts: this.albumPlaycounts, trackPlaycounts: this.trackPlaycounts, genrePlaycounts: this.genrePlaycounts, labelPlaycounts: this.labelPlaycounts, countryPlaycounts: this.countryPlaycounts,

			topRatedArtists: this.topRatedArtists, topRatedAlbums: this.topRatedAlbums, topRatedTracks: this.topRatedTracks,
			topPlayedArtists: this.topPlayedArtists, topPlayedAlbums: this.topPlayedAlbums, topPlayedTracks: this.topPlayedTracks, topPlayedGenres: this.topPlayedGenres, topPlayedLabels: this.topPlayedLabels, topPlayedCountries: this.topPlayedCountries,

			totalArtists: this.totalArtists, totalAlbums: this.totalAlbums, totalTracks: this.totalTracks, totalYears: this.totalYears, totalGenres: this.totalGenres, totalLabels: this.totalLabels, totalCountries: this.totalCountries, totalRatings: this.totalRatings, totalPlaycounts: this.totalPlaycounts,
			totalArtistPlays: this.totalArtistPlays, totalAlbumPlays: this.totalAlbumPlays, totalTrackPlays: this.totalTrackPlays, totalGenrePlays: this.totalGenrePlays, totalLabelPlays: this.totalLabelPlays, totalCountryPlays: this.totalCountryPlays,

			bestRatedArtist: this.bestRatedArtist, bestRatedAlbum: this.bestRatedAlbum, bestRatedTrack: this.bestRatedTrack,

			mostPlayedArtist: this.mostPlayedArtist, mostPlayedAlbum: this.mostPlayedAlbum, mostPlayedTrack: this.mostPlayedTrack, mostPlayedGenre: this.mostPlayedGenre, mostPlayedLabel: this.mostPlayedLabel, mostPlayedCountry: this.mostPlayedCountry,
			artistPlaycount: this.artistPlaycount, albumPlaycount: this.albumPlaycount, trackPlaycount: this.trackPlaycount, genrePlaycount: this.genrePlaycount, labelPlaycount: this.labelPlaycount, countryPlaycount: this.countryPlaycount,
			artistPercentage: this.artistPercentage, albumPercentage: this.albumPercentage, trackPercentage: this.trackPercentage, genrePercentage: this.genrePercentage, labelPercentage: this.labelPercentage, countryPercentage: this.countryPercentage
		};
	}

	/**
	 * Calculate Peak Loudness Ratio keeping in mind replayGain 2.0 is implemented in Foobar2000.
	 * Reference value in Foobar 2000 is set on -18 LUFS in order to maintain backwards compatibility with RG1, RG2.
	 * EBU R 128 reference is -23 LUFS.
	 * @param {string} gain - The ReplayGain gain value for track %replaygain_track_gain% | for album %replaygain_album_gain%.
	 * @param {string} peak - The ReplayGain peak value for track %replaygain_track_peak_db% | for album %replaygain_album_peak_db%.
	 * @returns {string} The Peak Loudness Ratio.
	 */
	get_PLR(gain, peak) {
		const lufs = -2300 - (Number(gain.replace(/[^0-9+-]/g, '')) - 500);
		const tpfs = Number(peak.replace(/[^0-9+-]/g, ''));
		const plr = tpfs - lufs;
		const plr_value = plr % 100 > 49 ? plr + 100 : plr;

		return Math.floor(plr_value / 100);
	}

	/**
	 * Gets the playcount for a given track.
	 * If no track is provided, it defaults to the current playlist row.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 * @returns {number} The playcount of the provided or default track.
	 */
	get_track_playcount(metadb) {
		if (plSet.use_rating_from_tags) {
			const fileInfo = metadb.GetFileInfo();
			const ratingIdx = fileInfo.MetaFind('PLAY COUNT');
			const playcount = ratingIdx !== -1 ? fileInfo.MetaValue(ratingIdx, 0) : 0;
			return playcount === '' ? null : Number(playcount);
		}

		const playcount = $('%play_count%', metadb);
		return playcount === '' ? null : Number(playcount);
	}
	// #endregion
}


///////////////////////////////
// * PLAYLIST META MANAGER * //
///////////////////////////////
/**
 * A class that handles metadata operations including retrieving album metadata,
 * and writing meta tags or playlist stats to a file.
 */
class PlaylistMetaManager {
	/**
	 * Creates the `PlaylistMetaManager` instance.
	 */
	constructor() {
		/**
		 * The artwork configuration settings used for checking missing artwork images.
		 * @type {object}
		 * @property {object} albumArt - The configuration for album artwork.
		 * @property {string[]} albumArt.files - The list of filenames for album artwork.
		 * @property {string[]} albumArt.patterns - The list of patterns for album artwork.
		 * @property {string[]} albumArt.paths - The paths to search for album artwork.
		 * @property {object} albumArt.checks - The different types of checks for album artwork.
		 * @property {string[]} albumArt.checks.albumArt - The types of album artwork checks.
		 * @property {string[]} albumArt.checks.albumArtLocal - The types of local album artwork checks.
		 * @property {string[]} albumArt.checks.albumArtEmbedded - The types of embedded album artwork checks.
		 * @property {RegExp} albumArt.regex - The regex pattern for album artwork.
		 * @property {object} discArt - The configuration for disc artwork.
		 * @property {string[]} discArt.files - The list of filenames for disc artwork.
		 * @property {string[]} discArt.patterns - The list of patterns for disc artwork.
		 * @property {string[]} discArt.paths - The paths to search for disc artwork.
		 * @property {RegExp} discArt.regex - The regex pattern for disc artwork.
		 */
		this.artworkConfig = {
			albumArt: {
				files: ['cover.jpg', 'cover.png', 'folder.jpg', 'folder.png', 'front.jpg', 'front.png'],
				patterns: ['folder', 'cover', 'front'],
				paths: grCfg.imgPaths,
				checks: { albumArt: ['local', 'embedded'], albumArtLocal: ['local'], albumArtEmbedded: ['embedded'] },
				regex: /(\*|\b(folder|cover|front)\b)\.\*/g
			},
			discArt: {
				files: ['cd.png', 'disc.png', 'vinyl.png'],
				patterns: ['cd', 'disc', 'vinyl'],
				paths: grCfg.discArtPaths,
				regex: /(\*|\b(cd|disc|vinyl)\b)\.\*/g
			}
		};

		/** @public @type {?PlaylistMetaProvider} The instance of the PlaylistMetaProvider class. */
		this.meta_provider = new PlaylistMetaProvider();
		/** @public @type {Map<string, any>} The sorted metadata cache. */
		this.metadataSortedCache = new Map();
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Initializes a metadata field based on the inclusion flag and the provided field value.
	 * @param {boolean} include - The flag setting indicating whether to include the field.
	 * @param {string} metadataField - The value of the metadata field to be initialized.
	 * @returns {string} The metadata field value if `include` is true, otherwise an empty string.
	 * @static
	 */
	static initMetaValue(include, metadataField) {
		return include ? metadataField : '';
	}

	/**
	 * Checks if a meta value is invalid.
	 * @param {string|Array<string>} value - The meta value to initialize.
	 * @param {string} [customInvalidValue] - The additional values to consider as invalid.
	 * @returns {boolean} - True if the value is invalid, false otherwise.
	 */
	static initInvalidMetaValue(value, customInvalidValue) {
		if (!value || value === customInvalidValue) {
			return true;
		}

		if (Array.isArray(value)) {
			return value.some(v => PlaylistMetaManager.initInvalidMetaValue(v, customInvalidValue));
		}

		if (typeof value === 'string') {
			const trimmedValue = value.trim();
			return trimmedValue === '' || trimmedValue === '?';
		}

		return false;
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Converts the metadata map to an array and sorts it if a sort function is provided.
	 * Caches the result to avoid redundant computation.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {string} statsType - The statistic type to be used for sorting.
	 * @returns {Array} - The sorted metadata array.
	 * @private
	 */
	_get_metadata_sorted(metadata, statsType) {
		if (this.metadataSortedCache.has(statsType)) {
			return this.metadataSortedCache.get(statsType);
		}

		const sortFunction = this._get_stats_sorting(statsType);
		const metadataArray = Array.from(metadata.values());
		const sortedMetadata = sortFunction ? metadataArray.sort(sortFunction) : metadataArray;

		this.metadataSortedCache.set(statsType, sortedMetadata);
		return sortedMetadata;
	}

	/**
	 * Chooses and returns either the `rating` or `playcount` based on the `statsType`.
	 * The `statsType` string should be in the format 'property_subproperty'.
	 * If it has three parts ('property_subproperty_subproperty'), the third subproperty determines the return value.
	 * If `statsType` does not indicate 'rating', 'artistPlaycount', or 'trackPlaycount', the function defaults to returning the `rating`.
	 * @param {string} statsType - The type of stats to return, expected to be either 'rating', 'artistPlaycount', or 'trackPlaycount'.
	 * @param {number} rating - The rating value to return if `statsType` is 'rating' or invalid.
	 * @param {number} playcount - The playcount value to return if `statsType` is 'artistPlaycount' or 'trackPlaycount'.
	 * @returns {number} The `rating` or `playcount` value, based on the `statsType`.
	 * @private
	 */
	_get_stats_by_type(statsType, rating, playcount) {
		const statsArray = statsType.split('_');
		const statsProperty = statsArray.length === 3 ? statsArray[2] : statsArray[0];
		return ['artistPlaycount', 'trackPlaycount'].includes(statsProperty) ? playcount : rating;
	}

	/**
	 * Gets a sorting function based on the provided statistic type.
	 * The statistic type string should be in the format 'property_direction'.
	 * The property indicates the statistic to sort by, and the direction indicates the order ('asc' for ascending, 'dsc' for descending).
	 * @param {string} statsType - The statistic type to sort by.
	 * @returns {function(any, any): number} The sorting function.
	 * @private
	 */
	_get_stats_sorting(statsType) {
		const sortMethods = {
			artist: (a, b) => CompareValues(a.artist, b.artist),
			artistRating: (a, b) => CompareValues(a.artistAverageRating, b.artistAverageRating),
			artistPlaycount: (a, b) => CompareValues(a.artistPlaycount, b.artistPlaycount),
			albumTitle: (a, b) => CompareValues(a.album, b.album),
			albumRating: (a, b) => CompareValues(a.albumAverageRating, b.albumAverageRating),
			albumPlaycount: (a, b) => CompareValues(a.albumAveragePlaycount, b.albumAveragePlaycount),
			albumPlaycountTotal: (a, b) => CompareValues(a.albumTotalPlaycount, b.albumTotalPlaycount),
			albumTrackPlaycount: (a, b) => CompareValues(a.albumTotalPlaycount, b.albumTotalPlaycount),
			trackTitle: (a, b) => CompareValues(a.track, b.track),
			trackRating: (a, b) => CompareValues(a.rating, b.rating),
			trackPlaycount: (a, b) => CompareValues(a.playcount, b.playcount),
			year: (a, b) => CompareValues(a.year, b.year),
			genre: (a, b) => CompareValues(a.genre, b.genre),
			label: (a, b) => CompareValues(a.label, b.label),
			country: (a, b) => CompareValues(a.country, b.country)
		};

		const [property, direction] = statsType.split('_');
		const sortMethod = sortMethods[property];

		// Retrieve sortMethod from sortMethods with the given property.
		// If 'dsc', sort descending by reversing arguments; otherwise, sort ascending.
		return sortMethod && ((direction === 'dsc') ? (a, b) => sortMethod(b, a) : sortMethod);
	}

	/**
	 * Generates a list of artist ratings.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {object} settings - The settings that specify which metadata to include.
	 * @param {string} statsType - The statistic type to be used for sorting.
	 * @returns {string} - The formatted string of artist ratings.
	 * @private
	 */
	_generate_artist_list(metadata, settings, statsType) {
		const artists = new Set();
		const artistMetadata = [];
		const artistMetadataSorted = this._get_metadata_sorted(metadata, statsType);

		for (const album of artistMetadataSorted) {
			if (album.artist && !artists.has(album.artist)) {
				const stat = this._get_stats_by_type(statsType, album.artistAverageRating, album.artistPlaycount);
				if (stat !== null) {
					artistMetadata.push({ artist: album.artist, stat });
					artists.add(album.artist);
				}
			}
		}

		return artistMetadata.map(({ artist, stat }) => `${artist}: ${stat}`).join('\n');
	}

	/**
	 * Generates a list of album statistics.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {object} settings - The settings that specify which metadata to include.
	 * @param {string} statsType - The statistic type to be used for sorting.
	 * @param {string} ratingType - The type of rating to include (e.g., 'albumAverage', 'albumTotal').
	 * @param {string} playcountType - The type of playcount to include (e.g., 'albumAverage', 'albumTotal').
	 * @returns {string} - The formatted string of album statistics.
	 * @private
	 */
	_generate_album_list(metadata, settings, statsType, ratingType, playcountType) {
		const albumMetadataSorted = this._get_metadata_sorted(metadata, statsType);

		return albumMetadataSorted.map((metadata) => {
			const separator = settings.includeArtist && settings.includeAlbum ? ' - ' : '';
			const artist  = PlaylistMetaManager.initMetaValue(settings.includeArtist, `${metadata.artist}${separator}`);
			const album   = PlaylistMetaManager.initMetaValue(settings.includeAlbum, metadata.album);
			const year    = PlaylistMetaManager.initMetaValue(settings.includeYear, metadata.year);
			const genre   = PlaylistMetaManager.initMetaValue(settings.includeGenre, metadata.genre);
			const label   = PlaylistMetaManager.initMetaValue(settings.includeLabel, metadata.label);
			const country = PlaylistMetaManager.initMetaValue(settings.includeCountry, metadata.country);

			const includeParts = [year, genre, label, country].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';

			const albumTracksRating =
				settings.includeTrack && metadata.tracks ? `\n${metadata.tracks.map(trackRating =>
					` ${trackRating.trackNumber}. ${trackRating.title}${settings.includeStats ? `: ${trackRating.rating}` : ''}`
				).join('\n')}` : '';

			const ratingTypeMeta = {
				artistAverage: settings.includeStats && metadata.artistAverageRating,
				albumAverage: settings.includeStats && metadata.albumAverageRating,
				albumTotal: settings.includeStats && metadata.albumTotalRating,
				albumTracks: albumTracksRating
			};

			const albumTracksPlaycount =
				settings.includeTrack && metadata.tracks ? `\n${metadata.tracks.map(trackPlaycount =>
					` ${trackPlaycount.trackNumber}. ${trackPlaycount.title}${settings.includeStats ? `: ${trackPlaycount.playcount}` : ''}`
				).join('\n')}` : '';

			const playcountTypeMeta = {
				albumAverage: settings.includeStats && metadata.albumAveragePlaycount,
				albumTotal: settings.includeStats && metadata.albumTotalPlaycount,
				albumTracks: albumTracksPlaycount
			};

			const typeMeta = ratingType ? ratingTypeMeta : playcountTypeMeta;
			const typeKey = ratingType || playcountType;
			const typeValue = `: ${typeMeta[typeKey]}`;
			const typeAvg = settings.includeStats ? `: ${ratingType ? metadata.albumAverageRating : metadata.albumAveragePlaycount}` : '';

			if (typeKey) {
				return typeKey === 'albumTracks' ?
				`${artist}${album}${include}${typeAvg}${typeValue}\n` :
				`${artist}${album}${include}${typeValue}`;
			} else {
				return `${artist}${album}${include}`;
			}
		}).join('\n');
	}

	/**
	 * Generates a list of track statistics.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {object} settings - The settings that specify which metadata to include.
	 * @param {string} statsType - The type of statistics to include (e.g., 'rating', 'playcount').
	 * @returns {string} - The formatted string of track statistics.
	 * @private
	 */
	_generate_track_list(metadata, settings, statsType) {
		const trackMetadata = [];

		for (const album of metadata.values()) {
			for (const track of album.tracks) {
				trackMetadata.push({
					artist: album.artist,
					album: album.album,
					trackNumber: track.trackNumber,
					title: track.title,
					year: album.year,
					genre: album.genre,
					label: album.label,
					country: album.country,
					rating: track.rating,
					playcount: track.playcount
				});
			}
		}

		const trackMetadataSorted = this._get_metadata_sorted(trackMetadata, statsType);

		return trackMetadataSorted.map((metadata) => {
			const artist  = PlaylistMetaManager.initMetaValue(settings.includeArtist, metadata.artist);
			const album   = PlaylistMetaManager.initMetaValue(settings.includeAlbum, metadata.album);
			const track   = PlaylistMetaManager.initMetaValue(settings.includeTrack, `${metadata.trackNumber}. ${metadata.title}`);
			const year    = PlaylistMetaManager.initMetaValue(settings.includeYear, metadata.year);
			const genre   = PlaylistMetaManager.initMetaValue(settings.includeGenre, metadata.genre);
			const label   = PlaylistMetaManager.initMetaValue(settings.includeLabel, metadata.label);
			const country = PlaylistMetaManager.initMetaValue(settings.includeCountry, metadata.country);

			const includeParts = [year, genre, label, country].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';

			const rating    = settings.includeStats ? `: ${metadata.rating}` : '';
			const playcount = settings.includeStats ? `: ${metadata.playcount}` : '';

			const separator1 = settings.includeTrack && settings.includeAlbum ? ' - ' : '';
			const separator2 = (settings.includeAlbum && settings.includeArtist) || (settings.includeTrack && settings.includeArtist) ? ' - ' : '';

			return `${track}${separator1}${album}${include}${separator2}${artist}${this._get_stats_by_type(statsType, rating, playcount)}`;
		}).join('\n');
	}

	/**
	 * Generates a formatted string of total and top statistics from the current active playlist.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {string} statsType - The string that indicates whether to return 'rating' or 'playcount' total statistics.
	 * @param {string} topStatsType - The string that indicates whether to return 'topRated' or 'topPlayed' statistics.
	 * @returns {string} The formatted string with the requested statistics.
	 * @private
	 */
	_generate_total_top_stats(metadata, statsType, topStatsType) {
		const rating = statsType.toLowerCase().includes('rating') || statsType.toLowerCase().includes('rated');
		const playcount = statsType.toLowerCase().includes('playcount') || statsType.toLowerCase().includes('played');
		let list = '';

		list += 'Total statistics:\n'
			+ ` \u00B7 Artists: ${metadata.totalArtists}\n`
			+ ` \u00B7 Albums: ${metadata.totalAlbums}\n`
			+ ` \u00B7 Tracks: ${metadata.totalTracks}\n`
			+ ` \u00B7 Years: ${metadata.totalYears}\n`
			+ ` \u00B7 Genres: ${metadata.totalGenres}\n`
			+ ` \u00B7 Labels: ${metadata.totalLabels}\n`
			+ ` \u00B7 Countries: ${metadata.totalCountries}\n`
			+ (rating ? ` \u00B7 Ratings: ${metadata.totalRatings}\n` : '')
			+ (playcount ? ` \u00B7 Playcounts: ${metadata.totalPlaycounts}\n` : '') + '\n';

		if (topStatsType === 'topRated') {
			list += 'Top statistics:\n'
				+ ` \u00B7 Best rated artist: ${metadata.bestRatedArtist}\n`
				+ ` \u00B7 Best rated album: ${metadata.bestRatedAlbum}\n`
				+ ` \u00B7 Best rated track: ${metadata.bestRatedTrack}\n\n\n`;
		}

		if (topStatsType === 'topPlayed') {
			list += 'Top statistics:\n'
				+ ` \u00B7 Most played artist: ${metadata.mostPlayedArtist} - ${metadata.artistPlaycount} plays (${metadata.artistPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played album: ${metadata.mostPlayedAlbum} - ${metadata.albumPlaycount} plays (${metadata.albumPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played track: ${metadata.mostPlayedTrack} - ${metadata.trackPlaycount} plays (${metadata.trackPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played genre: ${metadata.mostPlayedGenre} - ${metadata.genrePlaycount} plays (${metadata.genrePercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played label: ${metadata.mostPlayedLabel} - ${metadata.labelPlaycount} plays (${metadata.labelPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played country: ${metadata.mostPlayedCountry} - ${metadata.countryPlaycount} plays (${metadata.countryPercentage.toFixed(2)}%)\n\n\n`;
		}

		return list;
	}

	/**
	 * Generates top rated statistics list for:
	 * - Top rated artists
	 * - Top rated albums
	 * - Top rated tracks
	 *
	 * It provides a detailed ranked list from top to bottom for each category from the current active playlist.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {object} settings - The settings that specify which metadata to include.
	 * @returns {string} The string formatted for display, containing the top statistics.
	 * @private
	 */
	_generate_top_rated_list(metadata, settings) {
		const data = this.meta_provider.get_metadata_stats(metadata);
		let list = '';

		const generateList = (header, items, getItemDetails) => {
			list += `${WriteFancyHeader(header)}\n`;
			let index = 0;
			for (const item of items) {
				const details = getItemDetails(item);
				if (details) {
					list += `${index + 1}: ${details}\n`;
					index++;
				}
			}
			list += '\n\n';
		};

		const getArtistDetails = (artist) => {
			const country = settings.includeCountry ? Array.from(data.artistCountry.get(artist) || []).join(', ') : '';
			const genre = settings.includeGenre ? Array.from(data.artistGenre.get(artist) || []).join(', ') : '';
			const include = country || genre ? ` (${country}${country && genre ? ' \u00B7 ' : ''}${genre})` : '';
			const average = data.artistRatings.get(artist) / data.artistCounts.get(artist);
			const stats = settings.includeStats ? `: ${average.toFixed(2)}` : '';
			return `${artist}${include}${stats}`;
		};

		const getAlbumDetails = (album) => {
			const year = settings.includeYear && data.albumYear.get(album) ? `${data.albumYear.get(album)}` : '';
			const genreSet = data.albumGenre.get(album);
			const genre = settings.includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
			const labelSet = data.albumLabel.get(album);
			const label = settings.includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
			const includeParts = [year, genre, label].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
			const artist = settings.includeArtist && data.albumArtist.get(album) ? ` - ${data.albumArtist.get(album)}` : '';
			const average = data.albumRatings.get(album) / data.albumCounts.get(album);
			const stats = settings.includeStats ? `: ${average.toFixed(2)}` : '';
			return `${album}${include}${artist}${stats}`;
		};

		const getTrackDetails = (track) => {
			const album = settings.includeAlbum && data.trackAlbum.get(track) ? ` - ${data.trackAlbum.get(track)}` : '';
			const year = settings.includeYear && data.trackYear.get(track) ? `${data.trackYear.get(track)}` : '';
			const genreSet = data.trackGenre.get(track);
			const genre = settings.includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
			const labelSet = data.trackLabel.get(track);
			const label = settings.includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
			const includeParts = [year, genre, label].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
			const artist = settings.includeArtist && data.trackArtist.get(track) ? ` - ${data.trackArtist.get(track)}` : '';
			const average = data.trackRatings.get(track);
			const stats = settings.includeStats ? `: ${average.toFixed(2)}` : '';
			return `${track}${album}${include}${artist}${stats}`;
		};

		generateList('Top rated artists', data.topRatedArtists, getArtistDetails);
		generateList('Top rated albums', data.topRatedAlbums, getAlbumDetails);
		generateList('Top rated tracks', data.topRatedTracks, getTrackDetails);

		return list;
	}

	/**
	 * Generates top played statistics list for:
	 * - Top played artists
	 * - Top played albums
	 * - Top played tracks
	 * - Top played genres
	 * - Top played labels
	 * - Top played countries
	 *
	 * It provides a detailed ranked list from top to bottom for each category from the current active playlist.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {object} settings - The settings that specify which metadata to include.
	 * @returns {string} The string formatted for display, containing the top statistics.
	 * @private
	 */
	_generate_top_played_list(metadata, settings) {
		const data = this.meta_provider.get_metadata_stats(metadata);
		let list = '';

		const generateList = (header, items, getItemDetails) => {
			list += `${WriteFancyHeader(header)}\n`;
			let index = 0;
			for (const item of items) {
				const details = getItemDetails(item);
				if (details) {
					list += `${index + 1}: ${details}\n`;
					index++;
				}
			}
			list += '\n\n';
		};

		const getArtistDetails = (artist) => {
			const country = settings.includeCountry ? Array.from(data.artistCountry.get(artist) || []).join(', ') : '';
			const genre = settings.includeGenre ? Array.from(data.artistGenre.get(artist) || []).join(', ') : '';
			const include = country || genre ? ` (${country}${country && genre ? ' \u00B7 ' : ''}${genre})` : '';
			const playcount = data.artistPlaycounts.get(artist);
			const percentage = (playcount / data.totalArtistPlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${artist}${include}${stats}`;
		};

		const getAlbumDetails = (album) => {
			const year = settings.includeYear && data.albumYear.get(album) ? data.albumYear.get(album) : '';
			const genreSet = data.albumGenre.get(album);
			const genre = settings.includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
			const labelSet = data.albumLabel.get(album);
			const label = settings.includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
			const includeParts = [year, genre, label].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
			const artist = settings.includeArtist && data.albumArtist.get(album) ? ` - ${data.albumArtist.get(album)}` : '';
			const playcount = data.albumPlaycounts.get(album);
			const percentage = (playcount / data.totalAlbumPlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${album}${include}${artist}${stats}`;
		};

		const getTrackDetails = (track) => {
			const album = settings.includeAlbum && data.trackAlbum.get(track) ? ` - ${data.trackAlbum.get(track)}` : '';
			const year = settings.includeYear && data.trackYear.get(track) ? data.trackYear.get(track) : '';
			const genreSet = data.trackGenre.get(track);
			const genre = settings.includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
			const labelSet = data.trackLabel.get(track);
			const label = settings.includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
			const includeParts = [year, genre, label].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
			const artist = settings.includeArtist && data.trackArtist.get(track) ? ` - ${data.trackArtist.get(track)}` : '';
			const playcount = data.trackPlaycounts.get(track);
			const percentage = (playcount / data.totalTrackPlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${track}${album}${include}${artist}${stats}`;
		};

		const getGenreDetails = (genre) => {
			const playcount = data.genrePlaycounts.get(genre);
			const percentage = (playcount / data.totalGenrePlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${genre}${stats}`;
		};

		const getLabelDetails = (label) => {
			const playcount = data.labelPlaycounts.get(label);
			const percentage = (playcount / data.totalLabelPlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${label}${stats}`;
		};

		const getCountryDetails = (country) => {
			const playcount = data.countryPlaycounts.get(country);
			const percentage = (playcount / data.totalCountryPlays) * 100;
			const stats = settings.includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';
			return `${country}${stats}`;
		};

		generateList('Top played artists', data.topPlayedArtists, getArtistDetails);
		generateList('Top played albums', data.topPlayedAlbums, getAlbumDetails);
		generateList('Top played tracks', data.topPlayedTracks, getTrackDetails);
		generateList('Top played genres', data.topPlayedGenres, getGenreDetails);
		generateList('Top played labels', data.topPlayedLabels, getLabelDetails);
		generateList('Top played countries', data.topPlayedCountries, getCountryDetails);

		return list;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes and builds a Map indexing the playlist items by their paths.
	 * @returns {Map<string, object>} The map where the keys are the paths of the playlist items, and the values are the corresponding objects from the playlist.
	 */
	init_metadata_path_index() {
		const metadataPathIndex = new Map();

		for (const item of pl.playlist.playlist_items_array) {
			metadataPathIndex.set(item.Path, item);
		}

		return metadataPathIndex;
	}

	/**
	 * Checks for the presence of artwork files (album art or disc art) in the directories of tracks in the playlist.
	 * Depending on the `artworkType`, it searches for different sets of artwork file patterns.
	 * @param {Map<string, object>} metadata - The metadata map.
	 * @param {Map<string, object>} metadataPathIndex - The map indexing playlist items by their paths.
	 * @param {string} artworkType - The type of artwork to search for, either 'albumArt' or 'discArt'.
	 * @returns {object} - The object containing a boolean `hasArtwork` indicating if artwork was found, and the `path` to the artwork file if found, or the original track path if not.
	 */
	check_missing_artwork(metadata, metadataPathIndex, artworkType) {
		const artworkPath = metadata.path.replace(/[^/\\]*$/, '');
		const imageConfig = this.artworkConfig[artworkType.includes('albumArt') ? 'albumArt' : 'discArt'];
		const artworkCheck = imageConfig.checks ? imageConfig.checks[artworkType] : ['local'];

		const trackHandle = metadataPathIndex.get(metadata.path);
		if (!trackHandle) return { hasArtwork: false, path: metadata.path };

		const checkLocalArtwork = () => {
			const imagePathList = [];
			const imageFileExtensions = new Map(imageConfig.files.map(file => [file, file.split('.').pop()]));
			const rawImagePathList = $(imageConfig.paths, trackHandle).split(',')
				.map(path => artworkType === 'discArt' ? path.replace(/\*/g, '') : path.trim());

			// * Process each raw image path to handle cases where paths are split by commas
			for (const rawPath of rawImagePathList) {
				if (imagePathList.length > 0 && rawPath.startsWith(' ')) {
					imagePathList[imagePathList.length - 1] += `,${rawPath.trim()}`;
				} else {
					imagePathList.push(rawPath.trim());
				}
			}

			// * Check each image path for the presence of artwork files
			return imagePathList.some(imagePath =>
				imageConfig.files.some(file => {
					const fileExtension = imageFileExtensions.get(file);
					const filePath = CreateFilePathWithPatterns(imagePath, file, fileExtension, imageConfig.patterns, imageConfig.regex);
					const fullPath = imagePath.includes(':') ? filePath : `${artworkPath}${filePath}`;
					return fullPath.startsWith(artworkPath) && IsFile(fullPath);
				})
			);
		};

		if (artworkCheck.includes('local') && checkLocalArtwork()) {
			return { hasArtwork: true, path: metadata.path };
		}

		if (artworkCheck.includes('embedded') && utils.GetAlbumArtV2(trackHandle, 0)) {
			return { hasArtwork: true, path: metadata.path };
		}

		return { hasArtwork: false, path: metadata.path };
	}

	/**
	 * Writes calculated %ARTISTRATING%, %ARTISTPLAYCOUNT%, %ALBUMRATING%, '%ALBUMPLAYCOUNT%' and '%ALBUMPLAYCOUNTTOTAL%' values to music files via the Playlist context menu.
	 * - '%ARTISTRATING%': The calculated average artist rating, converted from a 0-5 scale to a 0-100 scale due to Foobar2000's incompatibility with floating point numbers when sorting.
	 * - '%ARTISTPLAYCOUNT%': The calculated total playcount of the artist.
	 * - '%ALBUMRATING%': The calculated average album rating, converted from a 0-5 scale to a 0-100 scale due to Foobar2000's incompatibility with floating point numbers when sorting.
	 * - '%ALBUMPLAYCOUNT%': The calculated average playcount of the album.
	 * - '%ALBUMPLAYCOUNTTOTAL%': The calculated total playcount of all tracks on the album.
	 */
	write_album_stats_to_tags() {
		const metadata = this.meta_provider.get_metadata();
		const handleList = new FbMetadbHandleList();
		const plItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const libItems = new FbMetadbHandleList(lib.pop.getHandleList('newItems'));
		const items = grm.ui.displayLibrary && !grm.ui.displayPlaylist || grm.ui.displayLibrarySplit() && grm.ui.state.mouse_x < grm.ui.ww * 0.5 ? libItems : plItems;

		if (!items || !items.Count) return;

		const albumMetadata = new Map();
		const albumUpdates = [];

		for (const item of items) {
			const albumName = $('%album%', item);
			if (!albumMetadata.has(albumName)) {
				albumMetadata.set(albumName, []);
			}
			albumMetadata.get(albumName).push(item);
		}

		for (const [albumName, items] of albumMetadata.entries()) {
			const metadataEntry = metadata.get(albumName);
			if (!metadataEntry) continue;
			const albumStats = {};

			if (metadataEntry.artistAverageRating) {
				albumStats.ARTISTRATING = ConvertRatingToPercentage(metadataEntry.artistAverageRating);
			}
			if (metadataEntry.artistPlaycount) {
				albumStats.ARTISTPLAYCOUNT = metadataEntry.artistPlaycount;
			}
			if (metadataEntry.albumAverageRating) {
				albumStats.ALBUMRATING = ConvertRatingToPercentage(metadataEntry.albumAverageRating);
			}
			if (metadataEntry.albumAveragePlaycount) {
				albumStats.ALBUMPLAYCOUNT = metadataEntry.albumAveragePlaycount;
			}
			if (metadataEntry.albumTotalPlaycount) {
				albumStats.ALBUMPLAYCOUNTTOTAL = metadataEntry.albumTotalPlaycount;
			}

			if (Object.keys(albumStats).length > 0) {
				for (const item of items) {
					handleList.Add(item);
					albumUpdates.push(albumStats);
				}
			}
		}

		if (albumUpdates.length) {
			handleList.UpdateFileInfoFromJSON(JSON.stringify(albumUpdates));
		}
	}

	/**
	 * Writes various statistics for the current playlist to a text file.
	 * @param {string} metadataType - The type of metadata: 'artist', 'album', 'track', 'topRated', or 'topPlayed'.
	 * @param {string} filePath - The path to the text file where statistics will be written.
	 * @param {string} statsName - The name of the statistic type.
	 * @param {string} statsType - The statistic type to be used for sorting.
	 * @param {string} ratingType - The rating type, one of 'artistAverage', 'albumAverage', 'albumTotal', or 'albumTracks'.
	 * @param {string} playcountType - The playcount type, one of 'artistPlaycount', 'albumAverage', 'albumTotal', or 'albumTracks'.
	 * @returns {boolean} True if writing to the text file was successful, false otherwise.
	 */
	write_stats_to_text_file(metadataType, filePath, statsName, statsType, ratingType, playcountType) {
		grm.msg.showPopupNotice('contextMenu', 'writingList');

		this.metadataSortedCache = new Map();
		const metadata = this.meta_provider.get_metadata();

		const settings = {
			includeArtist:  plSet.playlist_stats_include_artist,
			includeAlbum:   plSet.playlist_stats_include_album,
			includeTrack:   plSet.playlist_stats_include_track,
			includeYear:    plSet.playlist_stats_include_year,
			includeGenre:   plSet.playlist_stats_include_genre,
			includeLabel:   plSet.playlist_stats_include_label,
			includeCountry: plSet.playlist_stats_include_country,
			includeStats:   plSet.playlist_stats_include_stats
		};

		const metadataStats = this.meta_provider.get_metadata_stats(metadata);
		const playlistStats = settings.includeStats ? this._generate_total_top_stats(metadataStats, statsType, metadataType) : '\n';
		const playlistName  = ReplaceFileChars(plman.GetPlaylistName(plman.ActivePlaylist));
		const playlistTitle = `${playlistName} - ${statsName} statistics${metadataType.startsWith('top') ? '' : ` - sorted by ${statsType}`}`;
		const playlistData  = `${WriteFancyHeader(playlistTitle)}\n\n${playlistStats}`;

		const statsList = {
			artist:    () => this._generate_artist_list(metadata, settings, statsType),
			album:     () => this._generate_album_list(metadata, settings, statsType, ratingType, playcountType),
			track:     () => this._generate_track_list(metadata, settings, statsType),
			topRated:  () => this._generate_top_rated_list(metadata, settings),
			topPlayed: () => this._generate_top_played_list(metadata, settings)
		};

		const data = statsList[metadataType] ? statsList[metadataType]() : '';
		return Save(filePath, playlistData + data);
	}

	/**
	 * Writes a list of tracks with missing metadata fields.
	 * The method checks for missing playlist files, artist names, album titles, track numbers, track titles, genres, years, labels, and countries.
	 * @param {string} type - The specific type of metadata to check: 'files', 'artist_name', 'album_title', 'track_number', 'track_title', 'genre', 'year', 'label', 'country'.
	 * @param {string} filePath - The path to the text file where diagnostics will be written.
	 * @returns {boolean} True if writing to the text file was successful, false otherwise.
	 */
	write_diagnostics_to_text_file(type, filePath) {
		grm.msg.showPopupNotice('contextMenu', 'writingList');

		const metadata = this.meta_provider.get_metadata();
		const metadataPathIndex = this.init_metadata_path_index();

		const checkArtwork = (metadata, type) =>
			this.check_missing_artwork(metadata, metadataPathIndex, type).hasArtwork ? null : { path: metadata.path };

		const checkMetaValue = (metadata, field, defaultValue) =>
			PlaylistMetaManager.initInvalidMetaValue(metadata[field], defaultValue) ? { path: metadata.path } : null;

		const diagnosticsFiles = {
			album_art: (metadata) => checkArtwork(metadata, 'albumArt'),
			album_art_local: (metadata) => checkArtwork(metadata, 'albumArtLocal'),
			album_art_embedded: (metadata) => checkArtwork(metadata, 'albumArtEmbedded'),
			disc_art: (metadata) => checkArtwork(metadata, 'discArt'),
			playlist_files: (metadata) => IsFile(metadata.path) ? null : { path: metadata.path }
		};

		const diagnosticsTags = {
			artist_name: (metadata) => checkMetaValue(metadata, 'artist', 'NO ARTIST'),
			album_title: (metadata) => checkMetaValue(metadata, 'album', 'NO ALBUM'),
			track_number: (metadata) => checkMetaValue(metadata, 'trackNumber', '??'),
			track_title: (metadata) => checkMetaValue(metadata, 'title', 'NO TRACK TITLE'),
			year: (metadata) => checkMetaValue(metadata, 'year', 'NO YEAR'),
			genre: (metadata) => checkMetaValue(metadata, 'genre', 'NO GENRE'),
			label: (metadata) => checkMetaValue(metadata, 'label', 'NO LABEL'),
			country: (metadata) => checkMetaValue(metadata, 'country', 'NO COUNTRY')
		};

		const diagnostics = { ...diagnosticsFiles, ...diagnosticsTags };

		const diagnosticTypes = (type) => {
			if (type === 'checkFiles') {
				return [...new Set(Object.keys(diagnosticsFiles).map(type =>
					['album_art', 'album_art_local', 'album_art_embedded'].includes(type) ? plSet.playlist_diagnostic_album_art : type))];
			}
			else if (type === 'checkTags') {
				return Object.keys(diagnosticsTags);
			}
			else {
				return [type];
			}
		};

		const runDiagnostics = (metadata, diagnostics) => (type) => {
			const diagnosticsFunc = diagnostics[type];
			const result = new Map();

			for (const album of metadata.values()) {
				for (const track of album.tracks) {
					if (diagnosticsFunc(track)) {
						result.set(track.path, track);
					}
				}
			}

			return result;
		};

		const generateList = (list, type) => {
			const header = WriteFancyHeader(`Missing ${type.replace(/_/g, ' ')}`);
			const listItems = Array.from(list.values(), item => item.path);
			return [header, ...listItems, '\n\n'].join('\n');
		};

		const output = diagnosticTypes(type).reduce((acc, type) => {
			const result = runDiagnostics(metadata, diagnostics)(type);
			return acc + generateList(result, type);
		}, '');

		return Save(filePath, output);
	}
	// #endregion
}
