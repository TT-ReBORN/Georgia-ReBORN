'use strict';
//29/10/24

class RequestAllmusic {
	constructor() {
		this.request = null;
		this.timer = null;
		this.checkResponse = null;
	}

	abortRequest() {
		if (!this.request) return;
		clearTimeout(this.timer);
		clearInterval(this.checkResponse);
		this.request.Abort();
		this.request = null;
		this.timer = null;
		this.checkResponse = null;
	}

	onStateChange(resolve, reject, func = null) { // credit regorxxx
		if (this.request !== null) {
			if (this.request.Status === 200) {
				return func ? func(this.request.ResponseText, this.request) : resolve(this.request.ResponseText);
			} else if (!func) {
				return reject(this.request.ResponseText);
			}
		} else if (!func) {
			return reject({ status: 408, responseText: 'Request Timeout' });
		}
		return null;
	}

	send({ method = 'GET', URL, body = void (0), func = null, requestHeader = [], bypassCache = false, timeout = 5000 }) { // credit regorxxx
		this.abortRequest();

		return new Promise((resolve, reject) => {
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#bypassing_the_cache
			// Add ('&' + new Date().getTime()) to URLS to avoid caching
			const fullUrl = URL + (bypassCache ? (/\?/.test(URL) ? '&' : '?') + new Date().getTime() : '');
			this.request = new ActiveXObject('WinHttp.WinHttpRequest.5.1');
			this.request.Open(method, fullUrl, true);

			requestHeader.forEach(pair => {
				if (!pair[0] || !pair[1]) {
					console.log(`HTTP Headers missing: ${pair}`);
					return;
				}
				this.request.SetRequestHeader(...pair);
			});

			if (bypassCache) {
				this.request.SetRequestHeader('Cache-Control', 'private');
				this.request.SetRequestHeader('Pragma', 'no-cache');
				this.request.SetRequestHeader('Cache', 'no-cache');
				this.request.SetRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
			}

			this.request.SetTimeouts(timeout, timeout, timeout, timeout);
			this.request.Send(method === 'POST' ? body : void (0));

			this.timer = setTimeout(() => {
				clearInterval(this.checkResponse);
				try {
					this.request.WaitForResponse(-1);
					this.onStateChange(resolve, reject, func);
				} catch (e) {
					let status = 400;
					if (e.message.indexOf('0x80072ee7') !== -1) {
						status = 400;
					} else if (e.message.indexOf('0x80072ee2') !== -1) {
						status = 408;
					} else if (e.message.indexOf('0x8000000a') !== -1) {
						status = 408;
					}
					this.abortRequest();
					reject({ status, responseText: e.message });
				}
			}, timeout);

			this.checkResponse = setInterval(() => {
				let response;
				try {
					response = this.request.Status && this.request.ResponseText;
				} catch (e) {}
				if (!response) return;
				this.onStateChange(resolve, reject, func);
			}, 30);
		});
	}
}


function _firstElement(obj, tag_name) {
	try {
		return _.first(obj.getElementsByTagName(tag_name));
	} catch (e) {}

	return undefined;
}