/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Components                      * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    06-05-2024                                              * //
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

		if (!this._alpha_timer_internal) {
			this._alpha_timer_internal = setInterval(() => {
				for (const part in this.sb_parts) {
					const item = this.sb_parts[part];
					switch (item.state) {
						case 'normal':
							item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
							item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
							item.pressed_alpha = part === 'thumb' ? Math.max(0, item.pressed_alpha -= hoverOutStep) : Math.max(0, item.pressed_alpha -= downOutStep);
							break;
						case 'hover':
							item.hover_alpha = Math.min(255, item.hover_alpha += hoverInStep);
							item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
							item.pressed_alpha = Math.max(0, item.pressed_alpha -= downOutStep);
							break;
						case 'pressed':
							item.hover_alpha = 0;
							item.hot_alpha = 0;
							item.pressed_alpha = 255;
							break;
						case 'hot':
							item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
							item.hot_alpha = Math.min(255, item.hot_alpha += hoverInStep);
							item.pressed_alpha = Math.max(0, item.pressed_alpha -= downOutStep);
							break;
					}
					// console.log(i, item.state, item.hover_alpha , item.pressed_alpha , item.hot_alpha);
					// item.repaint();
				}

				this.repaint();

				const alpha_in_progress = Object.values(this.sb_parts).some((item) =>
					(item.hover_alpha > 0 && item.hover_alpha < 255)
					|| (item.pressed_alpha > 0 && item.pressed_alpha < 255)
					|| (item.hot_alpha > 0 && item.hot_alpha < 255));

				if (!alpha_in_progress) {
					this._stopAlphaTimer();
				}
			}, 25);
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
					grClip.DrawString(item.ico, item.font, icoColor, 0, RES._4K ? -25 : -12, w, h, btn_format);
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
		window.RepaintRect(this.x - (RES._4K ? 13 : 6), this.y, this.w, this.h);
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
		this.thumb_h = Math.max(Math.round(this.scrollbar_h * this.rows_drawn / this.row_count), RES._4K ? 45 : 30);
		this.scrollbar_travel = this.scrollbar_h - this.thumb_h;
		// * Scrolling info
		this.scrollable_lines = this.row_count - this.rows_drawn;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
	}

	/**
	 * Creates the button and thumb scrollbar parts.
	 */
	create_parts() {
		this._create_dynamic_scrollbar_images(this.w, this.thumb_h);

		const { x, y, w, h } = this;

		this.sb_parts = {
			lineUp:   new PlaylistScrollbarPart(x - (RES._4K ? 13 : 6), y, w, this.btn_h, this.scrollbar_images.lineUp),
			thumb:    new PlaylistScrollbarPart(x, y + this.thumb_y, w - SCALE(14), this.thumb_h, this.scrollbar_images.thumb),
			lineDown: new PlaylistScrollbarPart(x - (RES._4K ? 13 : 6), y + h - this.btn_h, w, this.btn_h, this.scrollbar_images.lineDown)
		};
	}

	/**
	 * Handles mouse wheel scrolling events.
	 * @param {number} wheel_direction - The up or down wheel direction.
	 */
	wheel(wheel_direction) {
		const direction = -wheel_direction;
		const scrollStep = direction * grSet.playlistWheelScrollSteps;
		const newScroll = this.nearestScroll(direction);

		if (this.scrollbar_wheel_scroll_page) {
			this.shift_page(direction);
			return;
		}

		if (typeof this.desiredScrollPosition === 'undefined') {
			this.desiredScrollPosition = newScroll;
		}

		this.desiredScrollPosition += scrollStep;
		this.desiredScrollPosition = Math.max(0, Math.min(this.desiredScrollPosition, this.scrollable_lines));

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
	 * Handles left mouse button up events on the scrollbar.
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
		if (direction === 0) return this.scroll;

		const scrollFloor = Math.floor(this.scroll);
		const scrollShift = this.scroll - scrollFloor;
		const drawnShift = 1 - (this.rows_drawn - Math.floor(this.rows_drawn));

		if (direction < 0) {
			return scrollShift !== 0 ? scrollFloor : this.scroll + direction;
		}
		else if (Math.abs(drawnShift - scrollShift) > 0.0001) {
			return (drawnShift > scrollShift ? scrollFloor : Math.ceil(this.scroll)) + drawnShift;
		}
		else {
			return this.scroll + direction;
		}
	}

	/**
	 * Stops the scrollbar scroll and clears the timer.
	 */
	stopScrolling() {
		clearInterval(this.smoothScrollTimer);
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
		clearInterval(this.smoothScrollTimer);

		const startPos = this.scroll;
		const totalDistance = endPos - startPos;
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
				Math.abs(newPosition - newVal) < 0.1
				||
				totalDistance > 0 && newVal >= newPosition
				||
				totalDistance < 0 && newVal <= newPosition;

			const scrollPos = newPosition === 0 ? 0 : Math.round(newVal * 100) / 100;

			this.scroll_to(scrollPos, false);

			if (isEnding || newPosition <= 0) {
				animationProgress = 100;
				this.desiredScrollPosition = undefined;
				this.stopScrolling();
				return;
			}

			this.smoothScrollTimer = setTimeout(_scrollStep, grSet.playlistWheelScrollDuration / 10);
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
			}, grm.ui.newTrackFetchingDone + 200);
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
		DebugLog(`Checking for duplicate playlist states took: ${Date.now() - start}ms`);
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
				if (grm.ui.btn.back) {
					grm.ui.btn.back.repaint();
					grm.ui.btn.forward.repaint();
				}
				DebugLog('stateIndex:', this.stateIndex, ' new items count:', plItems.Count, this.stateIndex);
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
		DebugLog('pl.history back =>', this.stateIndex);
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
		DebugLog('pl.history forward =>', this.stateIndex);
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
		const rowFontSize = grSet[`playlistFontSize_${grSet.layout}`];
		/** @private @type {number} */
		this.btn_w = SCALE(rowFontSize + 2);

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
		const y = this.y - (RES._4K ? 3 : 1);

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

		pl.album_ratings.clear();
		const new_rating = Math.floor((x - this.x) / this.btn_w) + 1;
		const current_rating = this.get_rating();

		if (plSet.use_rating_from_tags) {
			if (!this.metadb.RawPath.startsWith('http')) {
				const handle = new FbMetadbHandleList();
				handle.Add(this.metadb);
				handle.UpdateFileInfoFromJSON(
					JSON.stringify({
						RATING: (current_rating === new_rating) ? '' : new_rating
					})
				);
			}
		}
		else {
			fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${current_rating === new_rating ? '<not set>' : new_rating}`, this.metadb);
		}

		this.rating = (current_rating === new_rating) ? 0 : new_rating;
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
	 * Gets the rating for the current track.
	 * If no rating has been fetched yet, it fetches the rating using the get_track_rating method.
	 * @returns {number|null} The rating of the current track, or null if no rating.
	 */
	get_rating() {
		const trackId = $('%rating%', this.metadb);
		let rating = pl.track_ratings.get(trackId);

		if (rating === undefined) {
			rating = this.get_track_rating(this.metadb);
			pl.track_ratings.set(trackId, rating);
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
	 * Gets the average rating for an album.
	 * @returns {number} The average rating of all tracks in the album.
	 */
	get_album_rating() {
		// Return cached results if available
		if (pl.album_ratings.size !== 0) {
			return pl.album_ratings;
		}

		const albums = new Map();
		const playlistItems = plman.GetPlaylistItems(plman.ActivePlaylist).Convert();

		// Group tracks by album
		for (let i = 0; i < playlistItems.length; ++i) {
			const albumName  = $('%album%', playlistItems[i]);
			const rating = this.get_track_rating(playlistItems[i]);

			const albumData = albums.get(albumName);
			if (albumData === undefined) {
				albums.set(albumName, { albumTotalRating: rating, albumTrackCount: 1 });
			} else {
				albumData.albumTotalRating += rating;
				albumData.albumTrackCount++;
			}
		}

		// Calculate average rating for each album
		for (const [albumName, albumData] of albums) {
			const albumAverageRating = Number((albumData.albumTotalRating / albumData.albumTrackCount).toFixed(2));
			pl.album_ratings.set(albumName, albumAverageRating);
		}

		return pl.album_ratings;
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
			window.RepaintRect(this.x, this.y, this.w, this.h);
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
	 */
	static append_playlist_info_visibility_context_menu_to(parent_menu) {
		const showPlaylistManager = grSet[`showPlaylistManager_${grSet.layout}`];
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
		}, { is_checked: showPlaylistManager });
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
		const headerFontSize      = grSet[`playlistHeaderFontSize_${grSet.layout}`];
		const showPlaylistManager = grSet[`showPlaylistManager_${grSet.layout}`];
		let text_color;
		let bg_color;

		switch (panel_state) {
			case this.state.normal: {
				text_color = grSet.styleBlend && grSet.autoHidePlman || !showPlaylistManager ? '' : pl.col.plman_text_normal;
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
		gr.SetTextRenderingHint(grSet.styleBlend || grSet.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

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

		const info_text_format = Stringformat.align_center | Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
		gr.DrawString(this.info_text, pl.font.title_selected, text_color, x, y, w, h, info_text_format);

		// * Playlist history buttons
		const yCorrSize = {
			22: { '4K': 14, 'HD':  7 },
			20: { '4K': 12, 'HD':  5 },
			18: { '4K': 10, 'HD':  3 },
			17: { '4K':  8, 'HD':  2 },
			16: { '4K':  7, 'HD':  1 },
			15: { '4K':  4, 'HD':  0 },
			14: { '4K':  4, 'HD':  0 },
			13: { '4K':  2, 'HD': -1 },
			12: { '4K':  2, 'HD': -1 },
			10: { '4K': -2, 'HD': -3 }
		};
		const yCorr = yCorrSize[headerFontSize] && yCorrSize[headerFontSize][RES._4K ? '4K' : 'HD'];
		const info_w = gr.CalcTextWidth(this.info_text, pl.font.title_selected);
		const btn_x = Math.round((pl.playlist.x) + (pl.playlist.w - info_w) * 0.5);
		const btn_y = grm.ui.topMenuHeight + yCorr;
		const btns_w = Math.round(h);
		const hasPlaylistHistory = pl.history.canBack() || pl.history.canForward();
		const showBtns = (grSet.autoHidePlman && (panel_state !== this.state.normal) || !grSet.autoHidePlman);

		if (grSet.showPlaylistHistory && hasPlaylistHistory && showPlaylistManager) {
			grm.ui.btn.back = new Button(showBtns ? btn_x - btns_w + yCorr : 9999, btn_y, h, h, 'Back', grm.ui.btnImg.Back, null, pl.history.canBack.bind(pl.history));
			grm.ui.btn.forward = new Button(showBtns ? btn_x + info_w + yCorr : 9999, btn_y, h, h, 'Forward', grm.ui.btnImg.Forward, null, pl.history.canForward.bind(pl.history));
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
		key_handler.register_key_action(VK_KEY_N,
			(modifiers) => {
				if (modifiers.ctrl) {
					plman.CreatePlaylist(plman.PlaylistCount, '');
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				}
			});

		key_handler.register_key_action(VK_KEY_M,
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
		if (grm.ui.btn.back && grm.ui.btn.back.mouseInThis(x, y) || grm.ui.btn.forward && grm.ui.btn.forward.mouseInThis(x, y)) {
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

		if (grm.ui.btn.back && grm.ui.btn.back.mouseInThis(x, y) || grm.ui.btn.forward && grm.ui.btn.forward.mouseInThis(x, y)) {
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

		if (utils.IsKeyPressed(VK_SHIFT)) {
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
