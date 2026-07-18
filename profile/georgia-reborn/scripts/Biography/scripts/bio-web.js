/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Biography Web                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-07-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////
// * CUSTOM XHR MANAGER * //
////////////////////////////
/**
 * A custom XMLHttpRequest Manager.
 * Provides custom async XHR with request tracking or ActiveX fallback.
 *
 * @requires utils.HTTPRequestAsync (optional, falls back to ActiveX)
 */
class BioXMLHttpRequestManager {
	/**
	 * Creates the `BioXMLHttpRequestManager` instance.
	 */
	constructor() {
		/** @public @type {Map<string, string>} The pending URLs mapped by path. */
		this.pendingUrls = new Map();
		/** @public @type {Map<number, BioXMLHttpRequest>} The active requests by task ID. */
		this.requests = new Map();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Registers task with request instance.
	 * @param {number} taskId - The task ID from utils.HTTPRequestAsync.
	 * @param {BioXMLHttpRequest} request - The BioXMLHttpRequest instance.
	 */
	addRequest(taskId, request) {
		this.requests.set(taskId, request);
	}

	/**
	 * Creates XMLHttpRequest instance.
	 * @param {boolean} [bBuiltIn=true] - The flag to use custom impl (true) or ActiveX (false).
	 * @returns {BioXMLHttpRequest|ActiveXObject} The new XMLHttpRequest instance.
	 */
	createRequest(bBuiltIn = true) {
		if (typeof utils !== 'undefined' && utils.HTTPRequestAsync && bBuiltIn) {
			return new BioXMLHttpRequest(this);
		}
		return new ActiveXObject('Microsoft.XMLHTTP');
	}

	/**
	 * Removes request from tracking.
	 * @param {number} taskId - The task identifier.
	 * @returns {boolean} The success state if removed (true).
	 */
	removeRequest(taskId) {
		return this.requests.delete(taskId);
	}

	/**
	 * Aborts all active requests (e.g., on shutdown).
	 */
	clearAll() {
		const requests = Array.from(this.requests.values());

		for (const req of requests) {
			try {
				req.abort();
			} catch (e) {
				/* ignore */
			}
		}

		this.requests.clear();
	}

	/**
	 * Gets active request count.
	 * @returns {number} The count of active requests.
	 */
	getActiveCount() {
		return this.requests.size;
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * The file download completion handler.
	 * Must be called from on_download_file_done() in host class.
	 * @param {string} path - The file path.
	 * @param {boolean} success - The success state.
	 * @param {string} errorText - The error text string.
	 */
	on_download_file_done(path, success, errorText) {
		const url = this.pendingUrls.get(path) || '(unknown URL)';
		this.pendingUrls.delete(path);
		if (!success) {
			console.log(`Biography - Error saving img:\n\tPath: ${path}\n\tURL: ${url}\n\tError: ${errorText}`);
		}
	}

	/**
	 * The HTTP request completion handler.
	 * Must be called from on_http_request_done() in host class.
	 * @param {number} taskId - The task identifier.
	 * @param {boolean} success - The request succeeded state.
	 * @param {string} responseText - The response body text.
	 * @param {number|string} status - The HTTP status code.
	 * @param {string} headers - The response headers (JSON string).
	 */
	on_http_request_done(taskId, success, responseText, status, headers) {
		const request = this.requests.get(taskId);

		if (!request || request._aborted) {
			this.removeRequest(taskId);
			return;
		}

		try {
			request._finalize(success, responseText, status, headers); // Pass headers
		} catch (e) {
			console.log('XHR callback error:', e);
		} finally {
			this.removeRequest(taskId); // Always cleanup to prevent leaks
		}
	}
	// #endregion
}


////////////////////
// * CUSTOM XHR * //
////////////////////
/**
 * A Custom XMLHttpRequest compatible with standard XHR API.
 * Wraps utils.HTTPRequestAsync for async operations.
 */
class BioXMLHttpRequest {
	/**
	 * Creates the `BioXMLHttpRequest` instance.
	 * @param {BioXMLHttpRequestManager} manager - The xhr manager instance.
	 */
	constructor(manager) {
		// Instance
		/** @public @type {BioXMLHttpRequestManager} The reference to the manager instance. */
		this.manager = manager;

		// Internal state
		/** @private @type {number|null} The task ID from utils.HTTPRequestAsync. */
		this.id = null;
		/** @private @type {string|null} The request URL. */
		this.url = null;
		/** @private @type {number} The HTTP method (0=GET, 1=POST). */
		this.type = 0;
		/** @private @type {Object|null} The request headers (lazy init for memory efficiency). */
		this.headers = null;
		/** @private @type {boolean} The abort flag. */
		this.aborted = false;

		// XHR standard state
		/** @private @type {number} The XHR ready state (0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 4=DONE). */
		this._readyState = 0;
		/** @private @type {string|null} The response headers. */
		this._responseHeaders = null;
		/** @private @type {string|null} The response body text. */
		this._responseText = null;
		/** @private @type {number} The HTTP status code. */
		this._status = 0;

		// Pre-bind legacy methods
		/** @private @type {Function} The bound reference to the open() method for PascalCase compatibility. */
		this._boundOpen = this.open.bind(this);
		/** @private @type {Function} The bound reference to the setRequestHeader() method for PascalCase compatibility. */
		this._boundSetRequestHeader = this.setRequestHeader.bind(this);
		/** @private @type {Function} The bound reference to the send() method for PascalCase compatibility. */
		this._boundSend = this.send.bind(this);
		/** @private @type {Function} The bound reference to the abort() method for PascalCase compatibility. */
		this._boundAbort = this.abort.bind(this);

		// Callback
		/** @public @type {Function|null} The ready state change callback. */
		this.onreadystatechange = null;
	}

	// * Standard XHR GETTERS * //
	// #region Standard XHR GETTERS
	/**
	 * Gets the current ready state of the request.
	 * @returns {number} The ready state (0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 4=DONE).
	 */
	get readyState() {
		return this._readyState;
	}

	/**
	 * Gets the response headers.
	 * @returns {string|null} The response headers or null if not available.
	 */
	get responseHeaders() {
		return this._responseHeaders;
	}

	/**
	 * Gets the response body as text.
	 * @returns {string|null} The response text or null if not available.
	 */
	get responseText() {
		return this._responseText;
	}

	/**
	 * Gets the HTTP status code of the response.
	 * @returns {number} The HTTP status code.
	 */
	get status() {
		return this._status;
	}
	// #endregion

	// * LEGACY ACTIVEX COMPATIBILITY LAYER * //
	// #region ACTIVEX COMPATIBILITY
	/**
	 * Legacy property: Gets the current ready state (PascalCase alias for readyState).
	 * @returns {number} The ready state.
	 */
	get ReadyState() {
		return this.readyState;
	}

	/**
	 * Legacy property: Gets the response body as text (PascalCase alias for responseText).
	 * @returns {string|null} The response text.
	 */
	get ResponseText() {
		return this.responseText;
	}

	/**
	 * Legacy method: Sets HTTP header (PascalCase alias for setRequestHeader).
	 * @returns {Function} The bound setRequestHeader method.
	 */
	get SetRequestHeader() {
		return this._boundSetRequestHeader;
	}

	/**
	 * Legacy method: Aborts request if in progress (PascalCase alias for abort).
	 * @returns {Function} The bound abort method.
	 */
	get Abort() {
		return this._boundAbort;
	}

	/**
	 * Legacy method: Initializes request (PascalCase alias for open).
	 * @returns {Function} The bound open method.
	 */
	get Open() {
		return this._boundOpen;
	}

	/**
	 * Legacy method: Sends HTTP request (PascalCase alias for send).
	 * @returns {Function} The bound send method.
	 */
	get Send() {
		return this._boundSend;
	}

	/**
	 * Legacy property: Gets the HTTP status code (PascalCase alias for status).
	 * @returns {number} The HTTP status code.
	 */
	get Status() {
		return this.status;
	}

	// Legacy No-Op Methods
	/**
	 * Legacy method: Placeholder for WinHttp.WinHttpRequest.5.1 SetTimeouts().
	 * This implementation uses external timers and is a no-op.
	 */
	SetTimeouts() {}

	/**
	 * Legacy method: Placeholder for WinHttp.WinHttpRequest.5.1 WaitForResponse().
	 * This implementation uses the onreadystatechange callback and is a no-op.
	 */
	WaitForResponse() {}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Finalizes request with response (called by manager).
	 * @param {boolean} success - The success status.
	 * @param {string} responseText - The response body text.
	 * @param {number|string} status - The HTTP status code.
	 * @param {string} headers - The response headers.
	 * @private
	 */
	_finalize(success, responseText, status, headers) {
		this._readyState = 4; // DONE
		this._status = parseInt(status, 10) || (success ? 200 : 0); // Use parseInt for stricter coercion
		this._responseText = (responseText != null) ? String(responseText) : null;
		this._responseHeaders = headers || null; // Store if provided
		this._triggerCallback();
	}

	/**
	 * Resets to UNSENT state.
	 * @param {boolean} emitCallback - The flag to trigger onreadystatechange.
	 * @private
	 */
	_reset(emitCallback) {
		if (this.id !== null) {
			this.manager.removeRequest(this.id);
			this.id = null;
		}

		this._readyState = 0;
		this._status = 0;
		this._responseText = null;
		this._responseHeaders = null;

		if (emitCallback) this._triggerCallback();
	}

	/**
	 * Safely invokes onreadystatechange callback.
	 * @private
	 */
	_triggerCallback() {
		if (typeof this.onreadystatechange === 'function') {
			try {
				this.onreadystatechange.call(this);
			}
			catch (e) {
				console.log('XHR onreadystatechange error:', e);
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Aborts request if in progress.
	 */
	abort() {
		if (this._readyState === 0 || this._readyState === 4) return;
		this.aborted = true;
		this._reset(true); // Trigger callback on abort (XHR standard behavior)
	}

	/**
	 * Initializes request (allows reuse after completion/abort per XHR spec).
	 * @param {string} type - The HTTP method (GET/POST).
	 * @param {string} url - The request URL.
	 */
	open(type, url) {
		if (typeof url !== 'string' || !url) {
			throw new Error('XHR.open: Valid URL required');
		}

		// Standard allows reuse: reset if not UNSENT/DONE
		if (this._readyState !== 0 && this._readyState !== 4) {
			this._reset(false); // Silent reset mid-request
		}

		this.url = url;
		this.type = (String(type).toUpperCase() === 'GET') ? 0 : 1;
		this.headers = null; // Reset headers on new open()
		this._responseHeaders = null; // Reset response headers
		this.aborted = false;
		this._readyState = 1; // OPENED
	}

	/**
	 * Sets HTTP header (after open, before send).
	 * @param {string} key - The header name.
	 * @param {string} value - The header value.
	 */
	setRequestHeader(key, value) {
		if (this._readyState !== 1) {
			throw new Error('XHR.setRequestHeader: Call open() first');
		}

		if (!this.headers) {
			this.headers = {}; // Lazy init
		}

		this.headers[String(key)] = String(value);
	}

	/**
	 * Sends HTTP request.
	 * @param {string} [body] - The request body (POST only).
	 */
	send(body) {
		if (this._readyState !== 1) {
			throw new Error('XHR.send: Call open() first');
		}

		if (this.aborted) {
			throw new Error('Cannot send aborted request');
		}

		try {
			const headerJson = this.headers ? JSON.stringify(this.headers) : undefined;
			const postBody = (this.type === 1 && body !== undefined) ? String(body) : undefined;
			this.id = utils.HTTPRequestAsync(this.type, this.url, headerJson, postBody);

			if (typeof this.id !== 'number' || this.id <= 0) {
				throw new Error('HTTPRequestAsync failed (invalid ID)');
			}

			this.manager.addRequest(this.id, this);
			this._readyState = 2; // HEADERS_RECEIVED
			this._triggerCallback();
		}
		catch (e) {
			console.log('XHR.send error:', e);
			this._reset(false);
			throw e; // Propagate to caller
		}
	}
	// #endregion
}


//////////////////
// * WEB DATA * //
//////////////////
/**
 * A class that handles biography related web data operations.
 * Manages similar artist data caching and file operations.
 */
class BioWebData {
	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Parses data from file path or returns raw data.
	 * @param {string|Array<Object>} fileOrData - The file path or data array.
	 * @returns {Array<Object>|null} The parsed data array or null.
	 * @private
	 */
	_parseData(fileOrData) {
		return typeof fileOrData === 'string' ? $Bio.jsonParse(fileOrData, null, 'file-utf8') : fileOrData;
	}

	/**
	 * Generates lookup key for artist with optional MBID.
	 * @param {string} artist - The artist name.
	 * @param {string} [mbid] - The MusicBrainz ID.
	 * @returns {string} The composite lookup key.
	 * @private
	 */
	_getKey(artist, mbid = '') {
		return `${artist}|${mbid}`;
	}

	/**
	 * Sorts artist values by score in descending order.
	 * @param {Array<Object>} data - The artist data array to sort.
	 * @private
	 */
	_sortByScore(data) {
		if (!data) return;

		for (const obj of data) {
			obj.val.sort((a, b) => b.score - a.score);
		}
	}

	/**
	 * Writes data to file with proper formatting.
	 * @param {string} file - The destination file path.
	 * @param {Array<Object>} data - The data array to save.
	 * @private
	 */
	_saveToFile(file, data) {
		const json = JSON.stringify(data, null, '\t').replace(Regex.BreakNewline, '\r\n');
		$Bio.save(file, json);
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Downloads an image or array of images.
	 * @param {string} dir - The target directory path.
	 * @param {string} prefix - The file prefix for the image.
	 * @param {string|Array<string>} links - The URL or array of URLs to download.
	 */
	downloadImage(dir, prefix, links) {
		const linkArray = Array.isArray(links) ? links : [links];
		if (!linkArray.length) return;

		const existingImages = utils.Glob(`${dir}${prefix}_*_*.jpg`);
		const maxIndex = existingImages.length > 0 ?
			Math.max(...existingImages.map(p => {
				const match = p.match(/_(\d+)_/);
				return match ? parseInt(match[1]) : 0;
			})) : 0;

		let imageIndex = maxIndex + 1;
		const useCurl = bioCfg.useCurlDownload && CurlDownloadManager.isAvailable();

		for (const url of linkArray) {
			const paddedIndex = String(imageIndex).padStart(2, '0');
			const imPth = `${dir}${prefix}_${paddedIndex}_original.jpg`;

			if (useCurl) {
				bioCurl.startDownload(url, imPth, {
					referer: 'https://www.last.fm/',
					onError: (err) => {
						$Bio.trace(`curl download failed for ${imPth}, falling back:\n\t${err}`);
						this.downloadImageLegacy(url, imPth);
					}
				});
			} else {
				this.downloadImageLegacy(url, imPth);
			}

			imageIndex++;
		}
	}

	/**
	 * Pre-curl download path (utils.DownloadFileAsync, or the VBS/cscript fallback).
	 * Used on systems without curl.exe, and as a last resort if a curl download itself fails.
	 * @param {string} url - The URL of the image to download.
	 * @param {string} imPth - The target image file path.
	 * @private
	 */
	downloadImageLegacy(url, imPth) {
		if (utils.DownloadFileAsync) {
			bioXHR.pendingUrls.set(imPth, url);
			utils.DownloadFileAsync(url, imPth);
		} else {
			$Bio.run(`cscript //nologo "${bioCfg.storageFolder}foo_lastfm_img.vbs" "${url}" "${imPth}"`, 0);
		}
	}

	/**
	 * Merges similar artist data from file with new data.
	 * Creates a unified dataset, updating existing entries and adding new ones.
	 * All artist entries are sorted by score in descending order.
	 * @param {string|Array<Object>} fileOrData - The file path to JSON data or parsed data array.
	 *   Each object should have: { artist: string, mbid?: string, val: Array<{score: number}> }
	 * @param {Array<Object>|null} [newData=null] - The new data to merge with existing data.
	 * @returns {Array<Object>|null} The merged and sorted data array, or null if no data available.
	 */
	getSimilarDataFromFile(fileOrData, newData = null) {
		const data = this._parseData(fileOrData);

		if (!data) return newData;

		if (!newData) {
			this._sortByScore(data);
			return data;
		}

		// Build index map with both specific (with MBID) and fallback (artist only) keys
		const dataMap = new Map();

		data.forEach((obj, i) => {
			const keyWithMbid = this._getKey(obj.artist, obj.mbid);
			dataMap.set(keyWithMbid, i);
			// Only set artist-only key if not already present (first match wins)
			if (!dataMap.has(obj.artist)) {
				dataMap.set(obj.artist, i);
			}
		});

		// Merge new data: update existing or append new
		for (const obj of newData) {
			const keyWithMbid = this._getKey(obj.artist, obj.mbid);
			let idx = dataMap.get(keyWithMbid);

			if (idx === undefined) {
				idx = dataMap.get(obj.artist);
			}

			if (idx === undefined) {
				data.push(obj);
			} else {
				data[idx] = obj;
			}
		}

		this._sortByScore(data);
		return data;
	}

	/**
	 * Validates if existing images of a certain type are present.
	 * @param {string} type - The image type identifier.
	 * @param {string} folder - The search folder path.
	 * @param {number} [minCount=1] - The minimum required image count.
	 * @returns {boolean} The boolean indicating if the criteria is met.
	 */
	hasExistingImages(type, folder, minCount = 1) {
		if (!$Lib.folder(folder)) return false;

		const files = utils.Glob(`${folder}*.jpg`) || [];

		// Filter out thumb and update.txt
		const validImages = files.filter(f => {
			const name = bioFSO.GetFileName(f);
			return !name.includes('_thumb') && name !== 'update.txt';
		});

		return validImages.length >= minCount;
	}

	/**
	 * Checks if file data already contains all entries from new data.
	 * Used to avoid unnecessary file writes when data hasn't changed.
	 * @param {string|Array<Object>} fileOrData - The file path to JSON data or parsed data array.
	 * @param {Array<Object>} newData - The new data to check against existing data.
	 * @returns {boolean} The boolean confirming if all new data entries exist in file data.
	 */
	hasSimilarData(fileOrData, newData) {
		const data = this._parseData(fileOrData);

		if (!data || !newData) return false;

		// Build set of existing entries
		const existingKeys = new Set();

		for (const obj of data) {
			existingKeys.add(this._getKey(obj.artist, obj.mbid));
			existingKeys.add(obj.artist);
		}

		// Check if all new entries exist
		for (const obj of newData) {
			const hasWithMbid = existingKeys.has(this._getKey(obj.artist, obj.mbid));
			const hasArtist = existingKeys.has(obj.artist);
			if (!hasWithMbid && !hasArtist) return false;
		}

		return true;
	}

	/**
	 * Updates similar artist data file with new entries.
	 * Only writes to disk if new data is not already present.
	 * Creates file if it doesn't exist.
	 * @param {string} file - The path to the JSON cache file.
	 * @param {Array<Object>} newData - The new artist data to add/update.
	 */
	updateSimilarDataFile(file, newData) {
		const fileExists = $Bio.file(file);

		if (fileExists && this.hasSimilarData(file, newData)) {
			return; // No update needed
		}

		const data = fileExists ? this.getSimilarDataFromFile(file, newData) : newData;

		if (fileExists) bioFSO.DeleteFile(file);
		this._saveToFile(file, data);
	}
	// #endregion
}


/**
 * The instance of `BioXMLHttpRequestManager` class for biography xhr request operations.
 * @typedef {BioXMLHttpRequestManager}
 * @global
 */
const bioXHR = new BioXMLHttpRequestManager();

/**
 * The instance of `BioWebData` class for biography xhr request operations.
 * @typedef {BioWebData}
 * @global
 */
const bioWebData = new BioWebData();
