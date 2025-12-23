/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Biography Web                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    23-12-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////
// * CUSTOM XHR MANAGER * //
////////////////////////////
/**
 * A custom XMLHttpRequest Manager
 * Provides custom async XHR with request tracking or ActiveX fallback.
 *
 * @requires utils.HTTPRequestAsync (optional, falls back to ActiveX)
 */
class BioXMLHttpRequestManager {
	/**
	 * Creates the `BioXMLHttpRequestManager` instance.
	 */
	constructor() {
		/** @type {Map<number, BioXMLHttpRequest>} Active requests by task ID */
		this.requests = new Map();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Registers task with request instance.
	 * @param {number} taskId - Task ID from utils.HTTPRequestAsync.
	 * @param {BioXMLHttpRequest} request
	 */
	addRequest(taskId, request) {
		this.requests.set(taskId, request);
	}

	/**
	 * Creates XMLHttpRequest instance.
	 * @param {boolean} [bBuiltIn=true] - Use custom impl (true) or ActiveX (false).
	 * @returns {BioXMLHttpRequest|ActiveXObject}
	 */
	createRequest(bBuiltIn = true) {
		if (typeof utils !== 'undefined' && utils.HTTPRequestAsync && bBuiltIn) {
			return new BioXMLHttpRequest(this);
		}
		return new ActiveXObject('Microsoft.XMLHTTP');
	}

	/**
	 * Removes request from tracking.
	 * @param {number} taskId
	 * @returns {boolean} True if removed.
	 */
	removeRequest(taskId) {
		return this.requests.delete(taskId);
	}

	/**
	 * Aborts all active requests (e.g., on shutdown)
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
	 * @returns {number} Count of active requests
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
	 */
	on_download_file_done(path, success, errorText) {
		if (!success) {
			console.log('Biography - Error saving img:\n\t', errorText);
		}
	}

	/**
	 * The HTTP request completion handler.
	 * Must be called from on_http_request_done() in host class.
	 * @param {number} taskId - Task identifier
	 * @param {boolean} success - Request succeeded
	 * @param {string} responseText - Response body
	 * @param {number|string} status - HTTP status code
	 * @param {string} headers - Response headers (JSON string)
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
 * A Custom XMLHttpRequest compatible with standard XHR API
 * Wraps utils.HTTPRequestAsync for async operations
 */
class BioXMLHttpRequest {
	/**
	 * Creates the `BioXMLHttpRequest` instance.
	 * @param {BioXMLHttpRequestManager} manager - The xhr manager instance.
	 */
	constructor(manager) {
		// Instance
		/** @public @type {BioXMLHttpRequestManager} Reference to the manager instance */
		this.manager = manager;

		// Internal state
		/** @private @type {number|null} Task ID from utils.HTTPRequestAsync */
		this.id = null;
		/** @private @type {string|null} Request URL */
		this.url = null;
		/** @private @type {number} HTTP method (0=GET, 1=POST) */
		this.type = 0;
		/** @private @type {Object|null} Request headers (lazy init for memory efficiency) */
		this.headers = null;
		/** @private @type {boolean} Abort flag */
		this.aborted = false;

		// XHR standard state
		/** @private @type {number} XHR ready state (0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 4=DONE) */
		this._readyState = 0;
		/** @private @type {string|null} Response headers */
		this._responseHeaders = null;
		/** @private @type {string|null} Response body text */
		this._responseText = null;
		/** @private @type {number} HTTP status code */
		this._status = 0;

		// Pre-bind legacy methods
		/** @private @type {Function} Bound reference to the open() method for PascalCase compatibility. */
		this._boundOpen = this.open.bind(this);
		/** @private @type {Function} Bound reference to the setRequestHeader() method for PascalCase compatibility. */
		this._boundSetRequestHeader = this.setRequestHeader.bind(this);
		/** @private @type {Function} Bound reference to the send() method for PascalCase compatibility. */
		this._boundSend = this.send.bind(this);
		/** @private @type {Function} Bound reference to the abort() method for PascalCase compatibility. */
		this._boundAbort = this.abort.bind(this);

		// Callback
		/** @public @type {Function|null} Ready state change callback */
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
	 * @returns {Function} Bound setRequestHeader method.
	 */
	get SetRequestHeader() {
		return this._boundSetRequestHeader;
	}

	/**
	 * Legacy method: Aborts request if in progress (PascalCase alias for abort).
	 * @returns {Function} Bound abort method.
	 */
	get Abort() {
		return this._boundAbort;
	}

	/**
	 * Legacy method: Initializes request (PascalCase alias for open).
	 * @returns {Function} Bound open method.
	 */
	get Open() {
		return this._boundOpen;
	}

	/**
	 * Legacy method: Sends HTTP request (PascalCase alias for send).
	 * @returns {Function} Bound send method.
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
	 * Finalizes request with response (called by manager)
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
	 * Resets to UNSENT state
	 * @param {boolean} emitCallback - Trigger onreadystatechange
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
	 * Safely invokes onreadystatechange callback
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
	 * Aborts request if in progress
	 */
	abort() {
		if (this._readyState === 0 || this._readyState === 4) return;
		this.aborted = true;
		this._reset(true); // Trigger callback on abort (XHR standard behavior)
	}

	/**
	 * Initializes request (allows reuse after completion/abort per XHR spec)
	 * @param {string} type - HTTP method (GET/POST)
	 * @param {string} url - Request URL
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
	 * Sets HTTP header (after open, before send)
	 * @param {string} key - Header name
	 * @param {string} value - Header value
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
	 * Sends HTTP request
	 * @param {string} [body] - Request body (POST only)
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
	 * @param {string|Array<Object>} fileOrData - File path or data array.
	 * @returns {Array<Object>|null} Parsed data or null.
	 * @private
	 */
	_parseData(fileOrData) {
		return typeof fileOrData === 'string' ? $Bio.jsonParse(fileOrData, null, 'file-utf8') : fileOrData;
	}

	/**
	 * Generates lookup key for artist with optional MBID.
	 * @param {string} artist - Artist name.
	 * @param {string} [mbid] - MusicBrainz ID.
	 * @returns {string} Composite key.
	 * @private
	 */
	_getKey(artist, mbid = '') {
		return `${artist}|${mbid}`;
	}

	/**
	 * Sorts artist values by score in descending order.
	 * @param {Array<Object>} data - Artist data array.
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
	 * @param {string} file - File path.
	 * @param {Array<Object>} data - Data to save.
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
	 * Merges similar artist data from file with new data.
	 * Creates a unified dataset, updating existing entries and adding new ones.
	 * All artist entries are sorted by score in descending order.
	 * @param {string|Array<Object>} fileOrData - File path to JSON data or parsed data array.
	 *   Each object should have: { artist: string, mbid?: string, val: Array<{score: number}> }
	 * @param {Array<Object>|null} [newData=null] - New data to merge with existing data.
	 * @returns {Array<Object>|null} Merged and sorted data array, or null if no data available.
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
	 * Checks if file data already contains all entries from new data.
	 * Used to avoid unnecessary file writes when data hasn't changed.
	 * @param {string|Array<Object>} fileOrData - File path to JSON data or parsed data array.
	 * @param {Array<Object>} newData - New data to check against existing data.
	 * @returns {boolean} True if all new data entries exist in file data, false otherwise.
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
	 * @param {string} file - Path to the JSON cache file.
	 * @param {Array<Object>} newData - New artist data to add/update.
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
