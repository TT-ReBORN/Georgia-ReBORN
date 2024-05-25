import { parse } from 'himalaya/src/index.js';

export function getConfig(cfg) {
	cfg.name = 'LRCLIB (Mixed)';
	cfg.version = '0.1';
	cfg.author = 'TT';
	cfg.useRawMeta = false;
}

export function getLyrics(meta, man) {
	const Clean = (text) => text
		.replace(/\(.*\)|{.*}|\[.*\]|【.*】/g, '')
		.normalize().trim().toLowerCase()
		.replace(/[^a-z0-9\- ]/g, '')
		.replace(/@/g, 'at')
		.replace(/&/g, 'and');

	const artist = Clean(meta.artist);
	const album = Clean(meta.album);
	const title = Clean(meta.title);
	const duration = Math.ceil(meta.duration);
	const url = `https://lrclib.net/api/get?artist_name=${artist}&track_name=${title}&album_name=${album}&duration=${duration}`;
	const settings = { url,	timeout: 5000 };

	if (artist === '' || album === '' || title === '') return;

	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		let lyricText = findLyrics(body);
		lyricText = parseLyrics(lyricText);

		const lyricMeta = man.createLyric();
		lyricMeta.title = meta.title;
		lyricMeta.album = meta.album;
		lyricMeta.artist = meta.artist;
		lyricMeta.lyricText = lyricText;
		lyricMeta.location = url;
		man.addLyric(lyricMeta);
	});
}

function findLyrics(content) {
	const json = JSON.parse(content);
	const lyrics = (json.syncedLyrics && json.syncedLyrics.trim()) || json.plainLyrics;
	// Check if syncedLyrics is a non-empty string, otherwise fall back to plainLyrics
	return lyrics.trim();
}

function parseLyrics(lyricText) {
	const Clean = (rawString) => rawString.trim()
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16))) // HTML characters decode
		.replace(/&amp(;|)/gi, '&')
		.replace(/&gt(;|)/gi, '>')
		.replace(/&lt(;|)/gi, '<')
		.replace(/&nbsp(;|)/gi, '')
		.replace(/&quot(;|)/gi, '"')
		.replace(/<br>/gi, '')
		.replace(/\uFF1A/gi, ':')
		.replace(/\uFF08/gi, '(')
		.replace(/\uFF09/gi, ')')
		.replace(/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(;|)|â€˜(;|)|&apos(;|)|&#39(;|)|(&#(?:039|8216|8217|8220|8221|8222|8223|x27);)/gi, "'") // Apostrophe variants
		.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/gi, ' '); // Whitespace variants

	return Clean(lyricText);
}
