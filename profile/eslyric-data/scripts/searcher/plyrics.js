import { parse } from 'himalaya/src/index.js';

export function getConfig(cfg) {
	cfg.name = 'PLyrics (Unsynced)';
	cfg.version = '0.1';
	cfg.author = 'TT';
	cfg.useRawMeta = false;
}

export function getLyrics(meta, man) {
	const Clean = (text) => text
		.replace(/\(.*\)|{.*}|\[.*\]|【.*】/g, '').normalize().trim().toLowerCase()
		.replace(/[^a-z0-9\- ]/g, '')
		.replace(/@/g, 'at')
		.replace(/&/g, 'and')
		.replace(/ /g, '_') // PLyrics formatting - identify
		.replace(/the_/g, '') // PLyrics formatting - capture
		.replace(/_/g, ''); // PLyrics formatting - clean up

	const artist = Clean(meta.artist);
	const title = Clean(meta.title);
	const url = `http://www.plyrics.com/lyrics/${artist}/${title}.html`;
	const settings = { url,	timeout: 5000 };

	if (artist === '' || title === '') return;

	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		let lyricText = findLyrics(body);
		lyricText = parseLyrics(lyricText);

		const lyricMeta = man.createLyric();
		lyricMeta.title = meta.title;
		lyricMeta.artist = meta.artist;
		lyricMeta.lyricText = lyricText;
		lyricMeta.location = url;
		man.addLyric(lyricMeta);
	});
}

function findLyrics(content) {
	const startLyrics = '<!-- start of lyrics -->';
	const endLyrics = '<!-- end of lyrics -->';
	const startIndex = content.indexOf(startLyrics);
	const endIndex = content.indexOf(endLyrics);

	if (startIndex !== -1 && endIndex !== -1) {
		return content.substring(startIndex + startLyrics.length, endIndex).trim();
	}

	return '';
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
	.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/gi, ' ') // Whitespace variants
	.replace(/<br \/>/gi, ''); // PLyrics formatting

	return Clean(lyricText);
}
