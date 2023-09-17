/**
 * https://github.com/Binaryify/NeteaseCloudMusicApi
 * https://github.com/entronad/crypto-es
 */

import crypto from 'crypto-es/lib/index.js';

evalLib('querystring/querystring.min.js');

const iv = crypto.enc.Latin1.parse('0102030405060708');
const linuxapiKey = crypto.enc.Latin1.parse('rFgB&h#%2?^eDg:Q');
const anonymousToken = 'bf8bfeabb1aa84f9c8c3906c04a04fb864322804c83f5d607e91a04eae463c9436bd1a17ec353cf780b396507a3f7464e8a60f4bbc019437993166e004087dd32d1490298caf655c2353e58daa0bc13cc7d5c198250968580b12c1b8817e3f5c807e650dd04abd3fb8130b7ae43fcc5b';

const aesEncrypt = (buffer, mode, key, iv) => {
	const cipher = crypto.AES.encrypt(buffer, key, { mode, iv })
	return cipher.ciphertext;
};

const linuxapi = (object) => {
	const text = JSON.stringify(object);
	return {
		eparams: aesEncrypt(crypto.enc.Utf8.parse(text), crypto.mode.ECB, linuxapiKey, iv).toString(crypto.enc.Hex).toUpperCase()
	}
};

const doRequest = (method, url, data, options) => new Promise((resolve, reject) => {
	const headers = {};

	if (method.toUpperCase() === 'POST') {
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}

	if (url.includes('music.163.com')) {
		headers.Referer = 'https://music.163.com';
	}

	if (options.crypto === 'linuxapi') {
		data = linuxapi({
			method,
			url: url.replace(/\w*api/, 'api'),
			params: data
		});
		headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36';
		headers.Cookie = `MUSIC_A=${anonymousToken}`;
		url = 'https://music.163.com/api/linux/forward';
	} else {
		reject(new Error('Promise rejected: Invalid options.crypto value. Expected "linuxapi"'));
		return;
	}

	const settings = {
		method,
		url,
		headers,
		body: querystring.stringify(data)
	};

	request(settings, (err, res, body) => {
		if (!err && res.statusCode === 200) {
			resolve(body);
		} else {
			reject(err, res);
		}
	});
}).catch(error => console.log(error.message));

export function getConfig(config) {
	config.name = 'NetEase 网易云音乐 - English (Synced)';
	config.version = '0.4';
	config.author = 'ohyeah & TT';
}

export function getLyrics(meta, man) {
	const Clean = (str) => str.toLowerCase()
		.replace(/'|·|\$|&|–/g, '')
		.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, '')
		.replace(/[-/:-@[-`{-~]+/g, '')
		.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, '');

	const title = Clean(meta.rawTitle);
	const artist = Clean(meta.rawArtist);
	const data = {
		s: `${title} ${artist}`,
		type: 1,
		limit: 10,
		offset: 0
	};

	doRequest('POST', 'https://music.163.com/weapi/search/get', data, { crypto: 'linuxapi' }).then((body) => {
		let candicates = [];
		candicates = parseSearchResults(body);

		for (const item of candicates) {
			const queryData = { id: item.id };
			doRequest('POST', 'https://music.163.com/weapi/song/lyric?lv=-1&kv=-1&tv=-1', queryData, { crypto: 'linuxapi' }).then((body) => {
				parseLyricResponse(item, man, body);
			});
		}
	});

	// loop to 'wait' callback(promise)
	messageLoop(0);
}

function parseSearchResults(body) {
	const candicates = [];

	try {
		const obj = JSON.parse(body);
		const results = obj.result || {};
		const songs = results.songs || [];

		for (const song of songs) {
			if (typeof (song.id) === 'undefined' || typeof (song.name) === 'undefined') {
				continue;
			}

			const id = song.id;
			const title = song.name;
			let artist = '';
			const artists = song.artists || [];
			let album = song.album || {};

			for (const item of artists) {
				if ('name' in item) {
					artist = item.name;
					break;
				}
			}

			album = album.name || '';
			candicates.push({ id, title, artist, album });
		}
	} catch (e) { }

	return candicates;
}

function parseLyricResponse(item, man, body) {
	try {
		const lyricObj = JSON.parse(body);
		let lyricText = '';

		if (lyricObj.lrc) {
			lyricText = lyricObj.lrc.lyric || '';
			const version = lyricObj.lrc.version || 0;
			if (version === 1) return;
		}

		if (lyricObj.tlyric) {
			lyricText += lyricObj.tlyric.lyric || '';
		}

		lyricText = removeAsianChars(lyricText);

		const meta = man.createLyric();
		meta.title = item.title;
		meta.artist = item.artist;
		meta.album = item.album;
		meta.lyricText = lyricText;
		man.addLyric(meta);

		// lyricText = '';
		// if (lyricObj.klyric) {
		// 	lyricText = lyricObj.klyric.lyric || '';
		// }

		// if (lyricText !== '') {
		// 	meta.title += ' (Enhanced LRC)';
		// 	meta.lyricText = parseKLyric(lyricText);
		// 	console.log(meta.lyricText);
		// 	man.addLyric(meta);
		// }
	} catch (e) {
		console.log(e);
	}
}

function parseKLyric(lyricText) {
	const metaRegex = /^\[(\S+):(\S+)\]$/;
	const timestampsRegex = /^\[(\d+),(\d+)\]/;
	const timestamps2Regex = /\((\d+),(\d+)\)([^(]*)/g;
	const lines = lyricText.split(/[\r\n]/);
	let enhancedlyricText = '';
	let matches;

	for (const line of lines) {
		if ((matches = metaRegex.exec(line))) { // meta info
			enhancedlyricText += `${matches[0]}\r\n`;
		}
		else if ((matches = timestampsRegex.exec(line))) {
			let lyricLine = '';
			const startTime = parseInt(matches[1]);
			const duration = parseInt(matches[2]);
			lyricLine = `[${formatTime(startTime)}]`;
			// parse sub-timestamps
			let subMatches;
			let subStartTime = startTime;

			while ((subMatches = timestamps2Regex.exec(line))) {
				const subDuration = parseInt(subMatches[2]);
				const subWord = subMatches[3];
				lyricLine += `<${formatTime(subStartTime)}>${subWord}`;
				subStartTime += subDuration;
			}

			lyricLine += `<${formatTime(startTime + duration)}>`;
			enhancedlyricText += `${lyricLine}\r\n`;
		}
	}

	return enhancedlyricText;
}

function formatTime(time) {
	const zpad = (n) => {
		const s = n.toString();
		return (s.length < 2) ? `0${s}` : s;
	};

	let t = Math.abs(time / 1000);
	const h = Math.floor(t / 3600);
	t -= h * 3600;

	const m = Math.floor(t / 60);
	t -= m * 60;

	const s = Math.floor(t);
	const ms = t - s;

	return `${(h ? `${zpad(h)}:` : '') + zpad(m)}:${zpad(s)}.${zpad(Math.floor(ms * 100))}`;
}

function removeAsianChars(text) {
	return text.trim()
		.replace(/\[\d+:\d+\.\d+\].*[\u2E80-\u2FFF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF].*/g, '') // Chinese chars
		.replace(/\[\d+:\d+\.\d+\].*[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF66-\uFF9F].*/g, '') // Japanese chars
		.replace(/\[\d+:\d+\.\d+\].*[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7A3\uFFA0-\uFFDC\uD7B0-\uD7FF].*/g, '') // Korean chars
		.replace(/\[\d+:\d+\.\d+\].*(?:\p{Script=Han}|\p{Script=Hiragana}|\p{Script=Katakana}|\p{Script=Hangul})/gu, '') // All CJK chars combined, just in case
		.replace(/^\[.*\]$/gm, '') // Brackets
		.replace(/^\s*[\r\n]/gm, ''); // Empty lines
}
